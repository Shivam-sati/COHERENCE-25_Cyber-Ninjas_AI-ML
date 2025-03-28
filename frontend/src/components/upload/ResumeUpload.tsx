'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trpc } from '@/utils/trpc';
import { toast } from 'sonner';

export function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createResume = trpc.resume.create.useMutation({
    onSuccess: () => {
      setFile(null);
      setUploading(false);
      setError(null);
      toast.success('Resume uploaded successfully');
    },
    onError: (error) => {
      console.error('Error uploading resume:', error);
      setUploading(false);
      setError(error.message || 'Failed to upload resume');
      toast.error('Failed to upload resume');
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      createResume.mutate({
        title: file.name,
        content: data.content,
        fileType: file.type,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploading(false);
      setError(error instanceof Error ? error.message : 'Failed to upload file');
      toast.error('Failed to upload file');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300',
          uploading && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} disabled={uploading} />
        {file ? (
          <div className="flex items-center justify-center space-x-4">
            <File className="w-8 h-8 text-primary" />
            <span className="text-sm text-gray-600">{file.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setError(null);
              }}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-12 h-12 mx-auto text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">
                {isDragActive
                  ? 'Drop the file here'
                  : 'Drag and drop a resume file, or click to select'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PDF, DOC, DOCX, TXT
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center space-x-2"
        >
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </motion.div>
      )}

      {file && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={cn(
              'w-full py-2 px-4 rounded-lg text-white font-medium transition-colors',
              uploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90'
            )}
          >
            {uploading ? 'Uploading...' : 'Upload Resume'}
          </button>
        </motion.div>
      )}
    </div>
  );
} 