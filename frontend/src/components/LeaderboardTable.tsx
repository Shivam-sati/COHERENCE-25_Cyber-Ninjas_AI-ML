import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Award,
  ChevronUp,
  ChevronDown,
  Medal,
  Star,
  Trophy,
  Users,
} from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  photo?: string;
  email: string;
  role: string;
  matchScore: number;
  skills: string[];
  topSkill: string;
  trend?: "up" | "down" | "neutral";
  previousRank?: number;
}

interface LeaderboardTableProps {
  candidates: Candidate[];
}

export function LeaderboardTable({ candidates }: LeaderboardTableProps) {
  // Sort candidates by match score in descending order
  const rankedCandidates = [...candidates].sort(
    (a, b) => b.matchScore - a.matchScore
  );

  // Function to render the rank icon/badge
  const getRankIndicator = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-700" />;
      default:
        return <span className="font-bold text-gray-500">{rank}</span>;
    }
  };

  // Function to render trend indicator
  const getTrendIndicator = (
    trend?: "up" | "down" | "neutral",
    previousRank?: number
  ) => {
    if (trend === "up") {
      return (
        <div className="flex items-center text-green-500 text-xs">
          <ChevronUp className="h-3 w-3 mr-1" />
          <span>{previousRank ? `+${previousRank}` : "+1"}</span>
        </div>
      );
    } else if (trend === "down") {
      return (
        <div className="flex items-center text-red-500 text-xs">
          <ChevronDown className="h-3 w-3 mr-1" />
          <span>{previousRank ? `-${previousRank}` : "-1"}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <div className="bg-gradient-primary p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            <h2 className="text-xl font-bold">Top Performers</h2>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span className="text-sm font-medium">
              {candidates.length} Candidates
            </span>
          </div>
        </div>
      </div>
      <Table>
        <TableHeader className="bg-primary/5">
          <TableRow className="hover:bg-primary/5">
            <TableHead className="w-16 text-center">Rank</TableHead>
            <TableHead>Candidate</TableHead>
            <TableHead className="hidden md:table-cell">Role</TableHead>
            <TableHead className="hidden lg:table-cell">Top Skill</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rankedCandidates.map((candidate, index) => (
            <TableRow
              key={candidate.id}
              className={`
                ${index < 3 ? "bg-primary/5" : ""}
                hover:bg-primary/5 transition-colors
              `}
            >
              <TableCell className="relative p-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`
                    flex items-center justify-center w-10 h-10 rounded-full 
                    ${
                      index === 0
                        ? "bg-yellow-100 text-yellow-600"
                        : index === 1
                        ? "bg-gray-100 text-gray-600"
                        : index === 2
                        ? "bg-amber-100 text-amber-600"
                        : "bg-primary/10 text-primary"
                    } 
                    shadow-sm
                  `}
                  >
                    {getRankIndicator(index + 1)}
                  </div>
                  {getTrendIndicator(candidate.trend, candidate.previousRank)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  {candidate.photo ? (
                    <img
                      src={candidate.photo}
                      alt={candidate.name}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                      <span className="font-medium text-primary">
                        {candidate.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="font-semibold">{candidate.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {candidate.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell font-medium text-muted-foreground">
                {candidate.role}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <Badge variant="outline" className="bg-primary/5 font-medium">
                  {candidate.topSkill}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="inline-flex items-center gap-1.5">
                  <Star
                    className={`h-4 w-4 ${
                      candidate.matchScore >= 90
                        ? "text-yellow-500"
                        : candidate.matchScore >= 80
                        ? "text-blue-500"
                        : candidate.matchScore >= 70
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`font-bold ${
                      candidate.matchScore >= 90
                        ? "text-yellow-500"
                        : candidate.matchScore >= 80
                        ? "text-blue-500"
                        : candidate.matchScore >= 70
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}
                  >
                    {candidate.matchScore}%
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
