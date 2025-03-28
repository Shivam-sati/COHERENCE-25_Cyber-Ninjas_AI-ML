
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Job } from "@/pages/Jobs";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const matchRate = Math.round((job.matchedCandidates / (job.applicants || 1)) * 100) || 0;
  
  return (
    <>
      <Card className="card-glass border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{job.title}</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{job.department}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{job.location}</span>
            <span className="mx-2">•</span>
            <Calendar className="h-4 w-4 mr-1" />
            <span>Posted {job.postedDate}</span>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
              <span className="text-sm">{job.applicants} Applicants</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-resume-blue">{job.matchedCandidates}</span> matched
            </div>
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Match Rate</span>
              <span>{matchRate}%</span>
            </div>
            <Progress 
              value={matchRate} 
              className="h-2 bg-gray-100 dark:bg-gray-700"
            />
          </div>
          
          <div className="mt-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Required Skills</p>
            <div className="flex flex-wrap gap-1">
              {job.requiredSkills.map((skill, index) => (
                <span 
                  key={index}
                  className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="sm" className="w-1/2 rounded-full">
              Edit
            </Button>
            <Button 
              size="sm" 
              className="w-1/2 rounded-full bg-gradient-primary hover:opacity-90"
              onClick={() => setIsViewModalOpen(true)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Job Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{job.title}</DialogTitle>
            <DialogDescription>
              <div className="flex items-center mt-2 text-sm">
                <span className="font-medium mr-2">{job.department}</span>
                <span className="mx-2">•</span>
                <MapPin className="h-4 w-4 mr-1" />
                <span>{job.location}</span>
                <span className="mx-2">•</span>
                <Calendar className="h-4 w-4 mr-1" />
                <span>Posted {job.postedDate}</span>
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-6">
            {job.description && (
              <div>
                <h3 className="text-lg font-medium mb-2">Job Description</h3>
                <p className="text-gray-600 dark:text-gray-300">{job.description}</p>
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-medium mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Applicants</p>
                <p className="text-2xl font-bold">{job.applicants}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Matched</p>
                <p className="text-2xl font-bold text-resume-blue">{job.matchedCandidates}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Top Candidates</p>
                <p className="text-2xl font-bold text-green-500">{job.topCandidates}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Match Rate</h3>
              <div className="mb-1 flex justify-between text-sm">
                <span>Overall match quality</span>
                <span className="font-medium">{matchRate}%</span>
              </div>
              <Progress 
                value={matchRate} 
                className="h-4 bg-gray-100 dark:bg-gray-700"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => setIsViewModalOpen(false)}
            >
              Close
            </Button>
            <Button
              className="rounded-full bg-gradient-primary hover:opacity-90"
            >
              View Matched Candidates
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
