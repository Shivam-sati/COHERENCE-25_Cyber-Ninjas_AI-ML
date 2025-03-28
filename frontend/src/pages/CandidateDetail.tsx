import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Mail, Briefcase, Calendar, Award, Download, ChevronRight, Loader2 } from "lucide-react";
import { SkillsChart } from "../components/SkillsChart";
import { SkillCategoryPieChart } from "../components/SkillCategoryPieChart";
import { toast } from "@/components/ui/use-toast";

interface Candidate {
  id: string;
  name: string;
  email: string;
  role: string;
  matchScore: number;
  skills: string[];
  topSkill: string;
  photo?: string;
  appliedDate?: string;
}

interface ResumeData {
  text: string;
  skills: string[];
  sentiment: {
    score: number;
    label: string;
  };
  score?: number;
  label?: string;
  stats: {
    topSkills: string[];
    skillFrequency: Record<string, number>;
    totalSkills: number;
    skillCategories: Record<string, number>;
    skillDistribution: Record<string, number>;
    education?: string[];
    yearsOfExperience?: number;
    categoryPercentages?: Record<string, number>;
  };
  topSkills?: string[];
  skillFrequency?: Record<string, number>;
  totalSkills?: number;
  skillCategories?: Record<string, number>;
  skillDistribution?: Record<string, number>;
  education?: string[];
  yearsOfExperience?: number;
  categoryPercentages?: Record<string, number>;
}

const CandidateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("resume");
  
  // Mock candidate data
  const mockCandidates: Record<string, Candidate> = {
    "1": {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Software Engineer",
      matchScore: 92,
      skills: ["React", "TypeScript", "Node.js", "MongoDB"],
      topSkill: "React",
      photo: "https://randomuser.me/api/portraits/men/1.jpg",
      appliedDate: "2023-03-15"
    },
    "2": {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "UX Designer",
      matchScore: 88,
      skills: ["Figma", "UI/UX", "Sketch", "Adobe XD"],
      topSkill: "Figma",
      photo: "https://randomuser.me/api/portraits/women/2.jpg",
      appliedDate: "2023-03-10"
    },
    "3": {
      id: "3",
      name: "Michael Johnson",
      email: "michael.johnson@example.com",
      role: "Data Scientist",
      matchScore: 85,
      skills: ["Python", "Machine Learning", "TensorFlow", "Data Analysis"],
      topSkill: "Machine Learning",
      photo: "https://randomuser.me/api/portraits/men/3.jpg",
      appliedDate: "2023-03-05"
    },
    "4": {
      id: "4",
      name: "Emily Brown",
      email: "emily.brown@example.com",
      role: "Product Manager",
      matchScore: 82,
      skills: ["Product Strategy", "Agile", "User Research", "Roadmapping"],
      topSkill: "Product Strategy",
      photo: "https://randomuser.me/api/portraits/women/4.jpg",
      appliedDate: "2023-02-28"
    },
    "5": {
      id: "5",
      name: "David Wilson",
      email: "david.wilson@example.com",
      role: "DevOps Engineer",
      matchScore: 79,
      skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
      topSkill: "Kubernetes",
      photo: "https://randomuser.me/api/portraits/men/5.jpg",
      appliedDate: "2023-02-20"
    },
    "6": {
      id: "6",
      name: "Sarah Taylor",
      email: "sarah.taylor@example.com",
      role: "Frontend Developer",
      matchScore: 76,
      skills: ["JavaScript", "React", "CSS", "HTML"],
      topSkill: "React",
      photo: "https://randomuser.me/api/portraits/women/6.jpg",
      appliedDate: "2023-02-15"
    },
    "7": {
      id: "7",
      name: "James Anderson",
      email: "james.anderson@example.com",
      role: "Backend Developer",
      matchScore: 73,
      skills: ["Java", "Spring Boot", "MySQL", "Microservices"],
      topSkill: "Java",
      photo: "https://randomuser.me/api/portraits/men/7.jpg",
      appliedDate: "2023-02-10"
    },
    "8": {
      id: "8",
      name: "Olivia Martinez",
      email: "olivia.martinez@example.com",
      role: "Full Stack Developer",
      matchScore: 70,
      skills: ["JavaScript", "React", "Node.js", "MongoDB"],
      topSkill: "JavaScript",
      photo: "https://randomuser.me/api/portraits/women/8.jpg",
      appliedDate: "2023-02-05"
    }
  };
  
  // Mock resume data generator
  const generateMockResumeData = (candidateId: string): ResumeData => {
    const candidate = mockCandidates[candidateId];
    const skills = candidate.skills;
    
    // Generate mock resume text based on candidate info
    const resumeText = `
      ${candidate.name}
      ${candidate.email}
      
      SUMMARY
      Experienced ${candidate.role} with a passion for building innovative solutions.
      Skilled in ${skills.join(', ')}, with a focus on ${candidate.topSkill}.
      
      EXPERIENCE
      Senior ${candidate.role} | Tech Innovations Inc. | 2020 - Present
      - Led development of multiple projects using ${skills[0]} and ${skills[1]}
      - Collaborated with cross-functional teams to deliver high-quality solutions
      - Mentored junior developers and conducted code reviews
      
      ${candidate.role} | Digital Solutions Ltd. | 2018 - 2020
      - Developed and maintained applications using ${skills[2]} and ${skills[3] || skills[0]}
      - Implemented best practices and improved code quality
      - Participated in agile development processes
      
      EDUCATION
      Master of Computer Science | University of Technology | 2018
      Bachelor of Science in Software Engineering | State University | 2016
      
      SKILLS
      ${skills.join(', ')}
      
      CERTIFICATIONS
      ${candidate.topSkill} Professional Certification
      Agile Development Methodology
    `;
    
    // Generate mock skill frequency data
    const skillFrequency: Record<string, number> = {};
    skills.forEach(skill => {
      skillFrequency[skill] = Math.floor(Math.random() * 5) + 1;
    });
    
    // Generate mock skill categories
    const skillCategories: Record<string, number> = {
      "frontend": 0,
      "backend": 0,
      "database": 0,
      "devops": 0,
      "data_science": 0,
      "soft_skills": 0
    };
    
    // Categorize skills
    const frontendSkills = ["React", "JavaScript", "TypeScript", "CSS", "HTML", "Vue.js", "Angular"];
    const backendSkills = ["Node.js", "Express", "Java", "Spring Boot", "Python", "Django", "Flask", "PHP"];
    const databaseSkills = ["MongoDB", "MySQL", "PostgreSQL", "SQL", "Redis", "Firebase"];
    const devopsSkills = ["Docker", "Kubernetes", "AWS", "CI/CD", "Jenkins", "Terraform"];
    const dataSkills = ["Machine Learning", "Data Analysis", "TensorFlow", "PyTorch", "NLP", "Data Visualization"];
    const softSkills = ["Agile", "Product Strategy", "User Research", "Roadmapping", "UI/UX", "Figma", "Sketch"];
    
    skills.forEach(skill => {
      if (frontendSkills.includes(skill)) skillCategories["frontend"]++;
      if (backendSkills.includes(skill)) skillCategories["backend"]++;
      if (databaseSkills.includes(skill)) skillCategories["database"]++;
      if (devopsSkills.includes(skill)) skillCategories["devops"]++;
      if (dataSkills.includes(skill)) skillCategories["data_science"]++;
      if (softSkills.includes(skill)) skillCategories["soft_skills"]++;
    });
    
    // Generate mock skill distribution
    const skillDistribution = { ...skillCategories };
    
    // Generate mock category percentages
    const totalSkillCategories = Object.values(skillCategories).reduce((a, b) => a + b, 0);
    const categoryPercentages: Record<string, number> = {};
    
    Object.entries(skillCategories).forEach(([category, count]) => {
      categoryPercentages[category] = totalSkillCategories > 0 
        ? Math.round((count / totalSkillCategories) * 100) 
        : 0;
    });
    
    return {
      text: resumeText,
      skills: skills,
      sentiment: {
        score: candidate.matchScore / 100,
        label: candidate.matchScore > 80 ? "positive" : candidate.matchScore > 60 ? "neutral" : "negative"
      },
      score: candidate.matchScore,
      label: candidate.matchScore > 80 ? "positive" : candidate.matchScore > 60 ? "neutral" : "negative",
      stats: {
        topSkills: skills,
        skillFrequency: skillFrequency,
        totalSkills: skills.length,
        skillCategories: skillCategories,
        skillDistribution: skillDistribution,
        education: ["Master of Computer Science | University of Technology", "Bachelor of Science in Software Engineering | State University"],
        yearsOfExperience: 5,
        categoryPercentages: categoryPercentages
      },
      topSkills: skills,
      skillFrequency: skillFrequency,
      totalSkills: skills.length,
      skillCategories: skillCategories,
      skillDistribution: skillDistribution,
      education: ["Master of Computer Science | University of Technology", "Bachelor of Science in Software Engineering | State University"],
      yearsOfExperience: 5,
      categoryPercentages: categoryPercentages
    };
  };
  
  useEffect(() => {
    const fetchCandidateDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      
      try {
        // Try to fetch from API first
        const response = await fetch(`/api/candidates/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch candidate details');
        }
        
        const data = await response.json();
        setCandidate(data.candidate);
        setResumeData(data.resumeData);
      } catch (error) {
        console.error('Error fetching candidate details, using mock data instead:', error);
        
        // Use mock data if API fails
        if (mockCandidates[id]) {
          setCandidate(mockCandidates[id]);
          setResumeData(generateMockResumeData(id));
        } else {
          // If no matching mock candidate, show error
          toast({
            title: "Error",
            description: "Candidate not found.",
            variant: "destructive"
          });
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchCandidateDetails();
  }, [id]);
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  // Get sentiment color
  const getSentimentColor = (sentiment?: string) => {
    if (!sentiment) return 'text-gray-500';
    
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      case 'neutral':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };
  
  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };
  
  // Get progress color
  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-12 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg text-gray-500">Loading candidate details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!candidate) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-12 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-500 mb-4">Candidate not found.</p>
            <Button onClick={() => navigate('/candidates')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Candidates
            </Button>
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
          {/* Back button */}
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate('/candidates')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Candidates
          </Button>
          
          {/* Candidate header */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-shrink-0">
              {candidate.photo ? (
                <img 
                  src={candidate.photo} 
                  alt={candidate.name}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-1">{candidate.name}</h1>
                  <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">{candidate.role}</p>
                  
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{candidate.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <span>{candidate.topSkill}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Applied on {formatDate(candidate.appliedDate)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex flex-col items-end">
                  <div className={`text-2xl font-bold ${getScoreColor(candidate.matchScore)}`}>
                    {candidate.matchScore}%
                  </div>
                  <p className="text-sm text-gray-500 mb-2">Match Score</p>
                  <Progress 
                    value={candidate.matchScore} 
                    className="h-2 w-32 bg-gray-100 dark:bg-gray-700"
                    indicatorClassName={getProgressColor(candidate.matchScore)}
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Dual-pane layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left pane - Resume */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gray-50 dark:bg-gray-800">
                <CardTitle>Resume</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full justify-start rounded-none border-b">
                    <TabsTrigger value="resume">Resume Text</TabsTrigger>
                    <TabsTrigger value="parsed">Parsed Data</TabsTrigger>
                  </TabsList>
                  <TabsContent value="resume" className="p-4">
                    <div className="bg-white dark:bg-gray-950 rounded p-4 border max-h-[600px] overflow-y-auto whitespace-pre-wrap">
                      {resumeData?.text || "No resume text available."}
                    </div>
                    <Button variant="outline" className="mt-4">
                      <Download className="h-4 w-4 mr-2" />
                      Download Resume
                    </Button>
                  </TabsContent>
                  <TabsContent value="parsed" className="p-4">
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Education</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {resumeData?.stats?.education?.length ? (
                            resumeData.stats.education.map((edu, i) => (
                              <li key={i}>{edu}</li>
                            ))
                          ) : (
                            <li className="text-gray-500">No education details found</li>
                          )}
                        </ul>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Experience</h3>
                        <p>
                          {resumeData?.stats?.yearsOfExperience ? (
                            <span>{resumeData.stats.yearsOfExperience} years of experience</span>
                          ) : (
                            <span className="text-gray-500">Experience details not found</span>
                          )}
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Skills ({resumeData?.stats?.totalSkills || 0})</h3>
                        <div className="flex flex-wrap gap-2">
                          {resumeData?.skills?.map((skill, i) => (
                            <Badge key={i} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Sentiment Analysis</h3>
                        <p className={getSentimentColor(resumeData?.sentiment?.label)}>
                          {resumeData?.sentiment?.label || 'N/A'} 
                          {resumeData?.sentiment?.score ? ` (${resumeData.sentiment.score.toFixed(2)})` : ''}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* Right pane - Visualizations */}
            <Card>
              <CardHeader className="bg-gray-50 dark:bg-gray-800">
                <CardTitle>Skills Analysis</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <Tabs defaultValue="frequency" className="w-full">
                  <TabsList className="w-full justify-start rounded-none border-b">
                    <TabsTrigger value="frequency">Skill Frequency</TabsTrigger>
                    <TabsTrigger value="categories">Skill Categories</TabsTrigger>
                    <TabsTrigger value="distribution">Distribution</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="frequency" className="pt-4">
                    <div className="h-[400px]">
                      {resumeData?.stats?.skillFrequency ? (
                        <SkillsChart data={resumeData.stats.skillFrequency} />
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-gray-500">No skill frequency data available</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-lg font-medium mb-2">Top Skills</h3>
                      <div className="space-y-3">
                        {resumeData?.stats?.topSkills?.slice(0, 5).map((skill, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">{skill}</span>
                                <span className="text-sm text-gray-500">
                                  {resumeData?.stats?.skillFrequency?.[skill] || 0} mentions
                                </span>
                              </div>
                              <Progress 
                                value={
                                  resumeData?.stats?.skillFrequency?.[skill] 
                                    ? (resumeData.stats.skillFrequency[skill] / Math.max(...Object.values(resumeData.stats.skillFrequency))) * 100 
                                    : 0
                                } 
                                className="h-2"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="categories" className="pt-4">
                    <div className="h-[400px]">
                      {resumeData?.stats?.categoryPercentages ? (
                        <SkillCategoryPieChart data={resumeData.stats.categoryPercentages} />
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-gray-500">No skill category data available</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {resumeData?.stats?.categoryPercentages && Object.entries(resumeData.stats.categoryPercentages).map(([category, percentage]) => (
                        <Card key={category} className="overflow-hidden">
                          <CardContent className="p-4">
                            <p className="text-sm font-medium capitalize">{category}</p>
                            <p className="text-2xl font-bold">{percentage.toString()}%</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="distribution" className="pt-4">
                    <div className="space-y-4">
                      {resumeData?.stats?.skillDistribution ? (
                        Object.entries(resumeData.stats.skillDistribution).map(([category, count]) => (
                          <div key={category} className="space-y-2">
                            <h3 className="text-sm font-medium capitalize">{category.replace('_', ' ')}</h3>
                            <Progress 
                              value={
                                (count / Math.max(...Object.values(resumeData.stats.skillDistribution))) * 100
                              } 
                              className="h-3"
                            />
                            <div className="flex justify-between text-xs">
                              <span>{count} skills</span>
                              <span>{((count / Object.values(resumeData.stats.skillDistribution).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="h-[400px] flex items-center justify-center">
                          <p className="text-gray-500">No skill distribution data available</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Action buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Button className="rounded-full bg-gradient-primary hover:opacity-90">
              Schedule Interview
            </Button>
            <Button variant="outline" className="rounded-full">
              Send Email
            </Button>
            <Button variant="outline" className="rounded-full">
              Download Resume
            </Button>
            <Button variant="outline" className="rounded-full">
              Add to Shortlist
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CandidateDetail;
