"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { submitGameEntry, getUserGameStatus } from "@/actions/community/games";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Trophy, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import QuizPlayer from "./quiz-player";
import WritingChallengeEditor from "./writing-challenge-editor";
import PuzzlePlayer from "./puzzle-player";

interface Game {
  id: string;
  title: string;
  description: string;
  type: "quiz" | "writing_challenge" | "puzzle";
  difficulty: "easy" | "medium" | "hard";
  instructions: string | null;
  config: {
    timeLimit?: number;
    wordLimit?: number;
    maxAttempts?: number;
    prompt?: string;
    [key: string]: unknown;
  };
  status: string;
  publishedAt: Date | null;
  expiresAt: Date | null;
  userParticipated: boolean;
  userSubmission?: {
    id: string;
    answers: Record<string, unknown>;
    score: number;
    isWinner: boolean;
  } | null;
  questions?: Array<{
    id: string;
    question: string;
    type: string;
    options: string[];
    points: number;
    order: number;
  }>;
}

interface GamePlayerProps {
  game: Game;
}

export default function GamePlayer({ game }: GamePlayerProps) {
  const [currentStep, setCurrentStep] = useState<
    "instructions" | "playing" | "submitted"
  >("instructions");
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const { data: userStatus } = useQuery({
    queryKey: ["user-game-status", game.id],
    queryFn: () => getUserGameStatus({ gameId: game.id }),
  });

  const submitMutation = useMutation({
    mutationFn: (answers: Record<string, unknown>) =>
      submitGameEntry({
        gameId: game.id,
        answers,
      }),
    onSuccess: (result) => {
      if (result.success) {
        setCurrentStep("submitted");
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    },
    onError: () => {
      toast.error("Failed to submit entry");
    },
  });

  useEffect(() => {
    if (userStatus?.data) {
      setCurrentStep("submitted");
      setAnswers(userStatus.data.answers || {});
    }
  }, [userStatus]);

  useEffect(() => {
    if (game.config?.timeLimit && currentStep === "playing") {
      const timer = game.config.timeLimit * 60; // Convert minutes to seconds
      setTimeLeft(timer);

      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            if (Object.keys(answers).length > 0) {
              submitMutation.mutate(answers);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentStep, game.config?.timeLimit, answers, submitMutation]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getGameTypeIcon = (type: string) => {
    switch (type) {
      case "quiz":
        return "🧠";
      case "writing_challenge":
        return "✍️";
      case "puzzle":
        return "🧩";
      default:
        return "🎮";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isExpired = game.expiresAt && new Date() > game.expiresAt;

  if (isExpired) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Game Expired
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This game has expired and is no longer accepting submissions.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (currentStep === "submitted") {
    const submission = userStatus?.data;
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Submission Complete
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Badge className={getDifficultyColor(game.difficulty)}>
              {game.difficulty}
            </Badge>
            {submission?.isWinner && (
              <Badge variant="default" className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                Winner!
              </Badge>
            )}
          </div>

          {game.type === "quiz" && submission?.score !== undefined && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-semibold">Your Score: {submission.score}</p>
            </div>
          )}

          <p className="text-muted-foreground">
            Thank you for participating! Your submission has been received.
            {submission?.isWinner
              ? " Congratulations on winning!"
              : " Winners will be announced soon."}
          </p>

          {submission?.feedback && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Feedback:</h4>
              <p className="text-sm">{submission.feedback}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Game Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getGameTypeIcon(game.type)}</span>
              <div>
                <CardTitle>{game.title}</CardTitle>
                <CardDescription className="capitalize">
                  {game.type.replace("_", " ")} • {game.difficulty}
                </CardDescription>
              </div>
            </div>
            <Badge className={getDifficultyColor(game.difficulty)}>
              {game.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {game.instructions && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Instructions:</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {game.instructions}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {game.config?.timeLimit && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{game.config.timeLimit} minutes</span>
              </div>
            )}
            {game.config?.wordLimit && (
              <div className="flex items-center gap-1">
                <span>📝</span>
                <span>{game.config.wordLimit} words max</span>
              </div>
            )}
            {game.config?.maxAttempts && (
              <div className="flex items-center gap-1">
                <span>🔄</span>
                <span>{game.config.maxAttempts} attempts</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Timer */}
      {timeLeft !== null && currentStep === "playing" && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="font-semibold">Time Remaining:</span>
                <span
                  className={`text-lg ${timeLeft < 60 ? "text-red-500" : ""}`}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
              <Progress
                value={(timeLeft / ((game.config.timeLimit || 0) * 60)) * 100}
                className="w-32"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Game Content */}
      {currentStep === "instructions" ? (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Ready to start? Click the button below to begin the game.
              </p>
              <Button
                onClick={() => setCurrentStep("playing")}
                className="w-full"
                size="lg"
              >
                Start{" "}
                {game.type === "quiz"
                  ? "Quiz"
                  : game.type === "writing_challenge"
                  ? "Writing Challenge"
                  : "Puzzle"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div>
          {game.type === "quiz" && game.questions && (
            <QuizPlayer
              questions={game.questions}
              answers={answers as Record<string, string | string[]>}
              onAnswersChange={(newAnswers) => setAnswers(newAnswers)}
              onSubmit={() => submitMutation.mutate(answers)}
              isSubmitting={submitMutation.isPending}
            />
          )}

          {game.type === "writing_challenge" && (
            <WritingChallengeEditor
              config={game.config}
              answers={answers}
              onAnswersChange={(newAnswers) => setAnswers({ ...newAnswers })}
              onSubmit={() => submitMutation.mutate(answers)}
              isSubmitting={submitMutation.isPending}
            />
          )}

          {game.type === "puzzle" && (
            <PuzzlePlayer
              config={game.config}
              answers={answers}
              onAnswersChange={(newAnswers) => setAnswers({ ...newAnswers })}
              onSubmit={() => submitMutation.mutate(answers)}
              isSubmitting={submitMutation.isPending}
            />
          )}
        </div>
      )}
    </div>
  );
}
