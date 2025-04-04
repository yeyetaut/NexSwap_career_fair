"use client";

import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import useSWR from "swr";

// Define the type for resume data
type Resume = {
  id: string;
  applicantName: string;
  roleApplied: string;
  submissionTime: string;
  status: string;
  view_url: string;
  resume_url: string;
  s3Key: string;
};

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json() as Promise<Resume[]>;
};

export function ResumesFilter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [date, setDate] = useState<Date | undefined>();
  const [availableRoles, setAvailableRoles] = useState<string[]>(["All Roles"]);

  // Fetch resumes to extract available roles
  const { data } = useSWR<Resume[]>("/api/resumes", fetcher);

  // Extract unique roles from resume data
  useEffect(() => {
    if (data && Array.isArray(data)) {
      // Create a set of unique roles
      const uniqueRoles = new Set<string>();

      // Add each role to the set
      data.forEach((resume) => {
        if (resume.roleApplied) {
          uniqueRoles.add(resume.roleApplied);
        }
      });

      // Convert set to array and add "All Roles" at the beginning
      const rolesList = ["All Roles", ...Array.from(uniqueRoles)];
      setAvailableRoles(rolesList);
    }
  }, [data]);

  // Emit events when filters change
  useEffect(() => {
    const searchEvent = new CustomEvent("search-change", {
      detail: { searchTerm },
    });
    window.dispatchEvent(searchEvent);
  }, [searchTerm]);

  useEffect(() => {
    const roleEvent = new CustomEvent("role-change", {
      detail: { role: selectedRole === "All Roles" ? "" : selectedRole },
    });
    window.dispatchEvent(roleEvent);
  }, [selectedRole]);

  useEffect(() => {
    const dateEvent = new CustomEvent("date-change", {
      detail: { date },
    });
    window.dispatchEvent(dateEvent);
  }, [date]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedRole("All Roles");
    setDate(undefined);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search applicants..."
          className="w-full pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground"
            onClick={() => setSearchTerm("")}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {availableRoles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[240px] justify-start text-left font-normal"
            >
              {date ? format(date, "PPP") : "Select submission date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="icon"
          onClick={handleResetFilters}
          title="Reset filters"
        >
          <Filter className="h-4 w-4" />
          <span className="sr-only">Reset filters</span>
        </Button>
      </div>
    </div>
  );
}
