"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Save, Clock, FileText, Target } from "lucide-react";
import { toast } from "sonner";

interface WritingChallengeConfig {
  wordLimit?: number;
  timeLimit?: number;
  judgingCriteria?: string;
}

interface WritingChallengeAnswers {
  text?: string;
  wordCount?: number;
  characterCount?: number;
}

interface WritingChallengeEditorProps {
  config: WritingChallengeConfig;
  answers: WritingChallengeAnswers;
  onAnswersChange: (answers: WritingChallengeAnswers) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function WritingChallengeEditor({
  config,
  answers,
  onAnswersChange,
  onSubmit,
  isSubmitting,
}: WritingChallengeEditorProps) {
  const [content, setContent] = useState(answers.text || "");
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveInterval, setAutoSaveInterval] =
    useState<NodeJS.Timeout | null>(null);

  const wordLimit = config?.wordLimit || 500;
  const timeLimit = config?.timeLimit || 60;
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60);

  useEffect(() => {
    const words = content
      .trim()
      .split(/\s+/)
      .filter((word: string) => word.length > 0);
    const chars = content.length;

    setWordCount(words.length);
    setCharacterCount(chars);

    onAnswersChange({
      ...answers,
      text: content,
      wordCount: words.length,
      characterCount: chars,
    });
  }, [content, answers, onAnswersChange]);

  useEffect(() => {
    if (timeLimit && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
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
  }, [timeLeft, timeLimit, onSubmit]);

  useEffect(() => {
    // Auto-save every 30 seconds
    const interval = setInterval(() => {
      setLastSaved(new Date());
      toast.success("Draft saved automatically");
    }, 30000);

    setAutoSaveInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
      }
    };
  }, [autoSaveInterval]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSave = () => {
    setLastSaved(new Date());
    toast.success("Draft saved!");
  };

  const isOverWordLimit = wordCount > wordLimit;
  const isNearWordLimit = wordCount > wordLimit * 0.9;
  const wordProgress = (wordCount / wordLimit) * 100;

  return (
    <div className="space-y-6">
      {/* Challenge Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Writing Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm">
                <strong>Target:</strong> {wordLimit} words
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm">
                <strong>Time:</strong> {formatTime(timeLeft)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Save className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                <strong>Status:</strong> {lastSaved ? "Saved" : "Not saved"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Word Count Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Word Progress</span>
              <Badge
                variant={
                  isOverWordLimit
                    ? "destructive"
                    : isNearWordLimit
                    ? "secondary"
                    : "default"
                }
              >
                {wordCount} / {wordLimit}
              </Badge>
            </div>
            <Progress
              value={Math.min(wordProgress, 100)}
              className={`w-full ${
                isOverWordLimit
                  ? "bg-red-100"
                  : isNearWordLimit
                  ? "bg-yellow-100"
                  : ""
              }`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{characterCount} characters</span>
              {isOverWordLimit && (
                <span className="text-red-500 font-medium">
                  {wordCount - wordLimit} words over limit
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Writing Area */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Your Response</CardTitle>
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save Draft
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your response here..."
            className="min-h-[400px] resize-none"
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "16px",
              lineHeight: "1.6",
            }}
          />

          {config?.judgingCriteria && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Judging Criteria:</h4>
              <p className="text-sm text-muted-foreground">
                {config.judgingCriteria}
              </p>
            </div>
          )}
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
                  Ready to submit your writing challenge?
                </p>
                <p className="text-xs text-muted-foreground">
                  Make sure you&apos;ve reviewed your response before submitting.
                </p>
              </div>

              <Button
                onClick={onSubmit}
                disabled={isSubmitting || content.trim().length === 0}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? "Submitting..." : "Submit Challenge"}
              </Button>
            </div>

            {isOverWordLimit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  ⚠️ Your response exceeds the word limit by{" "}
                  {wordCount - wordLimit} words. Consider editing before
                  submitting.
                </p>
              </div>
            )}

            {content.trim().length === 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">
                  Please write something before submitting your response.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
