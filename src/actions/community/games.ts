"use server";

import db from "@/db";
import { serverAuth } from "@/lib/server-auth";
import {
  games,
  gameQuestions,
  gameSubmissions,
  gameRewards,
  badges,
  userBadges,
  userPoints,
  leaderboard,
  user,
} from "@/db/schema";
import { and, desc, eq, sql, asc, or } from "drizzle-orm";

export async function getActiveGames({
  page = 1,
  limit = 10,
  type,
  difficulty,
  search,
}: {
  page?: number;
  limit?: number;
  type?: "quiz" | "writing_challenge" | "puzzle";
  difficulty?: "easy" | "medium" | "hard";
  search?: string;
}) {
  const session = await serverAuth();

  if (!session?.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const offset = (page - 1) * limit;
    const whereConditions = [
      eq(games.status, "published"),
      or(sql`${games.expiresAt} IS NULL`, sql`${games.expiresAt} > NOW()`),
    ];

    if (type) {
      whereConditions.push(eq(games.type, type));
    }

    if (difficulty) {
      whereConditions.push(eq(games.difficulty, difficulty));
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
        instructions: games.instructions,
        config: games.config,
        publishedAt: games.publishedAt,
        expiresAt: games.expiresAt,
        submissionCount: sql<number>`(
          SELECT COUNT(*) 
          FROM ${gameSubmissions} 
          WHERE ${gameSubmissions.gameId} = ${games.id}
        )`,
        userParticipated: sql<boolean>`(
          SELECT COUNT(*) > 0 
          FROM ${gameSubmissions} 
          WHERE ${gameSubmissions.gameId} = ${games.id}
          AND ${gameSubmissions.userId} = ${session.user.id}
        )`,
      })
      .from(games)
      .where(and(...whereConditions))
      .orderBy(desc(games.publishedAt))
      .limit(limit)
      .offset(offset);

    const [{ totalCount }] = await db
      .select({ totalCount: sql<number>`count(*)` })
      .from(games)
      .where(and(...whereConditions));

    return {
      success: true,
      data: gamesData,
      total: totalCount,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching active games:", error);
    return {
      success: false,
      message: "Failed to fetch games",
    };
  }
}

export async function getGameById({ gameId }: { gameId: string }) {
  const session = await serverAuth();

  if (!session?.user) {
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
        config: games.config,
        status: games.status,
        publishedAt: games.publishedAt,
        expiresAt: games.expiresAt,
        userParticipated: sql<boolean>`(
          SELECT COUNT(*) > 0 
          FROM ${gameSubmissions} 
          WHERE ${gameSubmissions.gameId} = ${games.id}
          AND ${gameSubmissions.userId} = ${session.user.id}
        )`,
      })
      .from(games)
      .where(eq(games.id, gameId));

    if (!game) {
      return {
        success: false,
        message: "Game not found",
      };
    }

    const [userSubmission] = await db
      .select({
        id: gameSubmissions.id,
        answers: gameSubmissions.answers,
        score: gameSubmissions.score,
        isWinner: gameSubmissions.isWinner,
      })
      .from(gameSubmissions)
      .where(
        and(
          eq(gameSubmissions.gameId, gameId),
          eq(gameSubmissions.userId, session.user.id)
        )
      )
      .limit(1);

    if (game.type === "quiz") {
      const questions = await db
        .select({
          id: gameQuestions.id,
          question: gameQuestions.question,
          type: gameQuestions.type,
          options: gameQuestions.options,
          points: gameQuestions.points,
          order: gameQuestions.order,
        })
        .from(gameQuestions)
        .where(eq(gameQuestions.gameId, gameId))
        .orderBy(asc(gameQuestions.order));

      return {
        success: true,
        data: {
          ...game,
          userSubmission: userSubmission || null,
          questions,
        },
      };
    }

    return {
      success: true,
      data: {
        ...game,
        userSubmission: userSubmission || null,
      },
    };
  } catch (error) {
    console.error("Error fetching game:", error);
    return {
      success: false,
      message: "Failed to fetch game",
    };
  }
}

export async function submitGameEntry({
  gameId,
  answers,
}: {
  gameId: string;
  answers: Record<string, unknown>;
}) {
  const session = await serverAuth();

  if (!session?.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const game = await db
      .select({
        id: games.id,
        type: games.type,
        status: games.status,
        config: games.config,
        expiresAt: games.expiresAt,
      })
      .from(games)
      .where(eq(games.id, gameId))
      .limit(1);

    if (!game.length) {
      return {
        success: false,
        message: "Game not found",
      };
    }

    if (game[0].status !== "published") {
      return {
        success: false,
        message: "Game is not available",
      };
    }

    if (game[0].expiresAt && new Date() > game[0].expiresAt) {
      return {
        success: false,
        message: "Game has expired",
      };
    }

    const existingSubmission = await db
      .select({ id: gameSubmissions.id })
      .from(gameSubmissions)
      .where(
        and(
          eq(gameSubmissions.gameId, gameId),
          eq(gameSubmissions.userId, session.user.id)
        )
      )
      .limit(1);

    if (existingSubmission.length > 0) {
      return {
        success: false,
        message: "You have already submitted an entry for this game",
      };
    }

    let score = 0;

    if (game[0].type === "quiz") {
      const questions = await db
        .select({
          id: gameQuestions.id,
          type: gameQuestions.type,
          correctAnswer: gameQuestions.correctAnswer,
          points: gameQuestions.points,
        })
        .from(gameQuestions)
        .where(eq(gameQuestions.gameId, gameId));

      for (const question of questions) {
        const userAnswer = answers[question.id];
        const correctAnswer = question.correctAnswer;

        if (
          question.type === "multiple_choice" ||
          question.type === "true_false"
        ) {
          if (Array.isArray(correctAnswer)) {
            if (
              Array.isArray(userAnswer) &&
              userAnswer.length === correctAnswer.length &&
              userAnswer.every((ans) => correctAnswer.includes(ans))
            ) {
              score += question.points;
            }
          } else if (userAnswer === correctAnswer) {
            score += question.points;
          }
        } else if (question.type === "short_answer") {
          const userAnswerStr = String(userAnswer).toLowerCase().trim();
          const correctAnswerStr = String(correctAnswer).toLowerCase().trim();
          if (userAnswerStr === correctAnswerStr) {
            score += question.points;
          }
        }
      }
    }

    const [submission] = await db
      .insert(gameSubmissions)
      .values({
        gameId,
        userId: session.user.id,
        answers,
        score,
      })
      .returning();

    await awardParticipationRewards({ gameId, userId: session.user.id });

    return {
      success: true,
      message: "Submission successful",
      data: {
        submission,
        score,
      },
    };
  } catch (error) {
    console.error("Error submitting game entry:", error);
    return {
      success: false,
      message: "Failed to submit entry",
    };
  }
}

export async function getUserGameStatus({ gameId }: { gameId: string }) {
  const session = await serverAuth();

  if (!session?.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const submission = await db
      .select({
        id: gameSubmissions.id,
        answers: gameSubmissions.answers,
        score: gameSubmissions.score,
        isWinner: gameSubmissions.isWinner,
        submittedAt: gameSubmissions.submittedAt,
        feedback: gameSubmissions.feedback,
      })
      .from(gameSubmissions)
      .where(
        and(
          eq(gameSubmissions.gameId, gameId),
          eq(gameSubmissions.userId, session.user.id)
        )
      )
      .limit(1);

    return {
      success: true,
      data: submission.length > 0 ? submission[0] : null,
    };
  } catch (error) {
    console.error("Error fetching user game status:", error);
    return {
      success: false,
      message: "Failed to fetch game status",
    };
  }
}

export async function getUserBadges({ userId }: { userId: string }) {
  try {
    const userBadgesData = await db
      .select({
        id: userBadges.id,
        earnedAt: userBadges.earnedAt,
        displayOnProfile: userBadges.displayOnProfile,
        badge: {
          id: badges.id,
          name: badges.name,
          description: badges.description,
          icon: badges.icon,
          type: badges.type,
          rarity: badges.rarity,
        },
      })
      .from(userBadges)
      .leftJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, userId))
      .orderBy(desc(userBadges.earnedAt));

    return {
      success: true,
      data: userBadgesData,
    };
  } catch (error) {
    console.error("Error fetching user badges:", error);
    return {
      success: false,
      message: "Failed to fetch badges",
    };
  }
}

export async function getUserPoints({ userId }: { userId: string }) {
  try {
    const [{ totalPoints }] = await db
      .select({
        totalPoints: sql<number>`COALESCE(SUM(${userPoints.points}), 0)`,
      })
      .from(userPoints)
      .where(eq(userPoints.userId, userId));

    return {
      success: true,
      data: {
        totalPoints,
      },
    };
  } catch (error) {
    console.error("Error fetching user points:", error);
    return {
      success: false,
      message: "Failed to fetch points",
    };
  }
}

export async function getLeaderboard({
  limit = 50,
  timeframe = "all",
}: {
  limit?: number;
  timeframe?: "all" | "monthly" | "weekly";
}) {
  try {
    const whereConditions = [];

    if (timeframe === "monthly") {
      whereConditions.push(
        sql`${leaderboard.updatedAt} >= NOW() - INTERVAL '1 month'`
      );
    } else if (timeframe === "weekly") {
      whereConditions.push(
        sql`${leaderboard.updatedAt} >= NOW() - INTERVAL '1 week'`
      );
    }

    const leaderboardData = await db
      .select({
        userId: leaderboard.userId,
        totalPoints: leaderboard.totalPoints,
        totalWins: leaderboard.totalWins,
        totalParticipation: leaderboard.totalParticipation,
        rank: leaderboard.rank,
        lastActivityAt: leaderboard.lastActivityAt,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          displayUsername: user.displayUsername,
          image: user.image,
        },
      })
      .from(leaderboard)
      .leftJoin(user, eq(leaderboard.userId, user.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(asc(leaderboard.rank))
      .limit(limit);

    return {
      success: true,
      data: leaderboardData,
    };
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return {
      success: false,
      message: "Failed to fetch leaderboard",
    };
  }
}

export async function getUserRank({ userId }: { userId: string }) {
  try {
    const [userRank] = await db
      .select({
        rank: leaderboard.rank,
        totalPoints: leaderboard.totalPoints,
        totalWins: leaderboard.totalWins,
        totalParticipation: leaderboard.totalParticipation,
      })
      .from(leaderboard)
      .where(eq(leaderboard.userId, userId))
      .limit(1);

    return {
      success: true,
      data: userRank || {
        rank: null,
        totalPoints: 0,
        totalWins: 0,
        totalParticipation: 0,
      },
    };
  } catch (error) {
    console.error("Error fetching user rank:", error);
    return {
      success: false,
      message: "Failed to fetch user rank",
    };
  }
}

async function awardParticipationRewards({
  gameId,
  userId,
}: {
  gameId: string;
  userId: string;
}) {
  try {
    const participationRewards = await db
      .select()
      .from(gameRewards)
      .where(
        and(
          eq(gameRewards.gameId, gameId),
          eq(gameRewards.forParticipation, true)
        )
      );

    for (const reward of participationRewards) {
      switch (reward.rewardType) {
        case "badge":
          if (reward.rewardValue.badgeId) {
            await db.insert(userBadges).values({
              userId,
              badgeId: reward.rewardValue.badgeId as string,
              gameId,
              displayOnProfile: true,
            });
          }
          break;

        case "points":
          if (reward.rewardValue.points) {
            await db.insert(userPoints).values({
              userId,
              points: reward.rewardValue.points as number,
              source: "participation",
              gameId,
              description: "Points for participating in game",
            });
          }
          break;
      }
    }

    const { updateLeaderboard } = await import("@/actions/admin/games");
    await updateLeaderboard();
  } catch (error) {
    console.error("Error awarding participation rewards:", error);
  }
}
