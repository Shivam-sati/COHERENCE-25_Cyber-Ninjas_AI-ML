import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Loader2, Upload, X } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface ResumeUploadAndParseProps {
  onFilesSelected: (files: File[]) => void;
  isProcessing: boolean;
}

export function ResumeUploadAndParse({
  onFilesSelected,
  isProcessing,
}: ResumeUploadAndParseProps) {
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validFiles = acceptedFiles.filter((file) => {
        const isValid =
          file.type === "application/pdf" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type === "application/msword";

        if (!isValid) {
          toast({
            title: "Invalid File",
            description: `${file.name} is not a valid resume file. Please upload PDF or DOCX files.`,
            variant: "destructive",
          });
        }

        return isValid;
      });

      setFiles((prev) => [...prev, ...validFiles]);
      onFilesSelected([...files, ...validFiles]);
    },
    [files, onFilesSelected, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/msword": [".doc"],
    },
    multiple: true,
  });

  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter((file) => file !== fileToRemove));
    onFilesSelected(files.filter((file) => file !== fileToRemove));
  };

  return (
    <Card className="p-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-primary"
          }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? "Drop the files here..."
            : "Drag and drop resume files here, or click to select files"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supported formats: PDF, DOCX, DOC
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="font-medium">Selected Files:</h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <span className="text-sm truncate">{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file)}
                  disabled={isProcessing}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="mt-6 flex items-center justify-center text-primary">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Processing resumes...
        </div>
      )}
    </Card>
  );
}
