import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnalyticsCard } from "@/components/AnalyticsCard";
import { CandidateCard } from "@/components/CandidateCard";
import { JobCard } from "@/components/JobCard";
import {
  BarChart4,
  BriefcaseIcon,
  FileSearch,
  Upload,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  // Mock analytics data
  const analyticsData = [
    {
      title: "Total Resumes",
      value: 1254,
      description: "Processed this month",
      icon: <FileSearch className="h-4 w-4" />,
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Active Jobs",
      value: 24,
      description: "Across all departments",
      icon: <BriefcaseIcon className="h-4 w-4" />,
      trend: { value: 5, isPositive: true },
    },
    {
      title: "Matched Candidates",
      value: 386,
      description: "Ready for review",
      icon: <Users className="h-4 w-4" />,
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Avg. Match Rate",
      value: "68%",
      description: "Across all positions",
      icon: <BarChart4 className="h-4 w-4" />,
      trend: { value: 3, isPositive: false },
    },
  ];

  // Mock candidate data
  const candidates = [
    {
      id: "c1",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      role: "Senior Frontend Developer",
      matchScore: 92,
      skills: ["React", "TypeScript", "GraphQL", "CSS", "Node.js"],
      topSkill: "React (4 years)",
    },
    {
      id: "c2",
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      role: "Product Manager",
      matchScore: 87,
      skills: ["Product Strategy", "User Research", "Agile", "Roadmapping"],
      topSkill: "Product Strategy (5 years)",
    },
    {
      id: "c3",
      name: "Miguel Rodriguez",
      email: "miguel.r@example.com",
      role: "UX Designer",
      matchScore: 78,
      skills: ["Figma", "User Testing", "Wireframing", "UI Design"],
      topSkill: "Figma (3 years)",
    },
    {
      id: "c4",
      name: "Taylor Lee",
      email: "taylor.lee@example.com",
      role: "Data Scientist",
      matchScore: 85,
      skills: ["Python", "Machine Learning", "SQL", "Data Visualization"],
      topSkill: "Machine Learning (4 years)",
    },
  ];

  // Mock job data
  const jobs = [
    {
      id: "j1",
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      applicants: 78,
      matchedCandidates: 24,
      topCandidates: 5,
      requiredSkills: ["React", "TypeScript", "CSS", "GraphQL"],
      postedDate: "2 weeks ago",
    },
    {
      id: "j2",
      title: "Product Manager",
      department: "Product",
      location: "New York, NY",
      applicants: 56,
      matchedCandidates: 18,
      topCandidates: 4,
      requiredSkills: ["Product Strategy", "Agile", "Roadmapping"],
      postedDate: "1 week ago",
    },
    {
      id: "j3",
      title: "UX Designer",
      department: "Design",
      location: "San Francisco, CA",
      applicants: 43,
      matchedCandidates: 15,
      topCandidates: 3,
      requiredSkills: ["Figma", "User Testing", "Wireframing"],
      postedDate: "3 days ago",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Analyze, match, and manage your recruitment process
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Button
                variant="outline"
                className="rounded-full flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Import Jobs
              </Button>
              <Button className="rounded-full bg-gradient-primary hover:opacity-90">
                Create New Job
              </Button>
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {analyticsData.map((item, index) => (
              <AnalyticsCard
                key={index}
                title={item.title}
                value={item.value}
                description={item.description}
                icon={item.icon}
                trend={item.trend}
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="candidates" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="candidates">Top Candidates</TabsTrigger>
                  <TabsTrigger value="jobs">Active Jobs</TabsTrigger>
                </TabsList>
                <TabsContent value="candidates" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {candidates.map((candidate) => (
                      <CandidateCard key={candidate.id} candidate={candidate} />
                    ))}
                  </div>
                  <div className="flex justify-center mt-6">
                    <Button variant="outline" className="rounded-full">
                      View All Candidates
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="jobs" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                  <div className="flex justify-center mt-6">
                    <Button variant="outline" className="rounded-full">
                      View All Jobs
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <Card className="card-glass border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {[
                      {
                        text: "New resume uploaded for UX Designer",
                        time: "Just now",
                      },
                      {
                        text: "Taylor Lee matched 85% with Data Scientist role",
                        time: "2 hours ago",
                      },
                      {
                        text: "Interview scheduled with Alex Johnson",
                        time: "4 hours ago",
                      },
                      {
                        text: "New job posted: Marketing Manager",
                        time: "Yesterday",
                      },
                    ].map((activity, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-start pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0"
                      >
                        <p className="text-sm">{activity.text}</p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
