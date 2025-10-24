"use server";

import db from "@/db";
import { serverAuth } from "@/lib/server-auth";
import {
  games,
  gameSubmissions,
  gameQuestions,
  badges,
  userBadges,
  userPoints,
  gameRewards,
  leaderboard,
  discountCodes,
  bookCredits,
  user,
} from "@/db/schema";
import { and, asc, desc, eq, sql, or } from "drizzle-orm";

export async function getGameForAdmin({ gameId }: { gameId: string }) {
  const session = await serverAuth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const [game] = await db
      .select({
        id: games.id,
        title: games.title,
        description: games.description,
        type: games.type,
        difficulty: games.difficulty,
        instructions: games.instructions,
        status: games.status,
        expiresAt: games.expiresAt,
        config: games.config,
        createdAt: games.createdAt,
        publishedAt: games.publishedAt,
      })
      .from(games)
      .where(eq(games.id, gameId))
      .limit(1);

    if (!game) {
      return {
        success: false,
        message: "Game not found",
      };
    }

    const rewards = await db
      .select({
        rewardType: gameRewards.rewardType,
        rewardValue: gameRewards.rewardValue,
        forWinner: gameRewards.forWinner,
        forParticipation: gameRewards.forParticipation,
      })
      .from(gameRewards)
      .where(eq(gameRewards.gameId, gameId));

    if (game.type === "quiz") {
      const questions = await db
        .select({
          id: gameQuestions.id,
          question: gameQuestions.question,
          type: gameQuestions.type,
          options: gameQuestions.options,
          correctAnswer: gameQuestions.correctAnswer,
          points: gameQuestions.points,
          order: gameQuestions.order,
        })
        .from(gameQuestions)
        .where(eq(gameQuestions.gameId, gameId))
        .orderBy(asc(gameQuestions.order));

      const configWithQuestions = {
        ...((game.config as Record<string, unknown>) || {}),
        questions: questions.map((q) => ({
          id: q.id,
          questionText: q.question,
          questionType: q.type,
          options: q.options,
          correctAnswer: q.correctAnswer,
          points: q.points,
          order: q.order,
        })),
      };

      return {
        success: true,
        data: {
          ...game,
          config: configWithQuestions,
          rewards,
        },
      };
    }

    return {
      success: true,
      data: {
        ...game,
        rewards,
      },
    };
  } catch (error) {
    console.error("Error fetching game for admin:", error);
    return {
      success: false,
      message: "Failed to fetch game",
    };
  }
}

export async function createGame({
  title,
  description,
  type,
  difficulty,
  instructions,
  config,
  rewards,
}: {
  title: string;
  description: string;
  type: "quiz" | "writing_challenge" | "puzzle";
  difficulty: "easy" | "medium" | "hard";
  instructions?: string;
  config?: Record<string, unknown>;
  rewards?: Array<{
    rewardType: "badge" | "points" | "discount_code" | "book_credit";
    rewardValue: Record<string, unknown>;
    forWinner: boolean;
    forParticipation: boolean;
  }>;
}) {
  const session = await serverAuth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const [newGame] = await db
      .insert(games)
      .values({
        title,
        description,
        type,
        difficulty,
        instructions,
        config,
        createdBy: session.user.id,
        status: "draft",
      })
      .returning();

    if (rewards && rewards.length > 0) {
      await db.insert(gameRewards).values(
        rewards.map((reward) => ({
          gameId: newGame.id,
          rewardType: reward.rewardType,
          rewardValue: reward.rewardValue,
          forWinner: reward.forWinner,
          forParticipation: reward.forParticipation,
        }))
      );
    }

    if (type === "quiz" && config?.questions) {
      const questions = config.questions as Array<{
        id?: string;
        questionText: string;
        questionType: string;
        options: string[];
        correctAnswer: string | string[];
        points: number;
        order: number;
      }>;

      if (questions.length > 0) {
        await db.insert(gameQuestions).values(
          questions.map((q) => ({
            gameId: newGame.id,
            question: q.questionText,
            type: q.questionType as
              | "multiple_choice"
              | "true_false"
              | "short_answer",
            options: q.options,
            correctAnswer: q.correctAnswer,
            points: q.points,
            order: q.order,
          }))
        );
      }
    }

    return {
      success: true,
      message: "Game created successfully",
      data: newGame,
    };
  } catch (error) {
    console.error("Error creating game:", error);
    return {
      success: false,
      message: "Failed to create game",
    };
  }
}

export async function updateGame({
  gameId,
  title,
  description,
  type,
  difficulty,
  instructions,
  config,
  status,
  rewards,
}: {
  gameId: string;
  title?: string;
  description?: string;
  type?: "quiz" | "writing_challenge" | "puzzle";
  difficulty?: "easy" | "medium" | "hard";
  instructions?: string;
  config?: Record<string, unknown>;
  status?: "draft" | "published" | "archived";
  rewards?: Array<{
    rewardType: "badge" | "points" | "discount_code" | "book_credit";
    rewardValue: Record<string, unknown>;
    forWinner: boolean;
    forParticipation: boolean;
  }>;
}) {
  const session = await serverAuth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const [existingGame] = await db
      .select({ type: games.type })
      .from(games)
      .where(eq(games.id, gameId))
      .limit(1);

    if (!existingGame) {
      return {
        success: false,
        message: "Game not found",
      };
    }

    const gameType = type || existingGame.type;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (instructions !== undefined) updateData.instructions = instructions;
    if (config !== undefined) updateData.config = config;
    if (status !== undefined) {
      updateData.status = status;
      if (status === "published") {
        updateData.publishedAt = new Date();
      }
    }

    // Always bump updatedAt
    updateData.updatedAt = new Date();

    // Remove undefined and empty-string values to satisfy Drizzle constraints
    for (const key of Object.keys(updateData)) {
      const value = updateData[key];
      if (value === undefined) {
        delete updateData[key];
        continue;
      }
      if (typeof value === "string" && value.trim() === "") {
        delete updateData[key];
      }
    }

    await db.update(games).set(updateData).where(eq(games.id, gameId));

    if (rewards) {
      await db.delete(gameRewards).where(eq(gameRewards.gameId, gameId));
      if (rewards.length > 0) {
        await db.insert(gameRewards).values(
          rewards.map((reward) => ({
            gameId,
            rewardType: reward.rewardType,
            rewardValue: reward.rewardValue,
            forWinner: reward.forWinner,
            forParticipation: reward.forParticipation,
          }))
        );
      }
    }

    if (gameType === "quiz" && config && "questions" in config) {
      await db.delete(gameQuestions).where(eq(gameQuestions.gameId, gameId));
      const questions = config.questions as Array<{
        id?: string;
        questionText: string;
        questionType: string;
        options: string[];
        correctAnswer: string | string[];
        points: number;
        order: number;
      }>;

      if (Array.isArray(questions) && questions.length > 0) {
        await db.insert(gameQuestions).values(
          questions.map((q) => ({
            gameId,
            question: q.questionText,
            type: q.questionType as
              | "multiple_choice"
              | "true_false"
              | "short_answer",
            options: q.options,
            correctAnswer: q.correctAnswer,
            points: q.points,
            order: q.order,
          }))
        );
      }
    }

    return {
      success: true,
      message: "Game updated successfully",
    };
  } catch (error) {
    console.error("Error updating game:", error);
    return {
      success: false,
      message: "Failed to update game",
    };
  }
}

export async function deleteGame({ gameId }: { gameId: string }) {
  const session = await serverAuth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    await db.delete(games).where(eq(games.id, gameId));
    return {
      success: true,
      message: "Game deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting game:", error);
    return {
      success: false,
      message: "Failed to delete game",
    };
  }
}

export async function getGamesForAdmin({
  page = 1,
  limit = 10,
  status,
  type,
  search,
}: {
  page?: number;
  limit?: number;
  status?: "draft" | "published" | "archived";
  type?: "quiz" | "writing_challenge" | "puzzle";
  search?: string;
}) {
  const session = await serverAuth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const offset = (page - 1) * limit;
    const whereConditions = [];

    if (status) {
      whereConditions.push(eq(games.status, status));
    }

    if (type) {
      whereConditions.push(eq(games.type, type));
    }

    if (search) {
      whereConditions.push(
        or(
          sql`${games.title} ILIKE ${`%${search}%`}`,
          sql`${games.description} ILIKE ${`%${search}%`}`
        )
      );
    }

    const gamesData = await db
      .select({
        id: games.id,
        title: games.title,
        description: games.description,
        type: games.type,
        difficulty: games.difficulty,
        status: games.status,
        publishedAt: games.publishedAt,
        createdAt: games.createdAt,
        submissionCount: sql<number>`COALESCE((
          SELECT COUNT(*)::int 
          FROM game_submissions gs
          WHERE gs.game_id = games.id
        ), 0)`,
        winnerCount: sql<number>`COALESCE((
          SELECT COUNT(*)::int 
          FROM game_submissions gs
          WHERE gs.game_id = games.id
          AND gs.is_winner = true
        ), 0)`,
      })
      .from(games)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(games.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ totalCount }] = await db
      .select({ totalCount: sql<number>`count(*)` })
      .from(games)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    return {
      success: true,
      data: gamesData,
      total: totalCount,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching games for admin:", error);
    return {
      success: false,
      message: "Failed to fetch games",
    };
  }
}

export async function getGameSubmissions({
  gameId,
  page = 1,
  limit = 10,
  isWinner,
}: {
  gameId: string;
  page?: number;
  limit?: number;
  isWinner?: boolean;
}) {
  const session = await serverAuth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const offset = (page - 1) * limit;
    const whereConditions = [eq(gameSubmissions.gameId, gameId)];

    if (isWinner !== undefined) {
      whereConditions.push(eq(gameSubmissions.isWinner, isWinner));
    }

    const submissions = await db
      .select({
        id: gameSubmissions.id,
        answers: gameSubmissions.answers,
        submittedAt: gameSubmissions.submittedAt,
        score: gameSubmissions.score,
        isWinner: gameSubmissions.isWinner,
        feedback: gameSubmissions.feedback,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          displayUsername: user.displayUsername,
          image: user.image,
        },
      })
      .from(gameSubmissions)
      .leftJoin(user, eq(gameSubmissions.userId, user.id))
      .where(and(...whereConditions))
      .orderBy(desc(gameSubmissions.submittedAt))
      .limit(limit)
      .offset(offset);

    const [{ totalCount }] = await db
      .select({ totalCount: sql<number>`count(*)` })
      .from(gameSubmissions)
      .where(and(...whereConditions));

    return {
      success: true,
      data: submissions,
      total: totalCount,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching game submissions:", error);
    return {
      success: false,
      message: "Failed to fetch submissions",
    };
  }
}

export async function selectWinners({
  submissionIds,
  gameId,
}: {
  submissionIds: string[];
  gameId: string;
}) {
  const session = await serverAuth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    await db
      .update(gameSubmissions)
      .set({
        isWinner: true,
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
      })
      .where(
        and(
          eq(gameSubmissions.gameId, gameId),
          sql`${gameSubmissions.id} IN (${submissionIds.join(",")})`
        )
      );

    await awardRewards({ gameId, submissionIds });

    return {
      success: true,
      message: "Winners selected and rewards awarded",
    };
  } catch (error) {
    console.error("Error selecting winners:", error);
    return {
      success: false,
      message: "Failed to select winners",
    };
  }
}

export async function awardRewards({
  gameId,
  submissionIds,
  isParticipation = false,
}: {
  gameId: string;
  submissionIds?: string[];
  isParticipation?: boolean;
}) {
  const session = await serverAuth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const gameRewardsData = await db
      .select()
      .from(gameRewards)
      .where(eq(gameRewards.gameId, gameId));

    const submissions = await db
      .select({
        id: gameSubmissions.id,
        userId: gameSubmissions.userId,
        isWinner: gameSubmissions.isWinner,
      })
      .from(gameSubmissions)
      .where(
        and(
          eq(gameSubmissions.gameId, gameId),
          submissionIds
            ? sql`${gameSubmissions.id} IN (${submissionIds.join(",")})`
            : undefined
        )
      );

    for (const submission of submissions) {
      const shouldAward = isParticipation ? true : submission.isWinner;

      if (!shouldAward) continue;

      for (const reward of gameRewardsData) {
        const shouldGiveReward = isParticipation
          ? reward.forParticipation
          : reward.forWinner;

        if (!shouldGiveReward) continue;

        switch (reward.rewardType) {
          case "badge":
            if (reward.rewardValue.badgeId) {
              await db.insert(userBadges).values({
                userId: submission.userId,
                badgeId: reward.rewardValue.badgeId as string,
                gameId,
                displayOnProfile: true,
              });
            }
            break;

          case "points":
            if (reward.rewardValue.points) {
              await db.insert(userPoints).values({
                userId: submission.userId,
                points: reward.rewardValue.points as number,
                source: "game_win",
                gameId,
                description: `Points for ${
                  isParticipation ? "participating in" : "winning"
                } game`,
              });
            }
            break;

          case "discount_code":
            const code = `DISCOUNT${Date.now()}${Math.random()
              .toString(36)
              .substr(2, 5)
              .toUpperCase()}`;
            await db.insert(discountCodes).values({
              code,
              percentage:
                (reward.rewardValue.discountPercentage as number) || 10,
              gameId,
              userId: submission.userId,
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            });
            break;

          case "book_credit":
            if (reward.rewardValue.bookCreditAmount) {
              await db.insert(bookCredits).values({
                amount: reward.rewardValue.bookCreditAmount as number,
                gameId,
                userId: submission.userId,
                expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
              });
            }
            break;
        }
      }
    }

    await updateLeaderboard();

    return {
      success: true,
      message: "Rewards awarded successfully",
    };
  } catch (error) {
    console.error("Error awarding rewards:", error);
    return {
      success: false,
      message: "Failed to award rewards",
    };
  }
}

export async function createBadge({
  name,
  description,
  icon,
  type,
  criteria,
  rarity,
}: {
  name: string;
  description: string;
  icon: string;
  type: "game_winner" | "participation" | "streak" | "milestone";
  criteria?: Record<string, unknown>;
  rarity?: "common" | "rare" | "epic" | "legendary";
}) {
  const session = await serverAuth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const [newBadge] = await db
      .insert(badges)
      .values({
        name,
        description,
        icon,
        type,
        criteria,
        rarity: rarity || "common",
      })
      .returning();

    return {
      success: true,
      message: "Badge created successfully",
      data: newBadge,
    };
  } catch (error) {
    console.error("Error creating badge:", error);
    return {
      success: false,
      message: "Failed to create badge",
    };
  }
}

export async function updateBadge({
  badgeId,
  name,
  description,
  icon,
  type,
  criteria,
  rarity,
}: {
  badgeId: string;
  name?: string;
  description?: string;
  icon?: string;
  type?: "game_winner" | "participation" | "streak" | "milestone";
  criteria?: Record<string, unknown>;
  rarity?: "common" | "rare" | "epic" | "legendary";
}) {
  const session = await serverAuth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (type !== undefined) updateData.type = type;
    if (criteria !== undefined) updateData.criteria = criteria;
    if (rarity !== undefined) updateData.rarity = rarity;

    await db.update(badges).set(updateData).where(eq(badges.id, badgeId));

    return {
      success: true,
      message: "Badge updated successfully",
    };
  } catch (error) {
    console.error("Error updating badge:", error);
    return {
      success: false,
      message: "Failed to update badge",
    };
  }
}

export async function deleteBadge({ badgeId }: { badgeId: string }) {
  const session = await serverAuth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    await db.delete(badges).where(eq(badges.id, badgeId));
    return {
      success: true,
      message: "Badge deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting badge:", error);
    return {
      success: false,
      message: "Failed to delete badge",
    };
  }
}

export async function getBadgesForAdmin({
  page = 1,
  limit = 10,
  type,
  rarity,
  search,
}: {
  page?: number;
  limit?: number;
  type?: "game_winner" | "participation" | "streak" | "milestone";
  rarity?: "common" | "rare" | "epic" | "legendary";
  search?: string;
}) {
  const session = await serverAuth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const offset = (page - 1) * limit;
    const whereConditions = [];

    if (type) {
      whereConditions.push(eq(badges.type, type));
    }

    if (rarity) {
      whereConditions.push(eq(badges.rarity, rarity));
    }

    if (search) {
      whereConditions.push(
        or(
          sql`${badges.name} ILIKE ${`%${search}%`}`,
          sql`${badges.description} ILIKE ${`%${search}%`}`
        )
      );
    }

    const badgesData = await db
      .select({
        id: badges.id,
        name: badges.name,
        description: badges.description,
        icon: badges.icon,
        type: badges.type,
        rarity: badges.rarity,
        createdAt: badges.createdAt,
        usageCount: sql<number>`(
          SELECT COUNT(*) 
          FROM ${userBadges} 
          WHERE ${userBadges.badgeId} = ${badges.id}
        )`,
      })
      .from(badges)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(badges.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ totalCount }] = await db
      .select({ totalCount: sql<number>`count(*)` })
      .from(badges)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    return {
      success: true,
      data: badgesData,
      total: totalCount,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching badges for admin:", error);
    return {
      success: false,
      message: "Failed to fetch badges",
    };
  }
}

export async function getLeaderboardStats() {
  const session = await serverAuth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const stats = await db
      .select({
        totalGames: sql<number>`(
          SELECT COUNT(*) FROM ${games} WHERE ${games.status} = 'published'
        )`,
        totalSubmissions: sql<number>`(
          SELECT COUNT(*) FROM ${gameSubmissions}
        )`,
        totalWinners: sql<number>`(
          SELECT COUNT(*) FROM ${gameSubmissions} WHERE ${gameSubmissions.isWinner} = true
        )`,
        totalBadgesAwarded: sql<number>`(
          SELECT COUNT(*) FROM ${userBadges}
        )`,
        totalPointsAwarded: sql<number>`(
          SELECT COALESCE(SUM(${userPoints.points}), 0) FROM ${userPoints}
        )`,
        topPlayers: sql<
          Array<{
            name: string;
            username: string;
            points: number;
            wins: number;
            rank: number;
          }>
        >`(
          SELECT 
            ${user.name} as name,
            ${user.username} as username,
            ${leaderboard.totalPoints} as points,
            ${leaderboard.totalWins} as wins,
            ${leaderboard.rank} as rank
          FROM ${leaderboard}
          JOIN ${user} ON ${leaderboard.userId} = ${user.id}
          ORDER BY ${leaderboard.totalPoints} DESC
          LIMIT 10
        )`,
      })
      .from(leaderboard)
      .limit(1);

    return {
      success: true,
      data: stats[0] || {
        totalGames: 0,
        totalSubmissions: 0,
        totalWinners: 0,
        totalBadgesAwarded: 0,
        totalPointsAwarded: 0,
        topPlayers: [],
      },
    };
  } catch (error) {
    console.error("Error fetching leaderboard stats:", error);
    return {
      success: false,
      message: "Failed to fetch leaderboard statistics",
    };
  }
}

export async function updateLeaderboard() {
  try {
    const userStats = await db
      .select({
        userId: userPoints.userId,
        totalPoints: sql<number>`COALESCE(SUM(${userPoints.points}), 0)`,
      })
      .from(userPoints)
      .groupBy(userPoints.userId);

    const userWins = await db
      .select({
        userId: gameSubmissions.userId,
        totalWins: sql<number>`CAST(COUNT(*) AS INTEGER)`,
      })
      .from(gameSubmissions)
      .where(eq(gameSubmissions.isWinner, true))
      .groupBy(gameSubmissions.userId);

    const userParticipation = await db
      .select({
        userId: gameSubmissions.userId,
        totalParticipation: sql<number>`CAST(COUNT(*) AS INTEGER)`,
      })
      .from(gameSubmissions)
      .groupBy(gameSubmissions.userId);

    const userActivity = await db
      .select({
        userId: gameSubmissions.userId,
        lastActivityAt: sql<string>`MAX(${gameSubmissions.submittedAt})::text`,
      })
      .from(gameSubmissions)
      .groupBy(gameSubmissions.userId);

    const allUsers = new Set([
      ...userStats.map((u) => u.userId),
      ...userWins.map((u) => u.userId),
      ...userParticipation.map((u) => u.userId),
      ...userActivity.map((u) => u.userId),
    ]);

    for (const userId of allUsers) {
      const stats = userStats.find((u) => u.userId === userId);
      const wins = userWins.find((u) => u.userId === userId);
      const participation = userParticipation.find((u) => u.userId === userId);
      const activity = userActivity.find((u) => u.userId === userId);

      await db
        .insert(leaderboard)
        .values({
          userId,
          totalPoints: Number(stats?.totalPoints || 0),
          totalWins: Number(wins?.totalWins || 0),
          totalParticipation: Number(participation?.totalParticipation || 0),
          lastActivityAt: activity?.lastActivityAt
            ? new Date(activity.lastActivityAt)
            : null,
        })
        .onConflictDoUpdate({
          target: leaderboard.userId,
          set: {
            totalPoints: Number(stats?.totalPoints || 0),
            totalWins: Number(wins?.totalWins || 0),
            totalParticipation: Number(participation?.totalParticipation || 0),
            lastActivityAt: activity?.lastActivityAt
              ? new Date(activity.lastActivityAt)
              : null,
          },
        });
    }

    const rankedUsers = await db
      .select({
        userId: leaderboard.userId,
        totalPoints: leaderboard.totalPoints,
      })
      .from(leaderboard)
      .orderBy(desc(leaderboard.totalPoints));

    for (let i = 0; i < rankedUsers.length; i++) {
      await db
        .update(leaderboard)
        .set({ rank: i + 1 })
        .where(eq(leaderboard.userId, rankedUsers[i].userId));
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating leaderboard:", error);
    return { success: false };
  }
}
