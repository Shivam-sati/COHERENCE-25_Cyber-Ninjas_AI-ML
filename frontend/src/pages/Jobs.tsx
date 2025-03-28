
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobCard } from "@/components/JobCard";
import { Search, Filter, BriefcaseIcon, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { JobPostingModal } from "@/components/JobPostingModal";

// Define job data type
export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  applicants: number;
  matchedCandidates: number;
  topCandidates: number;
  requiredSkills: string[];
  postedDate: string;
  description?: string;
}

const Jobs = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  
  // Mock job data
  const [jobs, setJobs] = useState<Job[]>([
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
      description: "We are looking for a Senior Frontend Developer to join our team and help build amazing user experiences."
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
      description: "As a Product Manager, you will be responsible for the product roadmap and working with cross-functional teams."
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
      description: "We're seeking a UX Designer who can create intuitive and beautiful user experiences for our products."
    },
    {
      id: "j4",
      title: "Data Scientist",
      department: "Data",
      location: "Chicago, IL",
      applicants: 32,
      matchedCandidates: 14,
      topCandidates: 3,
      requiredSkills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
      postedDate: "5 days ago",
      description: "Join our data science team to build and deploy machine learning models that drive our business forward."
    },
    {
      id: "j5",
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote",
      applicants: 28,
      matchedCandidates: 10,
      topCandidates: 2,
      requiredSkills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      postedDate: "1 week ago",
      description: "We're looking for a DevOps Engineer to help us build and maintain our cloud infrastructure."
    },
    {
      id: "j6",
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Austin, TX",
      applicants: 45,
      matchedCandidates: 19,
      topCandidates: 4,
      requiredSkills: ["Content Strategy", "SEO", "Social Media"],
      postedDate: "2 weeks ago",
      description: "As a Marketing Specialist, you will be responsible for creating and executing marketing campaigns."
    }
  ]);

  // Filter jobs based on search term and department
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchTerm === "" || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.requiredSkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDepartment = departmentFilter === "all" || job.department.toLowerCase() === departmentFilter.toLowerCase();
    
    return matchesSearch && matchesDepartment;
  });

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "recent") {
      return a.postedDate < b.postedDate ? 1 : -1;
    } else if (sortBy === "applicants") {
      return b.applicants - a.applicants;
    } else if (sortBy === "matches") {
      return b.matchedCandidates - a.matchedCandidates;
    }
    return 0;
  });

  const handleAddJob = (newJob: Omit<Job, "id" | "applicants" | "matchedCandidates" | "topCandidates" | "postedDate">) => {
    const job: Job = {
      ...newJob,
      id: `j${jobs.length + 1}`,
      applicants: 0,
      matchedCandidates: 0,
      topCandidates: 0,
      postedDate: "Just now"
    };
    
    setJobs([job, ...jobs]);
    toast({
      title: "Job Posted",
      description: `${job.title} has been successfully posted.`
    });
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Jobs</h1>
              <p className="text-gray-500 dark:text-gray-400">
                <BriefcaseIcon className="inline h-4 w-4 mr-1" />
                {sortedJobs.length} active jobs
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button 
                className="rounded-full bg-gradient-primary hover:opacity-90"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search jobs by title, department, or skills..." 
                className="pl-10 rounded-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select 
                value={departmentFilter} 
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger className="w-[150px] rounded-full">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="data">Data</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                value={sortBy} 
                onValueChange={setSortBy}
              >
                <SelectTrigger className="w-[150px] rounded-full">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Posted</SelectItem>
                  <SelectItem value="applicants">Most Applicants</SelectItem>
                  <SelectItem value="matches">Most Matches</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="rounded-full">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Jobs Grid */}
          {sortedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BriefcaseIcon className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {searchTerm || departmentFilter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Post your first job to get started"}
              </p>
              <Button 
                className="rounded-full bg-gradient-primary hover:opacity-90"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
            </div>
          )}

          {/* Pagination (only show if there are jobs) */}
          {sortedJobs.length > 0 && (
            <div className="mt-10 flex justify-center">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-full w-9 p-0">
                  &lt;
                </Button>
                <Button variant="outline" size="sm" className="rounded-full w-9 p-0 bg-primary text-primary-foreground">
                  1
                </Button>
                <Button variant="outline" size="sm" className="rounded-full w-9 p-0">
                  2
                </Button>
                <Button variant="outline" size="sm" className="rounded-full w-9 p-0">
                  &gt;
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      
      {/* Job Posting Modal */}
      <JobPostingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddJob}
      />
    </div>
  );
};

export default Jobs;
