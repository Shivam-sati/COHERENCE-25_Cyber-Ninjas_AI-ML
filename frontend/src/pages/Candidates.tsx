import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CandidateCard } from "@/components/CandidateCard";
import {
  Search,
  Filter,
  Users,
  ChevronLeft,
  ChevronRight,
  Mail,
  Loader2,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useIsMobile } from "@/hooks/use-mobile";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

interface Candidate {
  id: string;
  name: string;
  email: string;
  role: string;
  matchScore: number;
  skills: string[];
  topSkill: string;
  photo?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  totalCandidates: number;
  totalPages: number;
}

const Candidates = () => {
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("matchScore");
  const [sortOrder, setSortOrder] = useState("desc");

  // State for API data
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    page: 1,
    limit: 8,
    totalCandidates: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // State for candidate selection
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  // State for email dialog
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  // Mock data for candidates
  const mockCandidates: Candidate[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Software Engineer",
      matchScore: 92,
      skills: ["React", "TypeScript", "Node.js", "MongoDB"],
      topSkill: "React",
      photo: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "UX Designer",
      matchScore: 88,
      skills: ["Figma", "UI/UX", "Sketch", "Adobe XD"],
      topSkill: "Figma",
      photo: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      id: "3",
      name: "Michael Johnson",
      email: "michael.johnson@example.com",
      role: "Data Scientist",
      matchScore: 85,
      skills: ["Python", "Machine Learning", "TensorFlow", "Data Analysis"],
      topSkill: "Machine Learning",
      photo: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
      id: "4",
      name: "Emily Brown",
      email: "emily.brown@example.com",
      role: "Product Manager",
      matchScore: 82,
      skills: ["Product Strategy", "Agile", "User Research", "Roadmapping"],
      topSkill: "Product Strategy",
      photo: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
      id: "5",
      name: "David Wilson",
      email: "david.wilson@example.com",
      role: "DevOps Engineer",
      matchScore: 79,
      skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
      topSkill: "Kubernetes",
      photo: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    {
      id: "6",
      name: "Sarah Taylor",
      email: "sarah.taylor@example.com",
      role: "Frontend Developer",
      matchScore: 76,
      skills: ["JavaScript", "React", "CSS", "HTML"],
      topSkill: "React",
      photo: "https://randomuser.me/api/portraits/women/6.jpg",
    },
    {
      id: "7",
      name: "James Anderson",
      email: "james.anderson@example.com",
      role: "Backend Developer",
      matchScore: 73,
      skills: ["Java", "Spring Boot", "MySQL", "Microservices"],
      topSkill: "Java",
      photo: "https://randomuser.me/api/portraits/men/7.jpg",
    },
    {
      id: "8",
      name: "Olivia Martinez",
      email: "olivia.martinez@example.com",
      role: "Full Stack Developer",
      matchScore: 70,
      skills: ["JavaScript", "React", "Node.js", "MongoDB"],
      topSkill: "JavaScript",
      photo: "https://randomuser.me/api/portraits/women/8.jpg",
    },
  ];

  // Mock pagination info
  const mockPaginationInfo: PaginationInfo = {
    page: 1,
    limit: 8,
    totalCandidates: 8,
    totalPages: 1,
  };

  // Fetch candidates from API
  const fetchCandidates = async (page: number, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: paginationInfo.limit.toString(),
        search: searchQuery,
        role: roleFilter,
        sortBy: sortBy,
        sortOrder: sortOrder,
      });

      try {
        const response = await fetch(`/api/candidates/?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch candidates");
        }

        const data = await response.json();

        if (append) {
          // Append new candidates to existing list
          setCandidates((prev) => [...prev, ...data.candidates]);
        } else {
          // Replace existing candidates
          setCandidates(data.candidates);
        }

        setPaginationInfo(data.pagination);
      } catch (error) {
        console.error(
          "Error fetching candidates from API, using mock data instead:",
          error
        );

        // Filter mock data based on search query and role filter
        let filteredCandidates = [...mockCandidates];

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredCandidates = filteredCandidates.filter(
            (candidate) =>
              candidate.name.toLowerCase().includes(query) ||
              candidate.email.toLowerCase().includes(query) ||
              candidate.skills.some((skill) =>
                skill.toLowerCase().includes(query)
              )
          );
        }

        if (roleFilter !== "all") {
          filteredCandidates = filteredCandidates.filter(
            (candidate) =>
              candidate.role.toLowerCase() === roleFilter.toLowerCase()
          );
        }

        // Sort candidates
        filteredCandidates.sort((a, b) => {
          if (sortBy === "matchScore") {
            return sortOrder === "desc"
              ? b.matchScore - a.matchScore
              : a.matchScore - b.matchScore;
          } else if (sortBy === "name") {
            return sortOrder === "desc"
              ? b.name.localeCompare(a.name)
              : a.name.localeCompare(b.name);
          }
          return 0;
        });

        // Use mock data
        setCandidates(filteredCandidates);
        setPaginationInfo({
          ...mockPaginationInfo,
          page: page,
          totalCandidates: filteredCandidates.length,
          totalPages: Math.ceil(
            filteredCandidates.length / mockPaginationInfo.limit
          ),
        });
      }
    } catch (error) {
      console.error("Error in fetchCandidates:", error);
      // In a real app, show error notification
      toast({
        title: "Error",
        description: "Failed to load candidates. Please try again.",
        variant: "destructive",
      });

      // Fallback to mock data
      setCandidates(mockCandidates);
      setPaginationInfo(mockPaginationInfo);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchCandidates(1);
  }, [searchQuery, roleFilter, sortBy, sortOrder]);

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchCandidates(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle "View More" button click
  const handleViewMore = () => {
    if (currentPage < paginationInfo.totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchCandidates(nextPage, true);
    }
  };

  // Handle candidate selection
  const handleCandidateSelection = (candidateId: string) => {
    setSelectedCandidates((prev) => {
      if (prev.includes(candidateId)) {
        return prev.filter((id) => id !== candidateId);
      } else {
        return [...prev, candidateId];
      }
    });
  };

  // Handle select all candidates
  const handleSelectAll = () => {
    if (
      selectedCandidates.length === candidates.length &&
      candidates.length > 0
    ) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(candidates.map((c) => c.id));
    }
  };

  // Handle email sending
  const handleSendEmail = async () => {
    if (selectedCandidates.length === 0) {
      toast({
        title: "No candidates selected",
        description: "Please select at least one candidate to send an email.",
        variant: "destructive",
      });
      return;
    }

    if (!emailSubject.trim()) {
      toast({
        title: "Subject required",
        description: "Please enter an email subject.",
        variant: "destructive",
      });
      return;
    }

    if (!emailMessage.trim()) {
      toast({
        title: "Message required",
        description: "Please enter an email message.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSendingEmail(true);

      const response = await fetch("/api/candidates/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidateIds: selectedCandidates,
          subject: emailSubject,
          message: emailMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send emails");
      }

      const data = await response.json();

      toast({
        title: "Success",
        description: `Emails sent successfully to ${data.sentTo.length} candidates.`,
        variant: "default",
      });

      // Reset email form and close dialog
      setEmailSubject("");
      setEmailMessage("");
      setEmailDialogOpen(false);
    } catch (error) {
      console.error("Error sending emails:", error);
      toast({
        title: "Error",
        description: "Failed to send emails. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const totalPages = paginationInfo.totalPages;

    // Handle cases with many pages
    if (totalPages <= 5) {
      // Show all pages if 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            isActive={currentPage === 1}
            onClick={() => handlePageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Handle ellipsis and middle pages
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show current page and neighbors
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                isActive={currentPage === i}
                onClick={() => handlePageChange(i)}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      // Add ending ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Candidates</h1>
              <p className="text-gray-500 dark:text-gray-400">
                <Users className="inline h-4 w-4 mr-1" />
                {paginationInfo.totalCandidates} candidates in your talent pool
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              {selectedCandidates.length > 0 && (
                <Dialog
                  open={emailDialogOpen}
                  onOpenChange={setEmailDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" className="rounded-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Email {selectedCandidates.length} Selected
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Send Email to Candidates</DialogTitle>
                      <DialogDescription>
                        Compose an email to send to {selectedCandidates.length}{" "}
                        selected candidates.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subject" className="text-right">
                          Subject
                        </Label>
                        <Input
                          id="subject"
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          className="col-span-3"
                          placeholder="Interview Invitation"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="message" className="text-right">
                          Message
                        </Label>
                        <Textarea
                          id="message"
                          value={emailMessage}
                          onChange={(e) => setEmailMessage(e.target.value)}
                          className="col-span-3"
                          placeholder="Dear candidate, we are pleased to invite you for an interview..."
                          rows={6}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        onClick={handleSendEmail}
                        disabled={sendingEmail}
                      >
                        {sendingEmail && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Send Email
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              <Button className="rounded-full bg-gradient-primary hover:opacity-90">
                Add Candidate
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search candidates by name, skills, or role..."
                className="pl-10 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger
                  className={`${
                    isMobile ? "w-full" : "w-[150px]"
                  } rounded-full`}
                >
                  <SelectValue placeholder="Job Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="developer">Developers</SelectItem>
                  <SelectItem value="designer">Designers</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger
                  className={`${
                    isMobile ? "w-full" : "w-[150px]"
                  } rounded-full`}
                >
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matchScore">Match Score</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="appliedDate">Recent</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="rounded-full">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Select All Checkbox */}
          {candidates.length > 0 && (
            <div className="mb-4 flex items-center">
              <Checkbox
                id="selectAll"
                checked={
                  selectedCandidates.length === candidates.length &&
                  candidates.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="selectAll" className="ml-2 text-sm font-medium">
                Select All ({candidates.length})
              </label>
            </div>
          )}

          {/* Candidates Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : candidates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="relative">
                  <div className="absolute top-2 left-2 z-10">
                    <Checkbox
                      checked={selectedCandidates.includes(candidate.id)}
                      onCheckedChange={() =>
                        handleCandidateSelection(candidate.id)
                      }
                      className="h-5 w-5 border-2"
                    />
                  </div>
                  <CandidateCard candidate={candidate} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">
                No candidates found matching your criteria.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setRoleFilter("all");
                  setSortBy("matchScore");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* View More Button */}
          {!loading &&
            candidates.length > 0 &&
            currentPage < paginationInfo.totalPages && (
              <div className="mt-8 flex justify-center">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={handleViewMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  View More Candidates
                </Button>
              </div>
            )}

          {/* Pagination */}
          {!loading && candidates.length > 0 && (
            <div className="mt-10">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        currentPage > 1 && handlePageChange(currentPage - 1)
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                      aria-disabled={currentPage === 1}
                    />
                  </PaginationItem>

                  {!isMobile && renderPaginationItems()}

                  {isMobile && (
                    <PaginationItem>
                      <span className="flex items-center gap-1">
                        <span className="text-sm font-medium">
                          Page {currentPage} of {paginationInfo.totalPages}
                        </span>
                      </span>
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        currentPage < paginationInfo.totalPages &&
                        handlePageChange(currentPage + 1)
                      }
                      className={
                        currentPage === paginationInfo.totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                      aria-disabled={currentPage === paginationInfo.totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Candidates;
