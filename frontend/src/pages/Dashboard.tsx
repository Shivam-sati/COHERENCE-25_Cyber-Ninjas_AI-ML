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

  // Load initial data
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

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-yellow-500";
    if (score >= 80) return "text-blue-500";
    if (score >= 70) return "text-green-500";
    return "text-gray-400";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-12 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-12 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={loadDashboardData}>Try Again</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4 mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your recruitment analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Candidates</p>
                  <h3 className="text-2xl font-bold">{analytics.totalCandidates}</h3>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Resumes</p>
                  <h3 className="text-2xl font-bold">{analytics.totalResumes}</h3>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Jobs</p>
                  <h3 className="text-2xl font-bold">{analytics.activeJobs}</h3>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <h3 className="text-2xl font-bold">{analytics.averageScore}</h3>
                </div>
              </div>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="top">Top Candidates</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(analytics.categories).map(([category, count]) => (
                    <Badge key={category} variant="outline" className="bg-primary/5">
                      {category}: {count}
                    </Badge>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Highest Score</p>
                    <div className="flex items-center gap-2">
                      <Star className={`h-5 w-5 ${getScoreColor(analytics.topScore)}`} />
                      <span className={`text-2xl font-bold ${getScoreColor(analytics.topScore)}`}>
                        {analytics.topScore}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                    <div className="flex items-center gap-2">
                      <Star className={`h-5 w-5 ${getScoreColor(analytics.averageScore)}`} />
                      <span className={`text-2xl font-bold ${getScoreColor(analytics.averageScore)}`}>
                        {analytics.averageScore}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="top" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {candidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.filename}
                    candidate={candidate}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
