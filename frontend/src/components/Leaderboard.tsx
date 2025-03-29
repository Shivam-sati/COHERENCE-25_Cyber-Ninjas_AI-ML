import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { useToast } from "./ui/use-toast";

interface Candidate {
  filename: string;
  email: string;
  phone: string;
  category: string;
  score: number;
  extracted: string;
}

interface LeaderboardProps {
  candidates: Candidate[];
  onViewResume: (candidate: Candidate) => void;
  onContinueAnalysis: () => void;
}

export function Leaderboard({
  candidates,
  onViewResume,
  onContinueAnalysis,
}: LeaderboardProps) {
  const [limit, setLimit] = useState(15);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const { toast } = useToast();

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 100) {
      setLimit(value);
    } else {
      toast({
        title: "Invalid Limit",
        description: "Please enter a number between 1 and 100",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Candidate Leaderboard</h2>
        <div className="flex items-center space-x-4">
          <Input
            type="number"
            value={limit}
            onChange={handleLimitChange}
            className="w-24"
            min={1}
            max={100}
          />
          <Button onClick={onContinueAnalysis}>Continue Analysis</Button>
        </div>
      </div>

      <Card className="p-6">
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {candidates.slice(0, limit).map((candidate, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold">
                        {candidate.filename}
                      </span>
                      <Badge variant="secondary">
                        Score: {candidate.score}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>Email: {candidate.email || "N/A"}</p>
                      <p>Phone: {candidate.phone || "N/A"}</p>
                      <p>Category: {candidate.category}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCandidate(candidate)}
                  >
                    View Resume
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>

      <Dialog
        open={!!selectedCandidate}
        onOpenChange={() => setSelectedCandidate(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Resume Content</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[500px]">
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {selectedCandidate?.extracted}
            </pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
