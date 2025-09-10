import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Database,
  MessageSquare,
  Zap,
  Github,
  ExternalLink,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-180px)] px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-6 animate-fade-in">
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-primary to-primary-glow animate-pulse-glow">
              <Brain className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
            About DocuMind RAG
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A powerful document Q&A assistant powered by Retrieval-Augmented
            Generation (RAG) technology.
          </p>
        </div>

        {/* What is RAG */}
        <Card className="glass p-8 space-y-6">
          <h2 className="text-2xl font-bold text-foreground">What is RAG?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Retrieval-Augmented Generation (RAG) is an AI technique that
            combines the power of large language models with your specific
            documents. Instead of relying solely on pre-trained knowledge, RAG
            retrieves relevant information from your uploaded documents and uses
            it to generate accurate, contextual responses.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Database className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">Document Processing</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Your documents are chunked, embedded, and stored in a vector
                database for efficient retrieval.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-accent" />
                <h3 className="text-lg font-semibold">Intelligent Responses</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Questions are matched with relevant document sections to provide
                accurate, source-backed answers.
              </p>
            </div>
          </div>
        </Card>

        {/* Features */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass p-6 space-y-4 hover:glow-effect transition-all duration-300">
              <div className="p-3 rounded-xl bg-primary/10 w-fit">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Multi-Format Support</h3>
              <p className="text-muted-foreground">
                Upload PDF, CSV, TXT, and DOCX files. Our system automatically
                extracts and processes the content.
              </p>
            </Card>

            <Card className="glass p-6 space-y-4 hover:glow-effect transition-all duration-300">
              <div className="p-3 rounded-xl bg-accent/10 w-fit">
                <MessageSquare className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">
                Conversational Interface
              </h3>
              <p className="text-muted-foreground">
                Natural chat interface with typing indicators, message history,
                and contextual follow-up questions.
              </p>
            </Card>

            <Card className="glass p-6 space-y-4 hover:glow-effect transition-all duration-300">
              <div className="p-3 rounded-xl bg-primary/10 w-fit">
                <Database className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Vector Search</h3>
              <p className="text-muted-foreground">
                Advanced semantic search to find the most relevant document
                sections for your questions.
              </p>
            </Card>

            <Card className="glass p-6 space-y-4 hover:glow-effect transition-all duration-300">
              <div className="p-3 rounded-xl bg-accent/10 w-fit">
                <Brain className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Context-Aware</h3>
              <p className="text-muted-foreground">
                Maintains conversation context and provides relevant answers
                based on previous questions.
              </p>
            </Card>
          </div>
        </div>

        {/* Tech Stack */}
        <Card className="glass p-8 space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Built With</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-3xl">⚛️</div>
              <h3 className="font-semibold">React</h3>
              <p className="text-sm text-muted-foreground">
                Modern frontend framework
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl">🎨</div>
              <h3 className="font-semibold">Tailwind CSS</h3>
              <p className="text-sm text-muted-foreground">
                Utility-first styling
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl">🧩</div>
              <h3 className="font-semibold">ShadCN UI</h3>
              <p className="text-sm text-muted-foreground">
                Beautiful components
              </p>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold">Ready to Get Started?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="hero-gradient glow-effect">
              <a href="/upload" className="flex items-center gap-2">
                Try It Now
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                View Source
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
