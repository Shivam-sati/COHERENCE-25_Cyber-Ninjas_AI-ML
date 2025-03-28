
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CloudUpload, File, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAiApi } from "@/lib/ai-api";

export function UploadResumeBox() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const aiApi = useAiApi();

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

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const fileType = file.type;
      return fileType === 'application/pdf' || 
             fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
             fileType.startsWith('image/');
    });

    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid file format",
        description: "Please upload only PDF, DOCX, or image files.",
        variant: "destructive"
      });
    }

    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    setIsProcessing(true);
    
    try {
      // Process each resume file with the AI service
      for (const file of uploadedFiles) {
        await aiApi.analyzeResume(file);
      }
      
      toast({
        title: "Resumes processed successfully",
        description: `${uploadedFiles.length} resume${uploadedFiles.length > 1 ? 's' : ''} have been analyzed and added to the database.`,
      });
      
      setUploadedFiles([]);
    } catch (error) {
      console.error("Error processing resumes:", error);
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An error occurred while processing resumes.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border-2 border-dashed p-6 relative overflow-hidden">
      <div 
        className={`text-center p-6 ${isDragging ? 'bg-blue-50 dark:bg-blue-900/20' : ''} rounded-lg transition-colors`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CloudUpload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Upload Resumes</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Drag and drop PDF, DOCX, or image files here
        </p>
        <div className="relative">
          <Button className="relative rounded-full bg-gradient-primary hover:opacity-90">
            Select Files
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              onChange={handleFileChange}
              multiple
              accept=".pdf,.docx,image/*"
            />
          </Button>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium mb-3">Uploaded Files ({uploadedFiles.length})</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto p-1">
            {uploadedFiles.map((file, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
              >
                <div className="flex items-center">
                  <File className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-full"
                  onClick={() => removeFile(index)}
                  disabled={isProcessing}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button 
              className="rounded-full bg-gradient-primary hover:opacity-90"
              onClick={processFiles}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Process Resumes"
              )}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
