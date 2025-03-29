import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus, Loader2 } from "lucide-react";
import { CandidateCard } from "@/components/CandidateCard";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { aiApi, Candidate } from "@/lib/ai-api";
import { useToast } from "@/hooks/use-toast";

export default function Candidates() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );

  const loadCandidates = async (resetPage = false) => {
    try {
      setLoading(true);
      setError(null);
      const currentPage = resetPage ? 1 : page;
      const result = await aiApi.getCandidates(
        currentPage,
        10,
        searchQuery,
        roleFilter
      );

      setCandidates((prev) =>
        resetPage ? result.candidates : [...prev, ...result.candidates]
      );
      setTotalCandidates(result.total_resumes);
      setHasMore(result.candidates.length === 10);

      if (!resetPage) {
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to load candidates:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load candidates"
      );
      toast({
        title: "Error",
        description: "Failed to load candidates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates(true);
  }, [searchQuery, roleFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadCandidates(true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadCandidates();
    }
  };

  const handleRoleFilterChange = (role: string) => {
    setRoleFilter(role);
    setPage(1);
  };

  const handleCandidateSelect = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    navigate(`/candidates/${encodeURIComponent(candidate.filename)}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Candidates</h1>
          <Button onClick={() => navigate("/upload")}>
            <Plus className="mr-2 h-4 w-4" />
            Upload Resume
          </Button>
        </div>

        <Card className="p-4">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={roleFilter}
                onChange={(e) => handleRoleFilterChange(e.target.value)}
                className="border rounded-md px-3 py-2"
              >
                <option value="all">All Roles</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Product Manager">Product Manager</option>
                <option value="UX Designer">UX Designer</option>
              </select>
            </div>
          </form>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>

          <TabsContent value="grid">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.filename}
                  candidate={candidate}
                  onSelect={handleCandidateSelect}
                  selected={selectedCandidate?.filename === candidate.filename}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="table">
            <LeaderboardTable candidates={candidates} />
          </TabsContent>
        </Tabs>

        {loading && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {error && <div className="text-center py-4 text-red-500">{error}</div>}

        {!loading && hasMore && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={loading}
            >
              Load More
            </Button>
          </div>
        )}

        {!loading && candidates.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No candidates found. Try adjusting your search or filters.
          </div>
        )}
      </div>
    </div>
  );
}
