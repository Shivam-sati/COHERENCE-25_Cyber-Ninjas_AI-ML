import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Trophy, Users, TrendingUp, Award } from "lucide-react";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { AnalyticsCard } from "@/components/AnalyticsCard";
import { aiApi } from "@/lib/ai-api";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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
    roleDistribution: {} as Record<string, number>
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
        const roleCounts: Record<string, number> = roles.reduce((acc: Record<string, number>, role: string) => {
          acc[role] = (acc[role] || 0) + 1;
          return acc;
        }, {});
        
        const totalScore = scores.reduce((a, b) => a + b, 0);
        const averageScore = Math.round(totalScore / scores.length);
        
        // Sort by count to find top role
        const sortedRoles = Object.entries(roleCounts)
          .sort(([, countA], [, countB]) => countB - countA);
        const topRole = sortedRoles.length > 0 ? sortedRoles[0][0] : "N/A";
        
        setStats({
          totalCandidates: result.total_resumes,
          topMatchScore: Math.max(...scores),
          averageScore,
          topRole,
          roleDistribution: roleCounts
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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Leaderboard</h1>
            <p className="text-muted-foreground">
              Track candidate performance and rankings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnalyticsCard
              title="Total Candidates"
              value={stats.totalCandidates}
              icon={<Users className="h-4 w-4" />}
              description="All candidates in system"
            />
            <AnalyticsCard
              title="Top Match Score"
              value={`${stats.topMatchScore}%`}
              icon={<Trophy className="h-4 w-4" />}
              description="Highest match percentage"
            />
            <AnalyticsCard
              title="Average Score"
              value={`${stats.averageScore}%`}
              icon={<TrendingUp className="h-4 w-4" />}
              description="Average match score"
            />
            <AnalyticsCard
              title="Top Role"
              value={stats.topRole}
              icon={<Award className="h-4 w-4" />}
              description="Most common candidate role"
            />
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
                {Object.keys(stats.roleDistribution).map((role) => (
                  <Badge
                    key={role}
                    variant={roleFilter === role ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleRoleFilterChange(role)}
                  >
                    {role} ({stats.roleDistribution[role]})
                  </Badge>
                ))}
                <Badge
                  variant={roleFilter === "all" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleRoleFilterChange("all")}
                >
                  All
                </Badge>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : candidates.length > 0 ? (
              <LeaderboardTable candidates={candidates} />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No candidates found
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
