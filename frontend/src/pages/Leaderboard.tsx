
import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Filter, Search, Trophy, Users, Star } from "lucide-react";

const Leaderboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [timeFrame, setTimeFrame] = useState("weekly");

  // Mock candidate data - using the same data structure as in other components
  // Fixed the type issue: all trend values are now explicitly "up", "down", or "neutral"
  const candidates = [
    {
      id: "c1",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      role: "Senior Frontend Developer",
      matchScore: 92,
      skills: ["React", "TypeScript", "GraphQL", "CSS", "Node.js"],
      topSkill: "React (4 years)",
      trend: "up" as const,
      previousRank: 2
    },
    {
      id: "c2",
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      role: "Product Manager",
      matchScore: 87,
      skills: ["Product Strategy", "User Research", "Agile", "Roadmapping"],
      topSkill: "Product Strategy (5 years)",
      trend: "up" as const,
      previousRank: 1
    },
    {
      id: "c3",
      name: "Miguel Rodriguez",
      email: "miguel.r@example.com",
      role: "UX Designer",
      matchScore: 78,
      skills: ["Figma", "User Testing", "Wireframing", "UI Design"],
      topSkill: "Figma (3 years)",
      trend: "neutral" as const
    },
    {
      id: "c4",
      name: "Taylor Lee",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop",
      email: "taylor.lee@example.com",
      role: "Data Scientist",
      matchScore: 85,
      skills: ["Python", "Machine Learning", "SQL", "Data Visualization"],
      topSkill: "Machine Learning (4 years)",
      trend: "up" as const,
      previousRank: 3
    },
    {
      id: "c5",
      name: "Jordan Smith",
      email: "jordan.s@example.com",
      role: "Backend Developer",
      matchScore: 82,
      skills: ["Java", "Spring Boot", "Microservices", "PostgreSQL"],
      topSkill: "Java (6 years)",
      trend: "neutral" as const
    },
    {
      id: "c6",
      name: "Casey Wong",
      email: "casey.w@example.com",
      role: "Marketing Specialist",
      matchScore: 75,
      skills: ["Content Strategy", "SEO", "Social Media", "Analytics"],
      topSkill: "Content Strategy (3 years)",
      trend: "down" as const,
      previousRank: 4
    },
    {
      id: "c7",
      name: "Jamie Rivera",
      email: "jamie.r@example.com",
      role: "DevOps Engineer",
      matchScore: 89,
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
      topSkill: "Kubernetes (4 years)",
      trend: "neutral" as const
    },
    {
      id: "c8",
      name: "Blake Thompson",
      email: "blake.t@example.com",
      role: "Project Manager",
      matchScore: 81,
      skills: ["Scrum", "Jira", "Risk Management", "Stakeholder Management"],
      topSkill: "Scrum (5 years)",
      trend: "down" as const,
      previousRank: 6
    },
    {
      id: "c9",
      name: "Riley Johnson",
      email: "riley.j@example.com",
      role: "Full Stack Developer",
      matchScore: 95,
      skills: ["JavaScript", "React", "Node.js", "MongoDB", "GraphQL"],
      topSkill: "JavaScript (7 years)",
      trend: "up" as const,
      previousRank: 4
    },
    {
      id: "c10",
      name: "Morgan Chen",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop",
      email: "morgan.c@example.com",
      role: "AI Specialist",
      matchScore: 93,
      skills: ["Python", "TensorFlow", "PyTorch", "NLP", "Computer Vision"],
      topSkill: "Machine Learning (6 years)",
      trend: "neutral" as const
    }
  ];

  // Filter candidates based on search term and role filter
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = 
      roleFilter === "all" || 
      candidate.role.toLowerCase().includes(roleFilter.toLowerCase());
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <Header />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
                <Trophy className="h-7 w-7 text-primary" />
                Candidate Leaderboard
              </h1>
              <p className="text-muted-foreground">
                Top performing candidates based on match scores
              </p>
            </div>
            
            <div className="flex gap-2 mt-4 md:mt-0">
              <Select 
                defaultValue="weekly"
                value={timeFrame}
                onValueChange={setTimeFrame}
              >
                <SelectTrigger className="w-[150px] rounded-full">
                  <SelectValue placeholder="Time Frame" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-xl font-bold">
                    {Math.max(...candidates.map(c => c.matchScore))}%
                  </div>
                  <div className="text-sm text-muted-foreground">Top Match Score</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-xl font-bold">
                    {Math.round(candidates.reduce((sum, c) => sum + c.matchScore, 0) / candidates.length)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Average Score</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-xl font-bold">
                    {candidates.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Candidates</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search candidates by name, skills, or role..." 
                className="pl-10 rounded-full bg-white dark:bg-gray-800 border-0 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select 
                defaultValue="all"
                value={roleFilter}
                onValueChange={setRoleFilter}
              >
                <SelectTrigger className="w-[150px] rounded-full bg-white dark:bg-gray-800 border-0 shadow-sm">
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
              <Button variant="outline" className="rounded-full bg-white dark:bg-gray-800 border-0 shadow-sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Leaderboard */}
          <LeaderboardTable candidates={filteredCandidates} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Leaderboard;
