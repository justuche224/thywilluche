"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Filter,
} from "lucide-react";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getReports, updateReportStatus } from "@/actions/admin/community";
import { toast } from "sonner";
import Link from "next/link";

interface Report {
  id: string;
  reason: string;
  description: string | null;
  status: string;
  createdAt: Date;
  reviewedAt: Date | null;
  resolution: string | null;
  reporter: {
    id: string;
    name: string;
    username: string;
    image: string | null;
  } | null;
  postId: string | null;
  commentId: string | null;
  post: {
    id: string;
    content: unknown;
    excerpt: string | null;
    status: string;
    authorId: string;
  } | null;
  comment: {
    id: string;
    content: string;
  } | null;
}

export function ReportsManagement() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionStatus, setActionStatus] = useState<string>("");
  const [resolution, setResolution] = useState("");
  const queryClient = useQueryClient();

  const { data: reportsData, isLoading } = useQuery({
    queryKey: ["admin-reports", selectedStatus],
    queryFn: async () => {
      const result = await getReports({
        page: 1,
        limit: 100,
        status:
          selectedStatus === "all"
            ? undefined
            : (selectedStatus as
                | "pending"
                | "reviewed"
                | "resolved"
                | "dismissed"),
      });
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      reportId,
      status,
      resolution,
    }: {
      reportId: string;
      status: "pending" | "reviewed" | "resolved" | "dismissed";
      resolution?: string;
    }) => {
      return await updateReportStatus({ reportId, status, resolution });
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
        setShowActionDialog(false);
        setShowDetailsDialog(false);
        setSelectedReport(null);
        setActionStatus("");
        setResolution("");
      } else {
        toast.error(result.message);
      }
    },
    onError: () => {
      toast.error("Failed to update report status");
    },
  });

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setShowDetailsDialog(true);
  };

  const handleTakeAction = (report: Report) => {
    setSelectedReport(report);
    setShowActionDialog(true);
  };

  const handleSubmitAction = () => {
    if (!selectedReport || !actionStatus) {
      toast.error("Please select an action");
      return;
    }

    updateMutation.mutate({
      reportId: selectedReport.id,
      status: actionStatus as "pending" | "reviewed" | "resolved" | "dismissed",
      resolution,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { color: string; icon: React.ReactNode }
    > = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <Clock className="w-3 h-3" />,
      },
      reviewed: {
        color: "bg-blue-100 text-blue-800",
        icon: <Eye className="w-3 h-3" />,
      },
      resolved: {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle className="w-3 h-3" />,
      },
      dismissed: {
        color: "bg-gray-100 text-gray-800",
        icon: <XCircle className="w-3 h-3" />,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <Badge variant="secondary" className={`${config.color} gap-1`}>
        {config.icon}
        {status}
      </Badge>
    );
  };

  const getReasonLabel = (reason: string) => {
    const reasonMap: Record<string, string> = {
      spam: "Spam or misleading",
      harassment: "Harassment or hate speech",
      inappropriate: "Inappropriate content",
      violence: "Violence or dangerous content",
      other: "Other",
    };
    return reasonMap[reason] || reason;
  };

  const reports = reportsData?.data || [];
  const totalReports = reportsData?.total || 0;
  const pendingCount = reports.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Community", href: "/admin/community" },
          { label: "Reports", current: true },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Reports</h1>
          <p className="text-muted-foreground">
            Review and manage reported posts and comments
          </p>
        </div>
      </div>

      {pendingCount > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">
                  {pendingCount} report{pendingCount !== 1 ? "s" : ""} need
                  {pendingCount === 1 ? "s" : ""} review
                </p>
                <p className="text-sm text-yellow-700">
                  These reports are waiting for your action.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Reports ({totalReports})</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-10">Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No reports found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Content Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {report.reporter?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @{report.reporter?.username || "unknown"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {report.postId ? "Post" : "Comment"}
                      </Badge>
                    </TableCell>
                    <TableCell>{getReasonLabel(report.reason)}</TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                        //@ts-expect-error doesn't work break anything
                          onClick={() => handleViewDetails(report)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {report.status === "pending" && (
                          <Button
                            size="sm"
                            //@ts-expect-error doesn't work break anything
                            onClick={() => handleTakeAction(report)}
                          >
                            Take Action
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div>
                <Label>Status</Label>
                <div className="mt-1">
                  {getStatusBadge(selectedReport.status)}
                </div>
              </div>
              <div>
                <Label>Reporter</Label>
                <p className="mt-1">
                  {selectedReport.reporter?.name || "Unknown"} (@
                  {selectedReport.reporter?.username || "unknown"})
                </p>
              </div>
              <div>
                <Label>Reason</Label>
                <p className="mt-1">{getReasonLabel(selectedReport.reason)}</p>
              </div>
              {selectedReport.description && (
                <div>
                  <Label>Description</Label>
                  <p className="mt-1 text-sm">{selectedReport.description}</p>
                </div>
              )}
              <div>
                <Label>Reported Content</Label>
                {selectedReport.post ? (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium mb-1">Post Content:</p>
                    <p className="text-sm line-clamp-3">
                      {typeof selectedReport.post.content === "string"
                        ? selectedReport.post.content
                        : selectedReport.post.excerpt || ""}
                    </p>
                    {selectedReport.postId && (
                      <Link
                        href={`/community/home/posts/${selectedReport.postId}`}
                        target="_blank"
                        className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                      >
                        View full post →
                      </Link>
                    )}
                  </div>
                ) : selectedReport.comment ? (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium mb-1">Comment:</p>
                    <p className="text-sm">{selectedReport.comment.content}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Content has been deleted
                  </p>
                )}
              </div>
              {selectedReport.resolution && (
                <div>
                  <Label>Resolution Notes</Label>
                  <p className="mt-1 text-sm">{selectedReport.resolution}</p>
                </div>
              )}
              <div>
                <Label>Reported On</Label>
                <p className="mt-1 text-sm">
                  {new Date(selectedReport.createdAt).toLocaleString()}
                </p>
              </div>
              {selectedReport.reviewedAt && (
                <div>
                  <Label>Reviewed On</Label>
                  <p className="mt-1 text-sm">
                    {new Date(selectedReport.reviewedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {selectedReport?.status === "pending" && (
              <Button onClick={() => handleTakeAction(selectedReport)}>
                Take Action
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setShowDetailsDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Take Action on Report</DialogTitle>
            <DialogDescription>
              Choose an action and provide resolution notes if needed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="action">Action *</Label>
              <Select value={actionStatus} onValueChange={setActionStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reviewed">Mark as Reviewed</SelectItem>
                  <SelectItem value="resolved">Resolve Report</SelectItem>
                  <SelectItem value="dismissed">Dismiss Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="resolution">Resolution Notes (optional)</Label>
              <Textarea
                id="resolution"
                placeholder="Add any notes about your decision..."
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowActionDialog(false)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitAction}
              disabled={updateMutation.isPending || !actionStatus}
            >
              {updateMutation.isPending ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
