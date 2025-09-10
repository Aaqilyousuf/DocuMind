import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileUploadCard } from "@/components/FileUploadCard";
import { FileList } from "@/components/FileList";
import { Upload, ArrowRight, FileText } from "lucide-react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  // Set user_id on mount
  useEffect(() => {
    let id = Cookies.get("user_id");
    if (!id) {
      id = uuidv4();
      Cookies.set("user_id", id, { expires: 365 }); // Persist for 1 year
    }
    setUserId(id);
    fetchUploads(id); // Initial fetch of user's files
  }, []);

  // Fetch user's uploaded files from backend
  const fetchUploads = async (id) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/files", // Replace with your Render URL
        { params: { user_id: id } }
      );
      // Transform backend response to match FileList format if needed
      const uploadedFiles = response.data.files.map((file) => ({
        name: file.fileName || 'Unknown file', // Adjust based on backend response structure
        size: file.size || 0, // Placeholder, adjust if size is returned
        type: file.mimeType || 'application/octet-stream', // Add default MIME type
        lastModified: new Date(file.upload_time || Date.now()).getTime(),
        webkitRelativePath: '',
        // Mark as uploaded file to differentiate from new files
        isUploaded: true
      }));
      
      // Only update with uploaded files if we're not currently selecting new files
      // This prevents clearing newly selected files when fetching uploaded ones
      setFiles(prev => {
        const newFiles = prev.filter(f => !f.isUploaded);
        return [...newFiles, ...uploadedFiles];
      });
    } catch (error) {
      console.error("Error fetching uploads:", error);
    }
  };

  // Handle files added via FileUploadCard
  const handleFilesAdded = useCallback((newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  // Handle file removal from the list
  const handleFileRemove = useCallback((index) => {
    setFiles((prev) => {
      const fileToRemove = prev[index];
      
      // If it's an uploaded file, you might want to call delete API here
      if (fileToRemove?.isUploaded) {
        console.log('Removing uploaded file:', fileToRemove.name);
        // TODO: Call delete API if needed
      }
      
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  // Handle document processing (upload to backend)
  const handleProcessDocuments = async () => {
    // Filter out already uploaded files
    const newFiles = files.filter(file => !file.isUploaded);
    
    if (newFiles.length === 0) {
      alert('No new files to upload!');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const totalFiles = newFiles.length;
      let processedFiles = 0;

      // Process files one by one
      for (const file of newFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("user_id", userId); // Add user_id to the request

        const response = await axios.post(
          "http://localhost:5000/api/v1/upload", // Replace with your Render URL
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        console.log("Upload response:", response.data);
        
        processedFiles++;
        setProgress((processedFiles / totalFiles) * 100);
      }

      // Refresh file list after successful upload
      fetchUploads(userId);
      
      // Trigger refresh for other components (like ChatSidebar)
      localStorage.setItem('documind_refresh_files', Date.now().toString());
      window.dispatchEvent(new Event('documind_refresh_files'));

      // Navigate to chat page
      setTimeout(() => {
        navigate("/chat");
      }, 500);
    } catch (error) {
      console.error("Upload failed:", error);
      setIsProcessing(false);
    } finally {
      setIsProcessing(false); // Ensure processing state is cleared
    }
  };

  return (
    <div className="min-h-[calc(100vh-180px)] px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex justify-center">
            <div className="p-3 rounded-xl bg-gradient-to-r from-primary to-primary-glow">
              <Upload className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Upload Documents</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your documents to start chatting with them. We support PDF, CSV,
            TXT, and DOCX files. (Note: Uploads are tied to your browser; clearing
            cookies resets your data.)
          </p>
        </div>

        {/* Upload Section */}
        <div className="space-y-6">
          <FileUploadCard onFilesAdded={handleFilesAdded} />

          {files.length > 0 && (
            <Card className="glass p-6 space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">
                  Files ({files.length}) - {files.filter(f => !f.isUploaded).length} new, {files.filter(f => f.isUploaded).length} uploaded
                </h2>
              </div>

              <FileList files={files} onFileRemove={handleFileRemove} />

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing documents...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={handleProcessDocuments}
                  disabled={isProcessing || files.filter(f => !f.isUploaded).length === 0}
                  className="hero-gradient glow-effect"
                  size="lg"
                >
                  {isProcessing ? (
                    "Processing..."
                  ) : (
                    <>
                      Upload New Documents ({files.filter(f => !f.isUploaded).length})
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}