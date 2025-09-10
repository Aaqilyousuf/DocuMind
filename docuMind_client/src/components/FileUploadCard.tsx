import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Upload, FileText, AlertCircle } from "lucide-react";

interface FileUploadCardProps {
  onFilesAdded: (files: File[]) => void;
}

const ACCEPTED_FILE_TYPES = {
  'application/pdf': '.pdf',
  'text/csv': '.csv',
  'text/plain': '.txt',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx'
};

export function FileUploadCard({ onFilesAdded }: FileUploadCardProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFiles = (files: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      if (Object.keys(ACCEPTED_FILE_TYPES).includes(file.type)) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name} is not a supported file type`);
      }
    });

    if (errors.length > 0) {
      setError(errors[0]);
      setTimeout(() => setError(null), 5000);
    }

    return validFiles;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = validateFiles(files);
    
    if (validFiles.length > 0) {
      onFilesAdded(validFiles);
    }
  }, [onFilesAdded]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = validateFiles(files);
    
    if (validFiles.length > 0) {
      onFilesAdded(validFiles);
    }
    
    // Reset input
    e.target.value = '';
  }, [onFilesAdded]);

  return (
    <Card 
      className={`upload-zone ${isDragOver ? 'dragover' : ''} p-12 text-center cursor-pointer glass`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className={`p-4 rounded-full transition-all duration-300 ${
            isDragOver ? 'bg-primary/20 scale-110' : 'bg-primary/10'
          }`}>
            <Upload className={`h-12 w-12 transition-colors ${
              isDragOver ? 'text-primary' : 'text-muted-foreground'
            }`} />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            {isDragOver ? 'Drop files here' : 'Upload Documents'}
          </h3>
          <p className="text-muted-foreground">
            Drag and drop files here or click to browse
          </p>
          <p className="text-sm text-muted-foreground">
            Supports PDF, CSV, TXT, and DOCX files
          </p>
        </div>
        
        <div className="flex justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            PDF
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            CSV
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            TXT
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            DOCX
          </div>
        </div>
        
        {error && (
          <div className="flex items-center justify-center gap-2 text-destructive text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
      </div>
      
      <input
        id="file-input"
        type="file"
        multiple
        accept={Object.values(ACCEPTED_FILE_TYPES).join(',')}
        onChange={handleFileInput}
        className="hidden"
      />
    </Card>
  );
}