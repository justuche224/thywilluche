"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGame } from "@/actions/admin/games";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2, Save, Eye } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  questionText: string;
  questionType: "multiple_choice" | "true_false" | "short_answer";
  options: string[];
  correctAnswer: string | string[];
  points: number;
  order: number;
}

interface GameFormData {
  title: string;
  description: string;
  type: "quiz" | "writing_challenge" | "puzzle";
  difficulty: "easy" | "medium" | "hard";
  instructions: string;
  status: "draft" | "published";
  expiresAt: string;
  config: {
    questions?: Question[];
    prompt?: string;
    wordLimit?: number;
    timeLimit?: number;
    puzzleData?: Record<string, unknown>;
  };
  rewards: {
    rewardType: "points" | "badge" | "discount_code" | "book_credit";
    rewardValue: Record<string, unknown>;
    forWinner: boolean;
    forParticipation: boolean;
  }[];
}

export default function GameForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<GameFormData>({
    title: "",
    description: "",
    type: "quiz",
    difficulty: "easy",
    instructions: "",
    status: "published",
    expiresAt: "",
    config: {
      questions: [],
    },
    rewards: [
      {
        rewardType: "points" as const,
        rewardValue: { points: 10 },
        forWinner: true,
        forParticipation: true,
      },
    ],
  });

  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    questionText: "",
    questionType: "multiple_choice",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 1,
  });

  const createMutation = useMutation({
    mutationFn: createGame,
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Game created successfully!");
        queryClient.invalidateQueries({ queryKey: ["admin-games"] });
        router.push("/admin/community/games");
      } else {
        toast.error(res.message);
      }
    },
    onError: (error) => {
      toast.error("Failed to create game: " + error.message);
    },
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConfigChange = (field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        [field]: value,
      },
    }));
  };

  const handleRewardChange = (field: string, value: boolean | number) => {
    setFormData((prev) => ({
      ...prev,
      rewards: prev.rewards.map((reward, index) =>
        index === 0 ? { ...reward, [field]: value } : reward
      ),
    }));
  };

  const addQuestion = () => {
    if (!currentQuestion.questionText?.trim()) {
      toast.error("Please enter a question");
      return;
    }

    const newQuestion: Question = {
      id: crypto.randomUUID(),
      questionText: currentQuestion.questionText,
      questionType: currentQuestion.questionType as
        | "multiple_choice"
        | "true_false"
        | "short_answer",
      options: currentQuestion.options || [],
      correctAnswer: currentQuestion.correctAnswer || "",
      points: currentQuestion.points || 1,
      order: (formData.config.questions?.length || 0) + 1,
    };

    setFormData((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        questions: [...(prev.config.questions || []), newQuestion],
      },
    }));

    setCurrentQuestion({
      questionText: "",
      questionType: "multiple_choice",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 1,
    });
  };

  const removeQuestion = (questionId: string) => {
    setFormData((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        questions:
          prev.config.questions?.filter((q) => q.id !== questionId) || [],
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (
      formData.type === "quiz" &&
      (!formData.config.questions || formData.config.questions.length === 0)
    ) {
      toast.error("Please add at least one question for the quiz");
      return;
    }

    if (
      formData.type === "writing_challenge" &&
      !formData.config.prompt?.trim()
    ) {
      toast.error("Please enter a writing prompt");
      return;
    }

    createMutation.mutate(formData);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Enter the basic details for your game.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter game title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Game Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="writing_challenge">
                    Writing Challenge
                  </SelectItem>
                  <SelectItem value="puzzle">Puzzle</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your game"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) =>
                  handleInputChange("difficulty", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) =>
                handleInputChange("instructions", e.target.value)
              }
              placeholder="Instructions for players"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
            <Input
              id="expiresAt"
              type="datetime-local"
              value={formData.expiresAt}
              onChange={(e) => handleInputChange("expiresAt", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Game Configuration */}
      {formData.type === "quiz" && (
        <Card>
          <CardHeader>
            <CardTitle>Quiz Questions</CardTitle>
            <CardDescription>
              Add questions for your quiz. You can add multiple choice,
              true/false, or short answer questions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add Question Form */}
            <div className="border rounded-lg p-4 space-y-4">
              <h4 className="font-medium">Add New Question</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="questionText">Question *</Label>
                  <Textarea
                    id="questionText"
                    value={currentQuestion.questionText}
                    onChange={(e) =>
                      setCurrentQuestion((prev) => ({
                        ...prev,
                        questionText: e.target.value,
                      }))
                    }
                    placeholder="Enter your question"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="questionType">Question Type</Label>
                    <Select
                      value={currentQuestion.questionType}
                      onValueChange={(value) =>
                        setCurrentQuestion((prev) => ({
                          ...prev,
                          questionType: value as
                            | "multiple_choice"
                            | "true_false"
                            | "short_answer",
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple_choice">
                          Multiple Choice
                        </SelectItem>
                        <SelectItem value="true_false">True/False</SelectItem>
                        <SelectItem value="short_answer">
                          Short Answer
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="points">Points</Label>
                    <Input
                      id="points"
                      type="number"
                      min="1"
                      value={currentQuestion.points}
                      onChange={(e) =>
                        setCurrentQuestion((prev) => ({
                          ...prev,
                          points: parseInt(e.target.value) || 1,
                        }))
                      }
                    />
                  </div>
                </div>

                {currentQuestion.questionType === "multiple_choice" && (
                  <div className="space-y-2">
                    <Label>Answer Options</Label>
                    {currentQuestion.options?.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [
                              ...(currentQuestion.options || []),
                            ];
                            newOptions[index] = e.target.value;
                            setCurrentQuestion((prev) => ({
                              ...prev,
                              options: newOptions,
                            }));
                          }}
                          placeholder={`Option ${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const newOptions =
                              currentQuestion.options?.filter(
                                (_, i) => i !== index
                              ) || [];
                            setCurrentQuestion((prev) => ({
                              ...prev,
                              options: newOptions,
                            }));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentQuestion((prev) => ({
                          ...prev,
                          options: [...(prev.options || []), ""],
                        }));
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Option
                    </Button>
                  </div>
                )}

                {currentQuestion.questionType === "true_false" && (
                  <div className="space-y-2">
                    <Label>Correct Answer</Label>
                    <Select
                      value={currentQuestion.correctAnswer as string}
                      onValueChange={(value) =>
                        setCurrentQuestion((prev) => ({
                          ...prev,
                          correctAnswer: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {(currentQuestion.questionType === "multiple_choice" ||
                  currentQuestion.questionType === "short_answer") && (
                  <div className="space-y-2">
                    <Label>Correct Answer</Label>
                    <Input
                      value={currentQuestion.correctAnswer as string}
                      onChange={(e) =>
                        setCurrentQuestion((prev) => ({
                          ...prev,
                          correctAnswer: e.target.value,
                        }))
                      }
                      placeholder="Enter the correct answer"
                    />
                  </div>
                )}

                <Button type="button" onClick={addQuestion} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>
            </div>

            {/* Questions List */}
            {formData.config.questions &&
              formData.config.questions.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">
                    Questions ({formData.config.questions.length})
                  </h4>
                  {formData.config.questions.map((question, index) => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">Q{index + 1}</Badge>
                            <Badge
                              className={getDifficultyColor(
                                question.questionType
                              )}
                            >
                              {question.questionType.replace("_", " ")}
                            </Badge>
                            <Badge variant="secondary">
                              {question.points} pts
                            </Badge>
                          </div>
                          <p className="font-medium mb-2">
                            {question.questionText}
                          </p>
                          {question.questionType === "multiple_choice" &&
                            question.options && (
                              <div className="space-y-1">
                                {question.options.map((option, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className="text-sm text-muted-foreground"
                                  >
                                    {String.fromCharCode(65 + optIndex)}.{" "}
                                    {option}
                                  </div>
                                ))}
                              </div>
                            )}
                          <p className="text-sm text-muted-foreground mt-2">
                            Correct Answer:{" "}
                            {Array.isArray(question.correctAnswer)
                              ? question.correctAnswer.join(", ")
                              : question.correctAnswer}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {formData.type === "writing_challenge" && (
        <Card>
          <CardHeader>
            <CardTitle>Writing Challenge Configuration</CardTitle>
            <CardDescription>
              Configure the writing challenge parameters.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Writing Prompt *</Label>
              <Textarea
                id="prompt"
                value={formData.config.prompt || ""}
                onChange={(e) => handleConfigChange("prompt", e.target.value)}
                placeholder="Enter the writing prompt for participants"
                rows={4}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wordLimit">Word Limit (Optional)</Label>
                <Input
                  id="wordLimit"
                  type="number"
                  min="1"
                  value={formData.config.wordLimit || ""}
                  onChange={(e) =>
                    handleConfigChange(
                      "wordLimit",
                      parseInt(e.target.value) || undefined
                    )
                  }
                  placeholder="e.g., 500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeLimit">
                  Time Limit (minutes, Optional)
                </Label>
                <Input
                  id="timeLimit"
                  type="number"
                  min="1"
                  value={formData.config.timeLimit || ""}
                  onChange={(e) =>
                    handleConfigChange(
                      "timeLimit",
                      parseInt(e.target.value) || undefined
                    )
                  }
                  placeholder="e.g., 30"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rewards Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Rewards Configuration</CardTitle>
          <CardDescription>
            Configure what rewards participants can earn.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Participation Rewards</Label>
              <p className="text-sm text-muted-foreground">
                Award points for participating in the game
              </p>
            </div>
            <Switch
              checked={formData.rewards[0]?.forParticipation || false}
              onCheckedChange={(checked) =>
                handleRewardChange("forParticipation", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Winner Rewards</Label>
              <p className="text-sm text-muted-foreground">
                Award additional points for winning
              </p>
            </div>
            <Switch
              checked={formData.rewards[0]?.forWinner || false}
              onCheckedChange={(checked) =>
                handleRewardChange("forWinner", checked)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="points">Points to Award</Label>
            <Input
              id="points"
              type="number"
              min="1"
              value={String(formData.rewards[0]?.rewardValue?.points || 10)}
              onChange={(e) => {
                const points = parseInt(e.target.value) || 10;
                setFormData((prev) => ({
                  ...prev,
                  rewards: prev.rewards.map((reward, index) =>
                    index === 0
                      ? { ...reward, rewardValue: { points } }
                      : reward
                  ),
                }));
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Preview
          </CardTitle>
          <CardDescription>How your game will appear to users.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{getGameTypeIcon(formData.type)}</span>
              <div>
                <h3 className="font-semibold text-lg">
                  {formData.title || "Game Title"}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(formData.difficulty)}>
                    {formData.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    {formData.type.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground mb-3">
              {formData.description || "Game description will appear here"}
            </p>
            {formData.type === "quiz" && formData.config.questions && (
              <p className="text-sm text-muted-foreground">
                {formData.config.questions.length} question
                {formData.config.questions.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Create Game
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
