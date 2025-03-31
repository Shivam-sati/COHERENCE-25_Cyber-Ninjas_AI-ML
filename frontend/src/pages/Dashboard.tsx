import React, { useState, useEffect } from "react";
import { useAiApi } from "@/lib/ai-api";
import { CandidateCard } from "@/components/CandidateCard";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, FileText, Briefcase, TrendingUp, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { SkillCategoryPieChart } from "@/components/SkillCategoryPieChart";
import { AnalyticsCard } from "@/components/AnalyticsCard";

interface Candidate {
  extracted: string;
  filename: string;
  preprocessed: string;
  email: string;
  phone: string;
  category: string;
  score: number;
}

interface Analytics {
  totalCandidates: number;
  totalResumes: number;
  activeJobs: number;
  averageScore: number;
  topScore: number;
  categories: Record<string, number>;
}

const Dashboard = () => {
  const { toast } = useToast();
  const { getCandidates, getTopCandidates } = useAiApi();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalCandidates: 0,
    totalResumes: 0,
    activeJobs: 0,
    averageScore: 0,
    topScore: 0,
    categories: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Load top candidates
      const topResult = await getTopCandidates(6);
      if (topResult?.candidates) {
        setCandidates(topResult.candidates);
      }

      // Load all candidates for analytics
      const allResult = await getCandidates(1, 100);
      if (allResult?.candidates) {
        const totalCandidates = allResult.candidates.length;
        const totalResumes = allResult.total_resumes;
        const scores = allResult.candidates.map(c => c.score);
        const averageScore = scores.length > 0 
          ? scores.reduce((acc, score) => acc + score, 0) / scores.length 
          : 0;
        const topScore = scores.length > 0 ? Math.max(...scores) : 0;
        
        // Calculate category distribution
        const categories = allResult.candidates.reduce((acc, c) => {
          if (c.category) {
            acc[c.category] = (acc[c.category] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>);

        setAnalytics({
          totalCandidates,
          totalResumes,
          activeJobs: Object.keys(categories).length,
          averageScore: Math.round(averageScore),
          topScore: Math.round(topScore),
          categories,
        });
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setError(error instanceof Error ? error.message : "Failed to load dashboard data");
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your candidate pool and resume analysis
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <AnalyticsCard
                  title="Total Candidates"
                  value={analytics.totalCandidates}
                  icon={<Users className="h-4 w-4" />}
                  description="Total candidates analyzed"
                />
                <AnalyticsCard
                  title="Total Resumes"
                  value={analytics.totalResumes}
                  icon={<FileText className="h-4 w-4" />}
                  description="Total resumes processed"
                />
                <AnalyticsCard
                  title="Average Match Score"
                  value={`${analytics.averageScore}%`}
                  icon={<TrendingUp className="h-4 w-4" />}
                  description="Average candidate match score"
                />
                <AnalyticsCard
                  title="Top Match Score"
                  value={`${analytics.topScore}%`}
                  icon={<Star className="h-4 w-4" />}
                  description="Highest candidate match score"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-2 p-6">
                  <h3 className="text-lg font-semibold mb-4">Top Candidates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {candidates.map((candidate) => (
                      <CandidateCard
                        key={candidate.filename}
                        candidate={candidate}
                        onSelect={() => {}}
                        selected={false}
                      />
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
                  <SkillCategoryPieChart data={analytics.categories} />
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
