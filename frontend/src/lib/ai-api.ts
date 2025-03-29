import { useToast } from "@/hooks/use-toast";

// Configuration for the Flask API endpoint
const API_CONFIG = {
  baseUrl: import.meta.env.VITE_FLASK_API_URL || "http://localhost:5000",
  endpoints: {
    uploadResume: "/api/resume/upload",
    getCandidates: "/api/candidates",
    getTopCandidates: "/api/resume/candidates",
    getAnalysisHistory: "/api/resume/history",
    downloadResume: "/api/resume/download",
  },
};

export interface ResumeAnalysisResult {
  timestamp: string;
  job_description: string;
  total_resumes: number;
  processed_resumes: number;
  candidates: Candidate[];
}

export interface JobMatchResult {
  timestamp: string;
  job_description: string;
  total_resumes: number;
  processed_resumes: number;
  candidates: Candidate[];
}

export interface Candidate {
  extracted: string;
  filename: string;
  preprocessed: string;
  email: string;
  phone: string;
  category: string;
  score: number;
}

export interface PaginationData {
  totalCandidates: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
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
   * Upload resumes for analysis
   * @param files Array of resume files
   * @param jobDescription Job description for matching
   */
  async uploadResumes(
    files: File[],
    jobDescription: string
  ): Promise<ResumeAnalysisResult> {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("job_description", jobDescription);

      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.uploadResume}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Error uploading resumes: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to upload resumes:", error);
      throw error;
    }
  },

  /**
   * Get all candidates with filtering options
   */
  async getCandidates(
    page: number = 1,
    limit: number = 10,
    search: string = "",
    roleFilter: string = "all"
  ): Promise<JobMatchResult> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        role: roleFilter,
      });

      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getCandidates}?${params}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Error getting candidates: ${response.statusText}`
        );
      }

      const data = await response.json();

      // Transform the data to match our expected structure
      return {
        timestamp: data.timestamp || new Date().toISOString(),
        job_description: data.job_description || "",
        total_resumes:
          data.total_resumes || data.pagination?.totalCandidates || 0,
        processed_resumes:
          data.processed_resumes || data.candidates?.length || 0,
        candidates: data.candidates.map((c: any) => ({
          extracted: c.extracted || "",
          filename: c.filename || "",
          preprocessed: c.preprocessed || "",
          email: c.email || "",
          phone: c.phone || "",
          category: c.category || "",
          score: c.score || 0,
        })),
      };
    } catch (error) {
      console.error("Failed to get candidates:", error);
      throw error;
    }
  },

  /**
   * Get top candidates from all analyses
   */
  async getTopCandidates(limit: number = 10): Promise<JobMatchResult> {
    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getTopCandidates}/${limit}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Error getting top candidates: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        timestamp: data.timestamp || new Date().toISOString(),
        job_description: data.job_description || "",
        total_resumes: data.total_resumes || data.candidates?.length || 0,
        processed_resumes:
          data.processed_resumes || data.candidates?.length || 0,
        candidates: data.candidates.map((c: any) => ({
          extracted: c.extracted || "",
          filename: c.filename || "",
          preprocessed: c.preprocessed || "",
          email: c.email || "",
          phone: c.phone || "",
          category: c.category || "",
          score: c.score || 0,
        })),
      };
    } catch (error) {
      console.error("Failed to get top candidates:", error);
      throw error;
    }
  },

  /**
   * Get analysis history
   */
  async getAnalysisHistory(): Promise<ResumeAnalysisResult[]> {
    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getAnalysisHistory}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error getting analysis history: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to get analysis history:", error);
      throw error;
    }
  },

  /**
   * Download a candidate's resume
   */
  async downloadResume(filename: string): Promise<Blob> {
    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}${
          API_CONFIG.endpoints.downloadResume
        }/${encodeURIComponent(filename)}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Error downloading resume: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error("Failed to download resume:", error);
      throw error;
    }
  },
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
      variant: "destructive",
    });
    return null;
  };

  return {
    async uploadResumes(
      files: File[],
      jobDescription: string
    ): Promise<ResumeAnalysisResult | null> {
      try {
        toast({
          title: "Uploading Resumes",
          description: "AI is processing your resumes...",
        });
        const result = await aiApi.uploadResumes(files, jobDescription);
        toast({
          title: "Resumes Uploaded",
          description: `Successfully processed ${result.processed_resumes} resumes.`,
        });
        return result;
      } catch (error) {
        return handleApiError(error, "Failed to upload resumes");
      }
    },

    async getCandidates(
      page: number = 1,
      limit: number = 10,
      search: string = "",
      roleFilter: string = "all"
    ): Promise<JobMatchResult | null> {
      try {
        toast({
          title: "Loading Candidates",
          description: "Fetching candidate data...",
        });
        const result = await aiApi.getCandidates(
          page,
          limit,
          search,
          roleFilter
        );
        toast({
          title: "Candidates Loaded",
          description: `Found ${result.candidates.length} candidates.`,
        });
        return result;
      } catch (error) {
        return handleApiError(error, "Failed to get candidates");
      }
    },

    async getTopCandidates(limit: number = 10): Promise<JobMatchResult | null> {
      try {
        toast({
          title: "Loading Top Candidates",
          description: "Fetching top performers...",
        });
        const result = await aiApi.getTopCandidates(limit);
        toast({
          title: "Top Candidates Loaded",
          description: `Found ${result.candidates.length} top candidates.`,
        });
        return result;
      } catch (error) {
        return handleApiError(error, "Failed to get top candidates");
      }
    },

    async getAnalysisHistory(): Promise<ResumeAnalysisResult[] | null> {
      try {
        toast({
          title: "Loading History",
          description: "Fetching analysis history...",
        });
        const result = await aiApi.getAnalysisHistory();
        toast({
          title: "History Loaded",
          description: `Found ${result.length} historical analyses.`,
        });
        return result;
      } catch (error) {
        return handleApiError(error, "Failed to get analysis history");
      }
    },

    async downloadResume(filename: string): Promise<Blob | null> {
      try {
        toast({
          title: "Downloading Resume",
          description: "AI is downloading the resume...",
        });
        const result = await aiApi.downloadResume(filename);
        toast({
          title: "Resume Downloaded",
          description: `Successfully downloaded the resume.`,
        });
        return result;
      } catch (error) {
        return handleApiError(error, "Failed to download resume");
      }
    },
  };
}
