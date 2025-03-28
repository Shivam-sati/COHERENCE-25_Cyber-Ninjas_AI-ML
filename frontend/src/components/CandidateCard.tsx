import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";

interface CandidateCardProps {
  candidate: {
    id: string;
    name: string;
    photo?: string;
    email: string;
    role: string;
    matchScore: number;
    skills: string[];
    topSkill: string;
  };
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  // Function to determine the color based on match score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  // Function to determine the progress bar color
  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="card-glass border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {candidate.photo ? (
              <img 
                src={candidate.photo} 
                alt={candidate.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="font-semibold line-clamp-1">{candidate.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.role}</p>
            </div>
          </div>
          <div className={`text-lg font-bold ${getScoreColor(candidate.matchScore)}`}>
            {candidate.matchScore}%
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Match Score</span>
            <span className={getScoreColor(candidate.matchScore)}>{candidate.matchScore}%</span>
          </div>
          <Progress 
            value={candidate.matchScore} 
            className="h-2 bg-gray-100 dark:bg-gray-700"
            indicatorClassName={getProgressColor(candidate.matchScore)}
          />
        </div>
        
        <div className="mt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Top Skills</p>
          <div className="flex flex-wrap gap-1">
            {candidate.skills.slice(0, 3).map((skill, index) => (
              <span 
                key={index}
                className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
            {candidate.skills.length > 3 && (
              <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                +{candidate.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1 mb-1">
            <Mail className="h-3 w-3" />
            <span>{candidate.email}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Top Match:</span>
            <span>{candidate.topSkill}</span>
          </div>
        </div>
        
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" className="w-full rounded-full" asChild>
            <Link to={`/candidates/${candidate.id}`}>
              View Profile
            </Link>
          </Button>
          <Button size="sm" className="w-full rounded-full bg-gradient-primary hover:opacity-90">
            <Calendar className="h-4 w-4 mr-1" />
            Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
