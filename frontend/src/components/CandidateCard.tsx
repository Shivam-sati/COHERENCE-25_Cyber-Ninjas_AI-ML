import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Mail, Phone } from "lucide-react";
import { Candidate } from "@/lib/ai-api";

interface CandidateCardProps {
  candidate: Candidate;
  onSelect?: (candidate: Candidate) => void;
  selected?: boolean;
}

export function CandidateCard({
  candidate,
  onSelect,
  selected,
}: CandidateCardProps) {
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

  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-yellow-500";
    if (score >= 80) return "text-blue-500";
    if (score >= 70) return "text-green-500";
    return "text-gray-400";
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

  const formattedName = formatName(candidate.filename);

  return (
    <Card
      className={`p-4 cursor-pointer transition-all hover:shadow-md ${
        selected ? "border-primary" : ""
      }`}
      onClick={() => onSelect?.(candidate)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
            <span className="font-medium text-primary">
              {getInitial(candidate.filename)}
            </span>
          </div>
          <div>
            <div className="font-semibold truncate max-w-[200px]">
              {formattedName}
            </div>
            <div className="text-sm text-muted-foreground">
              {formatEmail(candidate.email)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Star className={`h-4 w-4 ${getScoreColor(candidate.score)}`} />
          <span className={`font-bold ${getScoreColor(candidate.score)}`}>
            {candidate.score}
          </span>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Badge variant="outline" className="bg-primary/5">
          {candidate.category}
        </Badge>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Mail className="h-3 w-3" />
          <span>{formatEmail(candidate.email)}</span>
        </div>
        {candidate.phone && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span>{formatPhone(candidate.phone)}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
