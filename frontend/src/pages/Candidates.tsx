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
import { SkillsChart } from "@/components/SkillsChart";
import { aiApi, Candidate } from "@/lib/ai-api";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Candidates() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"score" | "name" | "category">("score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [categoryStats, setCategoryStats] = useState<{ [key: string]: number }>({});

  const loadCandidates = async (resetPage = false) => {
    try {
      setLoading(true);
      setError(null);
      const currentPage = resetPage ? 1 : page;
      const result = await aiApi.getCandidates(currentPage, 10, searchQuery, roleFilter);

      // Calculate category statistics
      const stats = result.candidates.reduce((acc, c) => {
        acc[c.category] = (acc[c.category] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });
      setCategoryStats(stats);

      // Sort candidates
      const sortedCandidates = [...result.candidates].sort((a, b) => {
        if (sortBy === "score") {
          return sortOrder === "desc" ? b.score - a.score : a.score - b.score;
        }
        if (sortBy === "name") {
          return sortOrder === "desc" 
            ? b.filename.localeCompare(a.filename) 
            : a.filename.localeCompare(b.filename);
        }
        return sortOrder === "desc"
          ? b.category.localeCompare(a.category)
          : a.category.localeCompare(b.category);
      });

      setCandidates((prev) => resetPage ? sortedCandidates : [...prev, ...sortedCandidates]);
      setTotalCandidates(result.total_resumes);
      setHasMore(result.candidates.length === 10);

      if (!resetPage) {
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to load candidates:", error);
      setError(error instanceof Error ? error.message : "Failed to load candidates");
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
  }, [searchQuery, roleFilter, sortBy, sortOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadCandidates(true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadCandidates();
    }
  };

  const handleCandidateSelect = (candidate: Candidate) => {
    navigate(`/candidates/${candidate.filename}`);
  };

  const handleSortChange = (field: "score" | "name" | "category") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">Candidates</h1>
              <p className="text-muted-foreground">
                {totalCandidates} candidates in database
              </p>
            </div>
            <Button onClick={() => navigate("/upload")} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Candidates
            </Button>
          </div>

          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search candidates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </form>
              <div className="flex gap-2">
                {Object.entries(categoryStats).map(([category, count]) => (
                  <Badge
                    key={category}
                    variant={roleFilter === category ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setRoleFilter(roleFilter === category ? "all" : category)}
                  >
                    {category} ({count})
                  </Badge>
                ))}
                <Badge
                  variant={roleFilter === "all" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setRoleFilter("all")}
                >
                  All
                </Badge>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSortChange("score")}
                  className="flex items-center gap-2"
                >
                  Score {sortBy === "score" && (sortOrder === "desc" ? "↓" : "↑")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSortChange("name")}
                  className="flex items-center gap-2"
                >
                  Name {sortBy === "name" && (sortOrder === "desc" ? "↓" : "↑")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSortChange("category")}
                  className="flex items-center gap-2"
                >
                  Category {sortBy === "category" && (sortOrder === "desc" ? "↓" : "↑")}
                </Button>
              </div>
            </div>

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
              <div className="flex justify-center mt-6">
                <Button variant="outline" onClick={handleLoadMore} disabled={loading}>
                  Load More
                </Button>
              </div>
            )}

            {!loading && candidates.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No candidates found. Try adjusting your search or filters.
              </div>
            )}
          </Card>

          {candidates.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Skills Distribution</h3>
              <SkillsChart 
                data={candidates.reduce((acc, candidate) => {
                  if (candidate.category) {
                    acc[candidate.category] = (acc[candidate.category] || 0) + 1;
                  }
                  return acc;
                }, {} as Record<string, number>)} 
              />
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
