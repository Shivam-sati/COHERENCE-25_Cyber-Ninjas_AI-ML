import React, { useState, useEffect } from "react";
import { useAiApi } from "@/lib/ai-api";
import { CandidateCard } from "@/components/CandidateCard";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, FileText, Briefcase, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnalyticsCard } from "@/components/AnalyticsCard";
import { JobCard } from "@/components/JobCard";
import {
  BarChart4,
  FileSearch,
  Upload,
} from "lucide-react";

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
}

export function Dashboard() {
  const { toast } = useToast();
  const { getCandidates, getTopCandidates, getAnalysisHistory } = useAiApi();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalCandidates: 0,
    totalResumes: 0,
    activeJobs: 0,
    averageScore: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load top candidates
      const topResult = await getTopCandidates(5);
      if (topResult) {
        setCandidates(topResult.candidates);
      }

      // Load all candidates for analytics
      const allResult = await getCandidates(1, 100);
      if (allResult) {
        const totalCandidates = allResult.candidates.length;
        const totalResumes = allResult.total_resumes;
        const averageScore = allResult.candidates.reduce((acc, c) => acc + c.score, 0) / totalCandidates;

        setAnalytics({
          totalCandidates,
          totalResumes,
          activeJobs: 5, // Mock data for now
          averageScore: Math.round(averageScore),
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your recruitment analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <h3 className="text-2xl font-bold">{analytics.averageScore}%</h3>
                </div>
              </div>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="top">Top Candidates</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="text-muted-foreground">
                Welcome to your recruitment dashboard. Here you can view key metrics and top performing candidates.
              </div>
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
}
