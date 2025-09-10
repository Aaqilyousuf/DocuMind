import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Home, Upload, MessageSquare, Info } from "lucide-react";

export function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="glass border-b border-border/50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              DocuMind RAG
            </h1>
            <p className="text-xs text-muted-foreground">Document Assistant</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant={isActive("/") ? "default" : "ghost"}
            size="sm"
            asChild
            className={isActive("/") ? "glow-effect" : ""}
          >
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>

          <Button
            variant={isActive("/upload") ? "default" : "ghost"}
            size="sm"
            asChild
            className={isActive("/upload") ? "glow-effect" : ""}
          >
            <Link to="/upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </Link>
          </Button>

          <Button
            variant={isActive("/chat") ? "default" : "ghost"}
            size="sm"
            asChild
            className={isActive("/chat") ? "glow-effect" : ""}
          >
            <Link to="/chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </Link>
          </Button>

          <Button
            variant={isActive("/about") ? "default" : "ghost"}
            size="sm"
            asChild
            className={isActive("/about") ? "glow-effect" : ""}
          >
            <Link to="/about" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              About
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
