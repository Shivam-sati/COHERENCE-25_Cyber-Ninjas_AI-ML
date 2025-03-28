'use client';

import { useState } from 'react';
import { ResumeUpload } from '@/components/upload/ResumeUpload';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ResumeVisualization } from '@/components/visualization/ResumeVisualization';
import { GlassCard } from '@/components/ui/glass-card';
import { DashboardSkeleton } from '@/components/ui/skeleton';
import { AnalyticsData, ResumeData } from '@/types';

// Mock data for demonstration
const mockAnalytics: AnalyticsData = {
  totalResumes: 150,
  processedResumes: 142,
  averageProcessingTime: 2.5,
  skillsDistribution: {
    'JavaScript': 85,
    'React': 78,
    'TypeScript': 65,
    'Node.js': 60,
  },
  recentUploads: [],
};

const mockResume: ResumeData = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1 234 567 8900',
  skills: ['JavaScript', 'React', 'TypeScript', 'Node.js'],
  experience: [
    {
      company: 'Tech Corp',
      position: 'Senior Developer',
      startDate: new Date('2020-01-01'),
      endDate: new Date('2023-12-31'),
      description: 'Led development team in creating enterprise applications',
    },
  ],
  education: [
    {
      institution: 'University of Technology',
      degree: 'BS',
      field: 'Computer Science',
      startDate: new Date('2015-09-01'),
      endDate: new Date('2019-05-31'),
    },
  ],
  createdAt: new Date(),
};

export default function Home(): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (file: File): Promise<void> => {
    setIsLoading(true);
    // Simulate file upload and processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <DashboardLayout data={mockAnalytics}>
        <div className="grid gap-8 md:grid-cols-2">
          <GlassCard>
            <h2 className="mb-4 text-2xl font-bold">Upload Resume</h2>
            <ResumeUpload onUpload={handleUpload} />
          </GlassCard>

          <GlassCard>
            <h2 className="mb-4 text-2xl font-bold">Resume Visualization</h2>
            <div className="aspect-square">
              <ResumeVisualization data={mockResume} />
            </div>
          </GlassCard>
        </div>

        {isLoading && (
          <div className="mt-8">
            <DashboardSkeleton />
          </div>
        )}
      </DashboardLayout>
    </main>
  );
}
