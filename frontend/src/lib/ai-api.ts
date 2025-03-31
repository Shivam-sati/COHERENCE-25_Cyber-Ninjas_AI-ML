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
  file_errors?: FileError[];
  cleanup_warnings?: string[];
  error?: string;
}

export interface FileError {
  filename: string;
  error: string;
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
  email: string | null;
  phone: string | null;
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

      const data = await response.json();
      
      // Handle non-ok responses that include JSON
      if (!response.ok) {
        throw new Error(
          data.error || `Error uploading resumes: ${response.statusText}`
        );
      }
      
      return data;
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
        candidates: Array.isArray(data.candidates) ? data.candidates.map((c: any) => ({
          extracted: c.extracted || "",
          filename: c.filename || "",
          preprocessed: c.preprocessed || "",
          email: c.email || null,
          phone: c.phone || null,
          category: c.category || "Unknown",
          score: typeof c.score === 'number' ? c.score : 0,
        })) : [],
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Error getting top candidates: ${response.statusText}`
        );
      }
      
      const data = await response.json();
      
      if (!data || !data.candidates || !Array.isArray(data.candidates)) {
        throw new Error("Invalid response data format");
      }
      
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
          email: c.email || null,
          phone: c.phone || null,
          category: c.category || "Unknown",
          score: typeof c.score === 'number' ? c.score : 0,
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Error getting analysis history: ${response.statusText}`
        );
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        return [];
      }
      
      return data;
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Error downloading resume: ${response.statusText}`
        );
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
          description: "Processing your resumes...",
        });
        
        const result = await aiApi.uploadResumes(files, jobDescription);
        
        // Check for partial success (some files had errors)
        if (result.file_errors && result.file_errors.length > 0) {
          toast({
            title: "Partial Success",
            description: `Processed ${result.processed_resumes} resumes. ${result.file_errors.length} files had errors.`,
            variant: "destructive", // Changed from 'warning' to 'destructive'
          });
        } else {
          toast({
            title: "Resumes Uploaded",
            description: `Successfully processed ${result.processed_resumes} resumes.`,
          });
        }
        
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
        
        if (result.candidates && result.candidates.length > 0) {
          toast({
            title: "Candidates Loaded",
            description: `Found ${result.candidates.length} candidates.`,
          });
        } else {
          toast({
            title: "No Candidates Found",
            description: "Try adjusting your search criteria.",
            variant: "default", // Changed from 'warning' to 'default'
          });
        }
        
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
        
        if (result.candidates && result.candidates.length > 0) {
          toast({
            title: "Top Candidates Loaded",
            description: `Found ${result.candidates.length} top candidates.`,
          });
        } else {
          toast({
            title: "No Top Candidates",
            description: "Try uploading and analyzing resumes first.",
            variant: "default", // Changed from 'warning' to 'default'
          });
        }
        
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
        
        if (result && result.length > 0) {
          toast({
            title: "History Loaded",
            description: `Found ${result.length} historical analyses.`,
          });
        } else {
          toast({
            title: "No Analysis History",
            description: "Try analyzing resumes to create history.",
            variant: "default", // Changed from 'warning' to 'default'
          });
        }
        
        return result;
      } catch (error) {
        return handleApiError(error, "Failed to get analysis history");
      }
    },

    async downloadResume(filename: string): Promise<Blob | null> {
      try {
        toast({
          title: "Downloading Resume",
          description: "Downloading the resume...",
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
