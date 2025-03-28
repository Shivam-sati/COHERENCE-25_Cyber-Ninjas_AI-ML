'use client';

import { trpc } from '@/utils/trpc';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

export function ResumeList() {
  const { data: resumes, isLoading, error } = trpc.resume.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading resumes: {error.message}
      </div>
    );
  }

  if (!resumes?.length) {
    return (
      <div className="text-center text-gray-500">
        No resumes found. Upload your first resume to get started.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {resumes.map((resume) => (
        <Card key={resume.id}>
          <CardHeader>
            <CardTitle>{resume.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(resume.createdAt), { addSuffix: true })}
            </p>
            {resume.company && (
              <p className="text-sm mt-2">
                Company: {resume.company.name}
              </p>
            )}
            {resume.analyses.length > 0 && (
              <p className="text-sm mt-2">
                Analyses: {resume.analyses.length}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 