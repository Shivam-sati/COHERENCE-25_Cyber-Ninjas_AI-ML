import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Trophy, Users, TrendingUp, Award } from "lucide-react";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { aiApi } from "@/lib/ai-api";
import { useToast } from "@/hooks/use-toast";

export default function Leaderboard() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalCandidates: 0,
    topMatchScore: 0,
    averageScore: 0,
    topRole: "",
  });

  const loadCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await aiApi.getCandidates(1, 100, searchQuery, roleFilter);
      setCandidates(result.candidates);
      
      // Calculate statistics
      if (result.candidates.length > 0) {
        const scores: number[] = result.candidates.map((c: any) => c.score);
        const roles = result.candidates.map((c: any) => c.category);
        const roleCounts = roles.reduce((acc: any, role: string) => {
          acc[role] = (acc[role] || 0) + 1;
          return acc;
        }, {});
        
        const totalScore = scores.reduce((a, b) => a + b, 0);
        const averageScore = Math.round(totalScore / scores.length);
        
        setStats({
          totalCandidates: result.total_resumes,
          topMatchScore: Math.max(...scores),
          averageScore,
          topRole: Object.entries(roleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A",
        });
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
    loadCandidates();
  }, [searchQuery, roleFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadCandidates();
  };

  const handleRoleFilterChange = (role: string) => {
    setRoleFilter(role);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground">
            Track candidate performance and rankings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Candidates</p>
                <p className="text-2xl font-bold">{stats.totalCandidates}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Trophy className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Top Match Score</p>
                <p className="text-2xl font-bold">{stats.topMatchScore}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">{stats.averageScore}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-full">
                <Award className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Top Role</p>
                <p className="text-2xl font-bold">{stats.topRole}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
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

        {loading && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="text-center py-4 text-red-500">
            {error}
          </div>
        )}

        {!loading && candidates.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No candidates found. Try adjusting your search or filters.
          </div>
        )}

        {!loading && candidates.length > 0 && (
          <LeaderboardTable candidates={candidates} />
        )}
      </div>
    </div>
  );
}
