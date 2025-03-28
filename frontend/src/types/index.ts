export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  experience: {
    company: string;
    position: string;
    duration: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    year: string;
  }[];
  skills: string[];
  sentiment: string;
  confidence: number;
  keyPhrases: string[];
  overallScore: number;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  culturalFit: number;
}

export interface Experience {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
}

export interface AnalyticsData {
  totalResumes: number;
  processedResumes: number;
  averageProcessingTime: number;
  skillsDistribution: Record<string, number>;
  recentUploads: ResumeData[];
}

export interface UploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

export interface ThemeConfig {
  mode: 'light' | 'dark';
  accentColor: string;
  glassOpacity: number;
} 