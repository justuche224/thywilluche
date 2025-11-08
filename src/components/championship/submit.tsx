"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Oswald } from "next/font/google";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { submitReview } from "@/actions/championship";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FieldGroup } from "@/components/ui/field";
import { toast } from "sonner";
import { Upload, FileText, X, CheckCircle2, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const formSchema = z
  .object({
    reviewText: z.string().optional(),
    reviewDocument: z.instanceof(File).optional(),
  })
  .refine((data) => data.reviewText?.trim() || data.reviewDocument, {
    message: "Either review text or document is required",
    path: ["reviewText"],
  });

interface SubmissionData {
  id: string;
  userId: string;
  reviewText: string | null;
  reviewDocumentUrl: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface SubmitProps {
  submission: SubmissionData | null;
}

const Submit = ({ submission }: SubmitProps) => {
  const router = useRouter();
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reviewText: "",
      reviewDocument: undefined,
    },
  });

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF or DOCX file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      setDocumentPreview(file.name);
      form.setValue("reviewDocument", file);
    }
  };

  const removeDocument = () => {
    setDocumentPreview(null);
    form.setValue("reviewDocument", undefined);
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let reviewDocumentUrl: string | undefined;

      if (values.reviewDocument) {
        setUploadingDocument(true);
        const uploadFormData = new FormData();
        uploadFormData.append("document", values.reviewDocument);
        uploadFormData.append("path", "championship-reviews");

        const response = await fetch("/api/upload/document", {
          method: "POST",
          body: uploadFormData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Upload failed");
        }

        const uploadResult = await response.json();
        reviewDocumentUrl = uploadResult.documentUrl;
        setUploadingDocument(false);
      }

      const submissionData = {
        reviewText: values.reviewText?.trim() || undefined,
        reviewDocumentUrl,
      };

      const result = await submitReview(submissionData);

      if (!result.success) {
        throw new Error(result.message || "Submission failed");
      }

      toast.success(result.message || "Review submitted successfully!");
      form.reset();
      setDocumentPreview(null);
      router.refresh();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit review"
      );
      setUploadingDocument(false);
    }
  };

  if (submission) {
    return (
      <div className="min-h-screen space-y-10 my-10">
        <section className="relative py-0 lg:py-0 mt-10">
          <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1
                className={`text-4xl lg:text-6xl font-bold text-[#800000] mb-6 ${oswald.className}`}
              >
                THYWILL&apos;S CHAMPIONS LEAGUE 🏆
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 font-light mb-8">
                Your Review Submission
              </p>
            </motion.div>
          </div>
        </section>

        <section className="relative py-0 lg:py-0 mt-10">
          <div className="max-w-4xl mx-auto px-5 md:px-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Card className="bg-white/70 border border-gray-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                    <CardTitle
                      className={`text-2xl lg:text-3xl font-bold text-[#800000] ${oswald.className}`}
                    >
                      Review Submitted Successfully
                    </CardTitle>
                  </div>
                  <p className="text-gray-600 mt-2">
                    Your review has been submitted and is under review.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">
                        Submitted On
                      </p>
                      <p className="text-lg text-gray-900">
                        {new Date(submission.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>

                    {submission.reviewText && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">
                          Review Text
                        </p>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <p className="text-gray-900 whitespace-pre-wrap">
                            {submission.reviewText}
                          </p>
                        </div>
                      </div>
                    )}

                    {submission.reviewDocumentUrl && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">
                          Review Document
                        </p>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <FileText className="h-6 w-6 text-gray-600" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-700">
                              Document uploaded successfully
                            </p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={submission.reviewDocumentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              <Download className="h-4 w-4" />
                              View Document
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-10 my-10">
      <section className="relative py-0 lg:py-0 mt-10">
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1
              className={`text-4xl lg:text-6xl font-bold text-[#800000] mb-6 ${oswald.className}`}
            >
              THYWILL&apos;S CHAMPIONS LEAGUE 🏆
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 font-light mb-8">
              Submit your review for the Thywill&apos;s Book Review Champions
              League
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-0 lg:py-0 mt-10">
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2
              className={`text-3xl lg:text-4xl font-bold text-[#800000] mb-6 ${oswald.className}`}
            >
              Submit Your Review
            </h2>
            <div className="bg-white/70 border border-gray-200 rounded-xl p-6 shadow-sm">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-6"
                >
                  <div className="p-6 md:p-8">
                    <FieldGroup>
                      <FormField
                        control={form.control}
                        name="reviewText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Review Text</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Write your review here..."
                                className="min-h-[200px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Write your review in the text area above, or
                              upload a document below
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="reviewDocument"
                        render={({
                          // eslint-disable-next-line @typescript-eslint/no-unused-vars
                          field: { onChange, value: _value, ...field },
                        }) => (
                          <FormItem>
                            <FormLabel>
                              Upload Review Document (Optional)
                            </FormLabel>
                            <FormControl>
                              <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                  <Input
                                    type="file"
                                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    onChange={(e) => {
                                      handleDocumentChange(e);
                                      onChange(e.target.files?.[0]);
                                    }}
                                    disabled={uploadingDocument}
                                    {...field}
                                  />
                                </div>
                                {documentPreview && (
                                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border">
                                    <FileText className="h-5 w-5 text-gray-600" />
                                    <span className="flex-1 text-sm text-gray-700">
                                      {documentPreview}
                                    </span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={removeDocument}
                                      disabled={uploadingDocument}
                                      className="h-8 w-8 p-0"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormDescription>
                              Upload a PDF or DOCX file (max 10MB)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </FieldGroup>

                    <div className="mt-6 flex justify-end">
                      <Button
                        type="submit"
                        className="w-full sm:w-auto"
                        disabled={uploadingDocument}
                      >
                        {uploadingDocument ? (
                          <>
                            <Upload className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          "Submit Review"
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Submit;
