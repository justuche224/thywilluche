"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  getAllChampionshipRegistrations,
  approveChampionshipRegistration,
  rejectChampionshipRegistration,
  deleteChampionshipRegistration,
  getChampionshipRegistrationById,
} from "@/actions/admin/championship";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Eye,
  ExternalLink,
} from "lucide-react";

interface Registration {
  id: string;
  userId: string;
  phoneNumber: string;
  country: string;
  state: string;
  city: string;
  address: string;
  receiptUrl: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: {
    id: string;
    name: string | null;
    email: string;
    username: string | null;
  };
}

export function ChampionshipRegistrationsList() {
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [selectedRegistration, setSelectedRegistration] =
    useState<Registration | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: registrationsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["championship-registrations", statusFilter],
    queryFn: () => getAllChampionshipRegistrations(),
  });

  const approveMutation = useMutation({
    mutationFn: approveChampionshipRegistration,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: ["championship-registrations"],
        });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to approve registration");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectChampionshipRegistration,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: ["championship-registrations"],
        });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to reject registration");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteChampionshipRegistration,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: ["championship-registrations"],
        });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to delete registration");
    },
  });

  const handleViewDetails = async (registrationId: string) => {
    const result = await getChampionshipRegistrationById(registrationId);
    if (result.success && result.registration) {
      setSelectedRegistration(result.registration as Registration);
      setIsDetailDialogOpen(true);
    } else {
      toast.error("Failed to load registration details");
    }
  };

  const handleApprove = (id: string) => {
    approveMutation.mutate(id);
  };

  const handleReject = (id: string) => {
    rejectMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredRegistrations =
    registrationsData?.success && registrationsData.registrations
      ? statusFilter === "all"
        ? registrationsData.registrations
        : registrationsData.registrations.filter(
            (reg: Registration) => reg.status === statusFilter
          )
      : [];

  if (error) {
    return (
      <div className="border rounded-lg p-6 text-center text-red-600">
        Failed to load registrations. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as typeof statusFilter)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-24" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredRegistrations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No registrations found
                </TableCell>
              </TableRow>
            ) : (
              filteredRegistrations.map((registration: Registration) => (
                <TableRow key={registration.id}>
                  <TableCell className="font-medium">
                    {registration.user?.name ||
                      registration.user?.username ||
                      "N/A"}
                  </TableCell>
                  <TableCell>{registration.user?.email || "N/A"}</TableCell>
                  <TableCell>{registration.phoneNumber}</TableCell>
                  <TableCell>
                    {registration.city}, {registration.state}
                  </TableCell>
                  <TableCell>{getStatusBadge(registration.status)}</TableCell>
                  <TableCell>
                    {new Date(registration.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(registration.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {registration.status === "pending" && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApprove(registration.id)}
                            disabled={approveMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject(registration.id)}
                            disabled={rejectMutation.isPending}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Registration
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this registration?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(registration.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registration Details</DialogTitle>
            <DialogDescription>
              Complete information about this championship registration
            </DialogDescription>
          </DialogHeader>
          {selectedRegistration && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div className="mt-1">
                    {getStatusBadge(selectedRegistration.status)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Registration Date
                  </p>
                  <p className="mt-1">
                    {new Date(
                      selectedRegistration.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="mt-1">
                    {selectedRegistration.user?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="mt-1">
                    {selectedRegistration.user?.email || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Phone Number
                  </p>
                  <p className="mt-1">{selectedRegistration.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Country</p>
                  <p className="mt-1">{selectedRegistration.country}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">State</p>
                  <p className="mt-1">{selectedRegistration.state}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">City</p>
                  <p className="mt-1">{selectedRegistration.city}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="mt-1">{selectedRegistration.address}</p>
                </div>
                {selectedRegistration.receiptUrl && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">
                      Payment Receipt
                    </p>
                    <a
                      href={selectedRegistration.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center text-blue-600 hover:underline"
                    >
                      View Receipt <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
