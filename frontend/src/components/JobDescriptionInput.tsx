import { useState } from "react";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface JobDescriptionInputProps {
  onAnalyze: (jobDescription: string) => void;
  isProcessing: boolean;
}

export function JobDescriptionInput({
  onAnalyze,
  isProcessing,
}: JobDescriptionInputProps) {
  const [jobDescription, setJobDescription] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Error",
        description: "Please enter a job description",
        variant: "destructive",
      });
      return;
    }
    onAnalyze(jobDescription);
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Job Description</h2>
      <div className="space-y-4">
        <Textarea
          placeholder="Enter the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="min-h-[200px]"
        />
        <Button
          onClick={handleSubmit}
          disabled={isProcessing || !jobDescription.trim()}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Analyze Resumes"
          )}
        </Button>
      </div>
    </Card>
  );
}
