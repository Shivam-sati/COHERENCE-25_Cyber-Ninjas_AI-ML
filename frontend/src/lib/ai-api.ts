
import { useToast } from "@/hooks/use-toast";

// Configuration for the Flask API endpoint
const API_CONFIG = {
  // This will be replaced with your actual Flask API endpoint
  baseUrl: import.meta.env.VITE_FLASK_API_URL || 'http://localhost:5000',
  endpoints: {
    analyzeResume: '/api/analyze-resume',
    matchCandidates: '/api/match-candidates',
    generateQuestions: '/api/generate-questions',
    detectBias: '/api/detect-bias',
    extractSkills: '/api/extract-skills',
  }
};

export interface ResumeAnalysisResult {
  skills: string[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  matchScore: number;
  topSkill: string;
}

export interface JobMatchResult {
  matchedCandidates: {
    id: string;
    name: string;
    matchScore: number;
    skills: string[];
  }[];
  biasDetection: {
    hasBias: boolean;
    biasType: string;
    confidence: number;
  };
}

export interface GeneratedQuestionsResult {
  technical: string[];
  behavioral: string[];
  experience: string[];
}

/**
 * AI API service for interacting with the Flask backend
 */
export const aiApi = {
  /**
   * Analyze a resume file and extract structured information
   * @param file The resume file to analyze
   */
  async analyzeResume(file: File): Promise<ResumeAnalysisResult> {
    const formData = new FormData();
    formData.append('resume', file);
    
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.analyzeResume}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Error analyzing resume: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to analyze resume:', error);
      throw error;
    }
  },
  
  /**
   * Match job requirements with candidate profiles
   * @param jobId The ID of the job to match candidates for
   */
  async matchCandidates(jobId: string): Promise<JobMatchResult> {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.matchCandidates}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId }),
      });
      
      if (!response.ok) {
        throw new Error(`Error matching candidates: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to match candidates:', error);
      throw error;
    }
  },
  
  /**
   * Generate interview questions based on resume gaps and job requirements
   * @param candidateId The ID of the candidate
   * @param jobId The ID of the job
   */
  async generateInterviewQuestions(candidateId: string, jobId: string): Promise<GeneratedQuestionsResult> {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.generateQuestions}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ candidateId, jobId }),
      });
      
      if (!response.ok) {
        throw new Error(`Error generating questions: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to generate interview questions:', error);
      throw error;
    }
  },
  
  /**
   * Extract skills from resume text
   * @param text The resume text to analyze
   */
  async extractSkills(text: string): Promise<string[]> {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.extractSkills}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        throw new Error(`Error extracting skills: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.skills;
    } catch (error) {
      console.error('Failed to extract skills:', error);
      throw error;
    }
  }
};

/**
 * React hook for using the AI API with built-in toast notifications
 */
export function useAiApi() {
  const { toast } = useToast();
  
  const handleApiError = (error: unknown, fallbackMessage: string) => {
    console.error(fallbackMessage, error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : fallbackMessage,
      variant: "destructive"
    });
    return null;
  };
  
  return {
    async analyzeResume(file: File): Promise<ResumeAnalysisResult | null> {
      try {
        toast({
          title: "Analyzing Resume",
          description: "AI is processing your resume...",
        });
        const result = await aiApi.analyzeResume(file);
        toast({
          title: "Analysis Complete",
          description: `Successfully extracted ${result.skills.length} skills.`,
        });
        return result;
      } catch (error) {
        return handleApiError(error, "Failed to analyze resume");
      }
    },
    
    async matchCandidates(jobId: string): Promise<JobMatchResult | null> {
      try {
        toast({
          title: "Matching Candidates",
          description: "AI is finding the best candidates...",
        });
        const result = await aiApi.matchCandidates(jobId);
        toast({
          title: "Matching Complete",
          description: `Found ${result.matchedCandidates.length} matching candidates.`,
        });
        return result;
      } catch (error) {
        return handleApiError(error, "Failed to match candidates");
      }
    },
    
    async generateInterviewQuestions(candidateId: string, jobId: string): Promise<GeneratedQuestionsResult | null> {
      try {
        toast({
          title: "Generating Questions",
          description: "AI is creating personalized interview questions...",
        });
        const result = await aiApi.generateInterviewQuestions(candidateId, jobId);
        toast({
          title: "Questions Ready",
          description: `Generated ${result.technical.length + result.behavioral.length + result.experience.length} questions.`,
        });
        return result;
      } catch (error) {
        return handleApiError(error, "Failed to generate interview questions");
      }
    },
    
    async extractSkills(text: string): Promise<string[] | null> {
      try {
        const skills = await aiApi.extractSkills(text);
        return skills;
      } catch (error) {
        return handleApiError(error, "Failed to extract skills from text");
      }
    }
  };
}
