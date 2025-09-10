import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FileText,
  Upload,
  MessageSquare,
  Zap,
  Shield,
  Brain,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-180px)] flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-primary to-primary-glow animate-pulse-glow">
              <Brain className="h-16 w-16 text-white" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              DocuMind RAG
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Transform your documents into intelligent conversations. Upload,
              ask, and discover insights with our advanced RAG-powered
              assistant.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="hero-gradient glow-effect text-lg px-8 py-6"
            >
              <Link to="/upload" className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload & Chat
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
              className="text-lg px-8 py-6"
            >
              <Link to="/about" className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Learn More
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card className="glass p-6 space-y-4 hover:glow-effect transition-all duration-300">
            <div className="p-3 rounded-xl bg-primary/10 w-fit">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Get instant answers from your documents with our optimized RAG
              pipeline.
            </p>
          </Card>

          <Card className="glass p-6 space-y-4 hover:glow-effect transition-all duration-300">
            <div className="p-3 rounded-xl bg-accent/10 w-fit">
              <Shield className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">Secure & Private</h3>
            <p className="text-muted-foreground">
              Your documents stay private. All processing happens securely in
              our environment.
            </p>
          </Card>

          <Card className="glass p-6 space-y-4 hover:glow-effect transition-all duration-300">
            <div className="p-3 rounded-xl bg-primary/10 w-fit">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Natural Conversations</h3>
            <p className="text-muted-foreground">
              Chat naturally about your documents. Ask follow-up questions and
              dive deeper.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
