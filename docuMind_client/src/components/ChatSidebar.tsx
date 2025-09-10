import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, RefreshCw, FolderOpen } from "lucide-react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";

interface Document {
  $id: string;
  name: string;
  mimeType: string;
  $createdAt: string;
}

export function Sidebar() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Set user_id on mount and fetch documents
  useEffect(() => {
    let id = Cookies.get("user_id");
    if (!id) {
      id = uuidv4();
      Cookies.set("user_id", id, { expires: 365 }); // Persist for 1 year
    }
    setUserId(id);
    fetchDocuments(id);
  }, []);

  // Listen for storage events to refresh when files are uploaded
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'documind_refresh_files' && userId) {
        fetchDocuments(userId);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events from same tab
    const handleCustomRefresh = () => {
      if (userId) {
        fetchDocuments(userId);
      }
    };
    
    window.addEventListener('documind_refresh_files', handleCustomRefresh);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('documind_refresh_files', handleCustomRefresh);
    };
  }, [userId]);

  // Fetch user's uploaded documents from backend
  const fetchDocuments = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/v1/files", {
        params: { user_id: id }, // Filter by user_id
      });
      
      console.log('Files API response:', res.data);
      
      const data = res.data.files; // Adjust based on actual response structure
      const docs: Document[] = data.map((file) => {
        const doc = {
          $id: file.fileId || file.$id, // Adjust based on backend response
          name: file.fileName || file.name,
          mimeType: file.mimeType || "application/pdf", // Default to PDF if missing
          $createdAt: file.upload_time || new Date().toISOString(), // Adjust based on response
        };
        console.log('Mapped document:', doc);
        return doc;
      });
      
      console.log('Final documents array:', docs);
      setDocuments(docs);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setDocuments([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Test delete endpoint accessibility
  const testDeleteEndpoint = async (fileId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/files/test-delete/${fileId}`,
        { params: { user_id: userId } }
      );
      console.log('Test delete endpoint response:', response.data);
    } catch (error) {
      console.error('Test delete endpoint error:', error);
    }
  };

  // Delete a specific document
  const handleDeleteDocument = async (fileId: string, fileName: string) => {
    if (!userId) {
      console.error('No userId available for delete operation');
      alert('Error: No user ID available. Please refresh the page.');
      return;
    }
    
    if (!fileId) {
      console.error('No fileId provided for delete operation');
      alert('Error: No file ID available for deletion.');
      return;
    }
    
    console.log('Attempting to delete:', { fileId, fileName, userId });
    
    // Add confirmation dialog
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }
    
    try {
      console.log('Making DELETE request to:', `http://localhost:5000/api/v1/files/${fileId}`);
      
      const response = await axios.delete(
        `http://localhost:5000/api/v1/files/${fileId}`,
        { 
          params: { user_id: userId },
          timeout: 10000 // 10 second timeout
        }
      );
      
      console.log('Delete response:', response.data);
      
      // Refresh the documents list
      await fetchDocuments(userId);
      
      // Trigger refresh for other components
      localStorage.setItem('documind_refresh_files', Date.now().toString());
      window.dispatchEvent(new Event('documind_refresh_files'));
      
      console.log('Document deleted successfully');
      alert('Document deleted successfully!');
    } catch (error) {
      console.error("Error deleting document:", error);
      
      // Show user-friendly error message
      if (error.response) {
        const errorMsg = error.response.data.error || error.response.statusText;
        alert(`Failed to delete document: ${errorMsg}`);
      } else if (error.code === 'ECONNABORTED') {
        alert('Delete request timed out. Please try again.');
      } else {
        alert(`Failed to delete document: ${error.message}`);
      }
    }
  };

  // Refresh handler
  const handleRefresh = async () => {
    if (userId) {
      setLoading(true);
      await fetchDocuments(userId);
    }
  };

  const formatTimeAgo = (isoDate: string) => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="w-80 glass border-r border-border/50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Documents</h2>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {loading
            ? "Loading..."
            : `${documents.length} document${documents.length !== 1 ? "s" : ""} uploaded`}
        </p>
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {documents.length > 0 ? (
          documents.map((doc) => (
            <Card
              key={doc.$id}
              className="glass p-3 hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-foreground truncate">
                    {doc.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {doc.mimeType.split("/")[1].toUpperCase() || "PDF"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(doc.$createdAt)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Delete button clicked for:', doc);
                    // Test endpoint first
                    testDeleteEndpoint(doc.$id);
                    // Then attempt delete
                    handleDeleteDocument(doc.$id, doc.name);
                  }}
                  title="Delete document"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        ) : (
          !loading && (
            <div className="text-center py-8 space-y-3">
              <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto">
                <FolderOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No documents uploaded</p>
              <Button variant="outline" size="sm" asChild>
                <a href="/upload">Upload Documents</a>
              </Button>
            </div>
          )
        )}
      </div>

      {/* Footer */}
      {documents.length > 0 && (
        <div className="p-4 border-t border-border/50">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a href="/upload">
              <FileText className="h-4 w-4 mr-2" />
              Add More Documents
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}