import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, X, File, CheckCircle } from "lucide-react";

interface FileListProps {
  files: (File & { isUploaded?: boolean })[];
  onFileRemove: (index: number) => void;
}

const getFileIcon = (type: string | undefined) => {
  if (!type) return '📎';
  
  switch (type) {
    case 'application/pdf':
      return '📄';
    case 'text/csv':
      return '📊';
    case 'text/plain':
      return '📝';
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return '📝';
    default:
      return '📎';
  }
};

const formatFileSize = (bytes: number | undefined) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function FileList({ files, onFileRemove }: FileListProps) {
  if (!files || files.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        No files selected
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {files.filter(file => file).map((file, index) => (
        <Card key={`${file.name || 'unnamed'}-${index}`} className={`glass p-4 ${file.isUploaded ? 'border-green-200 bg-green-50/10' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="text-2xl flex-shrink-0">
                {getFileIcon(file.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-foreground truncate">
                    {file.name || 'Unnamed file'}
                  </h4>
                  {file.isUploaded && (
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(file.size)} • {file.type ? file.type.split('/')[1]?.toUpperCase() || 'UNKNOWN' : 'UNKNOWN'}
                  {file.isUploaded && <span className="text-green-600 ml-2">• Uploaded</span>}
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFileRemove(index)}
              className="text-muted-foreground hover:text-destructive flex-shrink-0"
              title={file.isUploaded ? "Remove from list" : "Remove file"}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}