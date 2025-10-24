"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Puzzle, Lightbulb, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface PuzzleConfig {
  puzzleType?: string;
  timeLimit?: number;
  hints?: string[];
  maxHints?: number;
  description?: string;
  puzzle?: string;
  riddle?: string;
  logicPuzzle?: string[];
  numberSequence?: string;
}

interface PuzzleAnswers {
  puzzleAnswer?: string;
  hintsUsed?: number;
}

interface PuzzlePlayerProps {
  config: PuzzleConfig;
  answers: PuzzleAnswers;
  onAnswersChange: (answers: PuzzleAnswers) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function PuzzlePlayer({
  config,
  answers,
  onAnswersChange,
  onSubmit,
  isSubmitting,
}: PuzzlePlayerProps) {
  const [currentAnswer, setCurrentAnswer] = useState(
    answers.puzzleAnswer || ""
  );
  const [hintsUsed, setHintsUsed] = useState(answers.hintsUsed || 0);
  const [showHints, setShowHints] = useState(false);
  const [timeLeft, setTimeLeft] = useState(
    config?.timeLimit ? config.timeLimit * 60 : null
  );

  const puzzleType = config?.puzzleType || "word_puzzle";
  const hints = config?.hints || [];
  const maxHints = config?.maxHints || 3;

  useEffect(() => {
    onAnswersChange({
      ...answers,
      puzzleAnswer: currentAnswer,
      hintsUsed: hintsUsed,
    });
  }, [currentAnswer, hintsUsed, answers, onAnswersChange]);

  useEffect(() => {
    if (timeLeft && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            toast.warning("Time's up! Auto-submitting...");
            onSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timeLeft, onSubmit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleUseHint = () => {
    if (hintsUsed < maxHints && hints[hintsUsed]) {
      setHintsUsed(hintsUsed + 1);
      setShowHints(true);
      toast.info("Hint revealed!");
    } else {
      toast.warning("No more hints available");
    }
  };

  const renderPuzzleContent = () => {
    switch (puzzleType) {
      case "word_puzzle":
        return (
          <div className="space-y-4">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Word Puzzle</h3>
              <p className="text-muted-foreground mb-4">
                {config?.description || "Solve the word puzzle below:"}
              </p>

              {config?.puzzle && (
                <div className="font-mono text-lg leading-relaxed bg-white p-4 rounded border">
                  {config.puzzle}
                </div>
              )}
            </div>
          </div>
        );

      case "riddle":
        return (
          <div className="space-y-4">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Riddle</h3>
              <p className="text-lg leading-relaxed">
                {config?.riddle || "What am I?"}
              </p>
            </div>
          </div>
        );

      case "logic_puzzle":
        return (
          <div className="space-y-4">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Logic Puzzle</h3>
              <p className="text-muted-foreground mb-4">
                {config?.description || "Solve the logic puzzle:"}
              </p>

              {config?.logicPuzzle && (
                <div className="space-y-3">
                  {config.logicPuzzle.map((clue: string, index: number) => (
                    <div key={index} className="p-3 bg-white rounded border">
                      <span className="font-medium">{index + 1}.</span> {clue}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case "number_puzzle":
        return (
          <div className="space-y-4">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Number Puzzle</h3>
              <p className="text-muted-foreground mb-4">
                {config?.description || "Find the missing number:"}
              </p>

              {config?.numberSequence && (
                <div className="font-mono text-xl bg-white p-4 rounded border text-center">
                  {config.numberSequence}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Puzzle</h3>
            <p className="text-muted-foreground">
              {config?.description || "Solve the puzzle to continue."}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Puzzle Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Puzzle className="h-5 w-5" />
            Puzzle Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm">
            {timeLeft && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-orange-500" />
                <span>Time: {formatTime(timeLeft)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span>
                Hints: {hintsUsed}/{maxHints}
              </span>
            </div>
            <Badge variant="secondary" className="capitalize">
              {puzzleType.replace("_", " ")}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Timer Progress */}
      {timeLeft && (
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
                value={(timeLeft / ((config?.timeLimit || 0) * 60)) * 100}
                className="w-32"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Puzzle Content */}
      <Card>
        <CardContent className="pt-6">{renderPuzzleContent()}</CardContent>
      </Card>

      {/* Hints */}
      {showHints && hintsUsed > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Hints ({hintsUsed}/{maxHints})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {hints.slice(0, hintsUsed).map((hint: string, index: number) => (
                <div
                  key={index}
                  className="p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                >
                  <span className="font-medium">Hint {index + 1}:</span> {hint}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Answer Input */}
      <Card>
        <CardHeader>
          <CardTitle>Your Answer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Enter your answer..."
            className="text-lg"
          />

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleUseHint}
              disabled={hintsUsed >= maxHints || !hints[hintsUsed]}
            >
              <Lightbulb className="h-4 w-4 mr-1" />
              Use Hint ({maxHints - hintsUsed} left)
            </Button>

            {currentAnswer.trim() && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Ready to submit</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Separator />

            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Ready to submit your answer?
                </p>
                <p className="text-xs text-muted-foreground">
                  Make sure you&apos;re confident in your solution before submitting.
                </p>
              </div>

              <Button
                onClick={onSubmit}
                disabled={isSubmitting || !currentAnswer.trim()}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? "Submitting..." : "Submit Answer"}
              </Button>
            </div>

            {!currentAnswer.trim() && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">
                  Please enter an answer before submitting.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
