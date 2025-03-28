
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CandidateCard } from "@/components/CandidateCard";
import { Search, Filter, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { useIsMobile } from "@/hooks/use-mobile";

const Candidates = () => {
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("match");

  // Mock candidate data
  const allCandidates = [
    {
      id: "c1",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      role: "Senior Frontend Developer",
      matchScore: 92,
      skills: ["React", "TypeScript", "GraphQL", "CSS", "Node.js"],
      topSkill: "React (4 years)"
    },
    {
      id: "c2",
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      role: "Product Manager",
      matchScore: 87,
      skills: ["Product Strategy", "User Research", "Agile", "Roadmapping"],
      topSkill: "Product Strategy (5 years)"
    },
    {
      id: "c3",
      name: "Miguel Rodriguez",
      email: "miguel.r@example.com",
      role: "UX Designer",
      matchScore: 78,
      skills: ["Figma", "User Testing", "Wireframing", "UI Design"],
      topSkill: "Figma (3 years)"
    },
    {
      id: "c4",
      name: "Taylor Lee",
      email: "taylor.lee@example.com",
      role: "Data Scientist",
      matchScore: 85,
      skills: ["Python", "Machine Learning", "SQL", "Data Visualization"],
      topSkill: "Machine Learning (4 years)"
    },
    {
      id: "c5",
      name: "Jordan Smith",
      email: "jordan.s@example.com",
      role: "Backend Developer",
      matchScore: 82,
      skills: ["Java", "Spring Boot", "Microservices", "PostgreSQL"],
      topSkill: "Java (6 years)"
    },
    {
      id: "c6",
      name: "Casey Wong",
      email: "casey.w@example.com",
      role: "Marketing Specialist",
      matchScore: 75,
      skills: ["Content Strategy", "SEO", "Social Media", "Analytics"],
      topSkill: "Content Strategy (3 years)"
    },
    {
      id: "c7",
      name: "Jamie Rivera",
      email: "jamie.r@example.com",
      role: "DevOps Engineer",
      matchScore: 89,
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
      topSkill: "Kubernetes (4 years)"
    },
    {
      id: "c8",
      name: "Blake Thompson",
      email: "blake.t@example.com",
      role: "Project Manager",
      matchScore: 81,
      skills: ["Scrum", "Jira", "Risk Management", "Stakeholder Management"],
      topSkill: "Scrum (5 years)"
    },
    {
      id: "c9",
      name: "Avery Johnson",
      email: "avery.j@example.com", 
      role: "Full Stack Developer",
      matchScore: 90,
      skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express"],
      topSkill: "JavaScript (5 years)"
    },
    {
      id: "c10",
      name: "Morgan Chen",
      email: "morgan.c@example.com",
      role: "Mobile Developer",
      matchScore: 88,
      skills: ["React Native", "Swift", "Kotlin", "Firebase", "Redux"],
      topSkill: "React Native (3 years)"
    },
    {
      id: "c11",
      name: "Riley Patel",
      email: "riley.p@example.com",
      role: "Cloud Engineer",
      matchScore: 86,
      skills: ["AWS", "Azure", "Terraform", "Docker", "Kubernetes"],
      topSkill: "AWS (6 years)"
    },
    {
      id: "c12",
      name: "Skyler Davis",
      email: "skyler.d@example.com",
      role: "Data Engineer",
      matchScore: 84,
      skills: ["Python", "SQL", "Spark", "Hadoop", "ETL"],
      topSkill: "Python (4 years)"
    }
  ];
  
  // Calculate pagination
  const itemsPerPage = 8;
  const totalPages = Math.ceil(allCandidates.length / itemsPerPage);
  
  // Filter candidates based on search query and role filter
  const filteredCandidates = allCandidates.filter(candidate => {
    const matchesSearch = searchQuery === "" || 
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRole = roleFilter === "all" || 
      (roleFilter === "developer" && candidate.role.toLowerCase().includes("developer")) ||
      (roleFilter === "designer" && candidate.role.toLowerCase().includes("designer")) ||
      (roleFilter === "product" && candidate.role.toLowerCase().includes("product")) ||
      (roleFilter === "marketing" && candidate.role.toLowerCase().includes("marketing"));
    
    return matchesSearch && matchesRole;
  });
  
  // Sort candidates
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (sortBy === "match") {
      return b.matchScore - a.matchScore;
    } else if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "recent") {
      // For demo purposes, we'll just use the id as a proxy for recency
      return b.id.localeCompare(a.id);
    }
    return 0;
  });
  
  // Get current page candidates
  const indexOfLastCandidate = currentPage * itemsPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - itemsPerPage;
  const currentCandidates = sortedCandidates.slice(indexOfFirstCandidate, indexOfLastCandidate);
  
  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    
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
                {filteredCandidates.length} candidates in your talent pool
              </p>
            </div>
            <div className="mt-4 md:mt-0">
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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select 
                value={roleFilter}
                onValueChange={(value) => {
                  setRoleFilter(value);
                  setCurrentPage(1); // Reset to first page on filter change
                }}
              >
                <SelectTrigger className={`${isMobile ? 'w-full' : 'w-[150px]'} rounded-full`}>
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
              <Select 
                value={sortBy}
                onValueChange={(value) => {
                  setSortBy(value);
                  setCurrentPage(1); // Reset to first page on sort change
                }}
              >
                <SelectTrigger className={`${isMobile ? 'w-full' : 'w-[150px]'} rounded-full`}>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Match Score</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="recent">Recent</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="rounded-full">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Candidates Grid */}
          {currentCandidates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentCandidates.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No candidates found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setRoleFilter("all");
                  setSortBy("match");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {filteredCandidates.length > 0 && (
            <div className="mt-10">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      aria-disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  
                  {!isMobile && renderPaginationItems()}
                  
                  {isMobile && (
                    <PaginationItem>
                      <span className="flex items-center gap-1">
                        <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
                      </span>
                    </PaginationItem>
                  )}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      aria-disabled={currentPage === totalPages}
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
