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
import { Award, Medal, Star, Trophy, Users } from "lucide-react";
import { Candidate } from "@/lib/ai-api";

interface LeaderboardTableProps {
  candidates: Candidate[];
}

export function LeaderboardTable({ candidates }: LeaderboardTableProps) {
  // Sort candidates by score in descending order
  const rankedCandidates = [...candidates].sort((a, b) => b.score - a.score);

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

  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-yellow-500";
    if (score >= 80) return "text-blue-500";
    if (score >= 70) return "text-green-500";
    return "text-gray-400";
  };

  // Format filename to display name
  const formatName = (filename: string) => {
    try {
      // Remove file extension and replace underscores with spaces
      const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
      const formattedName = nameWithoutExt
        .replace(/_/g, " ")
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
      return formattedName;
    } catch (error) {
      console.error("Error formatting name:", error);
      return filename;
    }
  };

  // Safely get the first character of the formatted name
  const getInitial = (filename: string) => {
    try {
      return formatName(filename).charAt(0).toUpperCase();
    } catch (error) {
      console.error("Error getting initial:", error);
      return "?";
    }
  };

  // Format email for display
  const formatEmail = (email: string) => {
    try {
      return email.length > 20 ? `${email.substring(0, 20)}...` : email;
    } catch (error) {
      console.error("Error formatting email:", error);
      return "N/A";
    }
  };

  // Format phone for display
  const formatPhone = (phone: string) => {
    try {
      return phone.length > 15 ? `${phone.substring(0, 15)}...` : phone;
    } catch (error) {
      console.error("Error formatting phone:", error);
      return "N/A";
    }
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
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden lg:table-cell">Contact</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rankedCandidates.map((candidate, index) => (
            <TableRow
              key={candidate.filename}
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
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                    <span className="font-medium text-primary">
                      {getInitial(candidate.filename)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold truncate max-w-[200px]">
                      {candidate.filename}
                    </div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {formatEmail(candidate.email)}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell font-medium text-muted-foreground">
                <Badge variant="outline" className="bg-primary/5">
                  {candidate.category}
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="text-sm">
                  <div className="truncate max-w-[200px]">
                    {formatEmail(candidate.email)}
                  </div>
                  {candidate.phone && (
                    <div className="text-muted-foreground truncate max-w-[200px]">
                      {formatPhone(candidate.phone)}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="inline-flex items-center gap-1.5">
                  <Star
                    className={`h-4 w-4 ${getScoreColor(candidate.score)}`}
                  />
                  <span
                    className={`font-bold ${getScoreColor(candidate.score)}`}
                  >
                    {candidate.score}
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
