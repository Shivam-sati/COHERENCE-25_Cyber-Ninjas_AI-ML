import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { CTASection } from "@/components/CTASection";
import { ResumeUploadAndParse } from "@/components/ResumeUploadAndParse";
import { JobDescriptionInput } from "../components/JobDescriptionInput";
import { Leaderboard } from "../components/Leaderboard";
import { useToast } from "../components/ui/use-toast";

interface Candidate {
  filename: string;
  email: string;
  phone: string;
  category: string;
  score: number;
  extracted: string;
}

const Index = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const { toast } = useToast();

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  const handleJobDescriptionSubmit = async (jobDescription: string) => {
    if (files.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one resume",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("job_description", jobDescription);

      const response = await fetch("http://localhost:5000/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process resumes");
      }

      const data = await response.json();
      setCandidates(data.candidates);
      setShowLeaderboard(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process resumes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewResume = (candidate: Candidate) => {
    // This is handled by the Leaderboard component
  };

  const handleContinueAnalysis = () => {
    // Navigate to historical analysis page
    // You'll need to implement this navigation
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Upload Your Resume
          </h2>
          {!showLeaderboard ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Upload Resumes</h2>
                <ResumeUploadAndParse
                  onFilesSelected={handleFilesSelected}
                  isProcessing={isProcessing}
                />
              </div>
              <div>
                <JobDescriptionInput
                  onAnalyze={handleJobDescriptionSubmit}
                  isProcessing={isProcessing}
                />
              </div>
            </div>
          ) : (
            <Leaderboard
              candidates={candidates}
              onViewResume={handleViewResume}
              onContinueAnalysis={handleContinueAnalysis}
            />
          )}
        </div>
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
