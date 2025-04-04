"use client";

import { useState, useEffect } from "react";
import { Eye, Download, Loader2 } from "lucide-react";
import useSWR from "swr";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Type definition for the API response
type Resume = {
  id: string;
  applicantName: string;
  roleApplied: string;
  submissionTime: string;
  status: "new" | "reviewed" | "shortlisted" | "rejected";
  view_url: string;
  resume_url: string;
  s3Key: string;
};

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    throw error;
  }

  return res.json();
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getStatusBadge = (status: Resume["status"]) => {
  switch (status) {
    case "new":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-600 hover:bg-blue-50"
        >
          New
        </Badge>
      );
    case "reviewed":
      return (
        <Badge
          variant="outline"
          className="bg-amber-50 text-amber-600 hover:bg-amber-50"
        >
          Reviewed
        </Badge>
      );
    case "shortlisted":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-600 hover:bg-green-50"
        >
          Shortlisted
        </Badge>
      );
    case "rejected":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-600 hover:bg-red-50"
        >
          Rejected
        </Badge>
      );
    default:
      return null;
  }
};

export function ResumesTable() {
  // State for search and filters from ResumesFilter component
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [dateFilter, setDateFilter] = useState<Date | null>(null);

  // Fetch data using SWR
  const { data, error, isLoading } = useSWR<Resume[]>("/api/resumes", fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    revalidateOnFocus: true,
  });

  // Listen for filter changes from ResumesFilter component
  useEffect(() => {
    const handleSearchChange = (e: CustomEvent) => {
      setSearchTerm(e.detail.searchTerm);
    };

    const handleRoleChange = (e: CustomEvent) => {
      setRoleFilter(e.detail.role);
    };

    const handleDateChange = (e: CustomEvent) => {
      setDateFilter(e.detail.date);
    };

    window.addEventListener(
      "search-change",
      handleSearchChange as EventListener
    );
    window.addEventListener("role-change", handleRoleChange as EventListener);
    window.addEventListener("date-change", handleDateChange as EventListener);

    return () => {
      window.removeEventListener(
        "search-change",
        handleSearchChange as EventListener
      );
      window.removeEventListener(
        "role-change",
        handleRoleChange as EventListener
      );
      window.removeEventListener(
        "date-change",
        handleDateChange as EventListener
      );
    };
  }, []);

  // Handle view resume in new tab
  const handleViewResume = (resume: Resume) => {
    window.open(resume.view_url, "_blank");
  };

  // Handle download resume
  const handleDownloadResume = (resume: Resume) => {
    // Create a filename based on the applicant name and role
    const filename = `${resume.applicantName.replace(
      " ",
      "_"
    )}_${resume.roleApplied.replace(" ", "_")}.pdf`;

    // Create a temporary anchor element to trigger the download
    const link = document.createElement("a");
    link.href = resume.resume_url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter resumes based on search term, role, and date
  const filteredResumes = data?.filter((resume) => {
    const matchesSearch =
      searchTerm === "" ||
      resume.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.roleApplied.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "" || resume.roleApplied === roleFilter;

    const matchesDate =
      !dateFilter ||
      new Date(resume.submissionTime).toDateString() ===
        dateFilter.toDateString();

    return matchesSearch && matchesRole && matchesDate;
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load resumes. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="rounded-md border">
      {isLoading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading resumes...</span>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant Name</TableHead>
              <TableHead>Role Applied</TableHead>
              <TableHead>Submission Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResumes && filteredResumes.length > 0 ? (
              filteredResumes.map((resume) => (
                <TableRow key={resume.id}>
                  <TableCell className="font-medium">
                    {resume.applicantName}
                  </TableCell>
                  <TableCell>{resume.roleApplied}</TableCell>
                  <TableCell>{formatDate(resume.submissionTime)}</TableCell>
                  <TableCell>{getStatusBadge(resume.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewResume(resume)}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadResume(resume)}
                      >
                        <Download className="mr-1 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {data && data.length === 0
                    ? "No resumes found in S3 bucket."
                    : "No matching resumes found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
