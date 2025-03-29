import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Download,
  Loader2,
  Star,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { aiApi, Candidate } from "@/lib/ai-api";

const CandidateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCandidateDetails = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const result = await aiApi.getCandidates(1, 100);
        const foundCandidate = result.candidates.find((c) => c.filename === id);

        if (!foundCandidate) {
          throw new Error("Candidate not found");
        }

        setCandidate(foundCandidate);
      } catch (error) {
        console.error("Failed to load candidate details:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load candidate details"
        );
        toast({
          title: "Error",
          description: "Failed to load candidate details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadCandidateDetails();
  }, [id, toast]);

  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-yellow-500";
    if (score >= 80) return "text-blue-500";
    if (score >= 70) return "text-green-500";
    return "text-gray-400";
  };

  const handleDownloadResume = async () => {
    if (!candidate) return;

    try {
      const blob = await aiApi.downloadResume(candidate.filename);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = candidate.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download resume:", error);
      toast({
        title: "Error",
        description: "Failed to download resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-muted-foreground">
            {error || "Candidate not found"}
          </p>
          <Button onClick={() => navigate("/candidates")} className="mt-4">
            Back to Candidates
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Candidate Details</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">
                          {candidate.filename}
                        </h2>
                        <p className="text-muted-foreground">
                          {candidate.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star
                        className={`h-5 w-5 ${getScoreColor(candidate.score)}`}
                      />
                      <span
                        className={`font-bold ${getScoreColor(
                          candidate.score
                        )}`}
                      >
                        {candidate.score}
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{candidate.email}</span>
                    </div>
                    {candidate.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{candidate.phone}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resume Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-mono text-sm">
                      {candidate.extracted}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Actions</h2>
                <div className="space-y-4">
                  <Button
                    className="w-full"
                    onClick={() =>
                      (window.location.href = `mailto:${candidate.email}`)
                    }
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </Button>
                  {candidate.phone && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        (window.location.href = `tel:${candidate.phone}`)
                      }
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleDownloadResume}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Resume
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CandidateDetail;
