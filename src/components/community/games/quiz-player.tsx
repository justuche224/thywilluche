"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

interface Question {
  id: string;
  question: string;
  type: string;
  options: string[];
  points: number;
  order: number;
}

interface QuizPlayerProps {
  questions: Question[];
  answers: Record<string, string | string[]>;
  onAnswersChange: (answers: Record<string, string | string[]>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function QuizPlayer({
  questions,
  answers,
  onAnswersChange,
  onSubmit,
  isSubmitting,
}: QuizPlayerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (!questions || questions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              No questions available for this quiz.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-10">
            <p className="text-muted-foreground">Unable to load question.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleAnswerChange = (
    questionId: string,
    answer: string | string[]
  ) => {
    onAnswersChange({
      ...answers,
      [questionId]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const isCurrentQuestionAnswered = () => {
    const currentAnswer = answers[currentQuestion.id];
    if (!currentAnswer) return false;

    if (currentQuestion.type === "multiple_choice") {
      return Array.isArray(currentAnswer)
        ? currentAnswer.length > 0
        : !!currentAnswer;
    }

    return !!currentAnswer;
  };

  const getAnsweredQuestionsCount = () => {
    return questions.filter((q) => {
      const answer = answers[q.id];
      if (!answer) return false;
      if (q.type === "multiple_choice") {
        return Array.isArray(answer) ? answer.length > 0 : !!answer;
      }
      return !!answer;
    }).length;
  };

  const renderQuestionInput = () => {
    const currentAnswer = answers[currentQuestion.id];

    switch (currentQuestion.type) {
      case "multiple_choice":
        return (
          <RadioGroup
            value={Array.isArray(currentAnswer) ? "" : currentAnswer || ""}
            onValueChange={(value) =>
              handleAnswerChange(currentQuestion.id, value)
            }
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "true_false":
        return (
          <RadioGroup
            value={Array.isArray(currentAnswer) ? "" : currentAnswer || ""}
            onValueChange={(value) =>
              handleAnswerChange(currentQuestion.id, value)
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="true" />
              <Label htmlFor="true" className="cursor-pointer">
                True
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="false" />
              <Label htmlFor="false" className="cursor-pointer">
                False
              </Label>
            </div>
          </RadioGroup>
        );

      case "short_answer":
        return (
          <Input
            value={currentAnswer || ""}
            onChange={(e) =>
              handleAnswerChange(currentQuestion.id, e.target.value)
            }
            placeholder="Enter your answer..."
            className="w-full"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span>{getAnsweredQuestionsCount()} answered</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              {currentQuestion.question}
            </CardTitle>
            <Badge variant="secondary">
              {currentQuestion.points} point
              {currentQuestion.points !== 1 ? "s" : ""}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {renderQuestionInput()}

            {isCurrentQuestionAnswered() && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Answered</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <div className="flex gap-2">
          {questions.map((_, index) => (
            <Button
              key={index}
              variant={index === currentQuestionIndex ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 p-0 ${
                answers[questions[index].id]
                  ? "bg-green-100 border-green-500"
                  : ""
              }`}
            >
              {index + 1}
            </Button>
          ))}
        </div>

        {currentQuestionIndex === questions.length - 1 ? (
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>

      {/* Submit Section */}
      {currentQuestionIndex === questions.length - 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Ready to Submit?</h3>
              <p className="text-muted-foreground">
                You&apos;ve answered {getAnsweredQuestionsCount()} out of{" "}
                {questions.length} questions.
              </p>
              <Separator />
              <Button
                onClick={onSubmit}
                disabled={isSubmitting}
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
