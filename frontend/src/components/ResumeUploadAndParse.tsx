import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CloudUpload, File, X, Loader2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ParsedResume {
  content: string;
  fileName: string;
}

export function ResumeUploadAndParse() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedResumes, setParsedResumes] = useState<ParsedResume[]>([]);
  const [selectedResume, setSelectedResume] = useState<ParsedResume | null>(
    null
  );
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    const validFiles = files.filter((file) => {
      const fileType = file.type;
      return (
        fileType === "application/pdf" ||
        fileType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        fileType === "text/plain"
      );
    });

    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid file format",
        description: "Please upload only PDF, DOCX, or text files.",
        variant: "destructive",
      });
    }

    if (validFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...validFiles]);
      processFiles(validFiles);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setParsedResumes((prev) => prev.filter((_, i) => i !== index));
    if (selectedResume?.fileName === uploadedFiles[index].name) {
      setSelectedResume(null);
    }
  };

  const processFiles = async (files: File[]) => {
    setIsProcessing(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
          "http://localhost:5000/api/resume/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to process ${file.name}`);
        }

        const result = await response.json();
        const parsedResume = {
          content: result.data.content,
          fileName: file.name,
        };
        setParsedResumes((prev) => [...prev, parsedResume]);
      }

      toast({
        title: "Resumes processed successfully",
        description: `${files.length} resume${
          files.length > 1 ? "s" : ""
        } have been analyzed.`,
      });

      // Set the first parsed resume as selected if none is selected
      if (!selectedResume && files.length > 0) {
        const formData = new FormData();
        formData.append("file", files[0]);
        const firstFileResponse = await fetch(
          "http://localhost:5000/api/resume/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const firstFileResult = await firstFileResponse.json();
        setSelectedResume({
          content: firstFileResult.data.content,
          fileName: files[0].name,
        });
      }
    } catch (error) {
      console.error("Error processing resumes:", error);
      toast({
        title: "Processing failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while processing resumes.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 h-[600px]">
      {/* Left side - Upload section */}
      <Card className="border-2 border-dashed p-6 relative overflow-hidden">
        <div
          className={`text-center p-6 ${
            isDragging ? "bg-blue-50 dark:bg-blue-900/20" : ""
          } rounded-lg transition-colors`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CloudUpload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Upload Resumes</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Drag and drop PDF, DOCX, or text files here
          </p>
          <div className="relative">
            <Button className="relative rounded-full bg-gradient-primary hover:opacity-90">
              Select Files
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                multiple
                accept=".pdf,.docx,.txt"
              />
            </Button>
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-3">
              Uploaded Files ({uploadedFiles.length})
            </h4>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2 p-1">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedResume?.fileName === file.name
                        ? "bg-blue-100 dark:bg-blue-900/30"
                        : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setSelectedResume(parsedResumes[index])}
                  >
                    <div className="flex items-center">
                      <File className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm truncate max-w-[200px]">
                        {file.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      disabled={isProcessing}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </Card>

      {/* Right side - Parsed content */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Parsed Resume Content</h3>
          {isProcessing && (
            <div className="flex items-center text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </div>
          )}
        </div>

        <ScrollArea className="h-[500px]">
          {selectedResume ? (
            <div className="prose dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {selectedResume.content}
              </pre>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <FileText className="h-12 w-12 mb-4" />
              <p>Select a resume to view its parsed content</p>
            </div>
          )}
        </ScrollArea>
      </Card>
    </div>
  );
}
