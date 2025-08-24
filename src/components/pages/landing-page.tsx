import { Button } from "../ui/button";
import {
  Users,
  BarChart3,
  Shield,
  ArrowRight,
  ChevronDown,
  Star
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { useLoaderData } from "@tanstack/react-router";

const LandingPage = () => {
  const { stars } = useLoaderData({ from: "/" });
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-mono font-bold">evaly</h1>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" >
                    Use cases
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <a href="/use-cases" className="text-sm">
                      All use cases
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/use-cases#educators" className="text-sm">
                      For educators
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/use-cases#companies" className="text-sm">
                      For companies
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/use-cases#training-centers" className="text-sm">
                      For training centers
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/use-cases#self-learners" className="text-sm">
                      For self-learners
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <a href="/pricing">
                <Button variant="ghost" size="sm" >
                  Pricing
                </Button>
              </a>
              
              <a href="https://github.com/fahreziadh/evaly" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <Star className="h-4 w-4 mr-2" />
                  Star {stars > 0 && `${stars.toLocaleString()}`}
                </Button>
              </a>
              
              <a href="/app">
                <Button size="sm" >Get started</Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-6">
          <div className="inline-block border px-3 py-1 text-xs font-mono text-muted-foreground">
            OPEN SOURCE • FREE • ALPHA
          </div>
          
          <h1 className="text-3xl md:text-4xl font-mono font-bold tracking-tight">
            Test platform<br />
            for <span className="text-primary">educators</span>
          </h1>
          
          <p className="text-muted-foreground max-w-xl font-mono">
            create, distribute, and analyze tests with zero hassle.<br />
            built for classrooms, designed for simplicity.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start gap-3 pt-4">
            <a href="/app">
              <Button>
                Start testing now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </a>
            <a href="https://github.com/fahreziadh/evaly" target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                View source
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container max-w-4xl mx-auto px-4 py-16 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border p-4">
            <Users className="h-5 w-5 mb-2 text-primary" />
            <h3 className="font-mono font-bold mb-2">easy management</h3>
            <p className="text-sm text-muted-foreground font-mono">
              create questions, organize tests, invite participants. 
              everything in one place.
            </p>
          </div>
          
          <div className="border p-4">
            <BarChart3 className="h-5 w-5 mb-2 text-primary" />
            <h3 className="font-mono font-bold mb-2">real insights</h3>
            <p className="text-sm text-muted-foreground font-mono">
              detailed analytics, performance tracking, 
              and automatic grading.
            </p>
          </div>
          
          <div className="border p-4">
            <Shield className="h-5 w-5 mb-2 text-primary" />
            <h3 className="font-mono font-bold mb-2">secure & private</h3>
            <p className="text-sm text-muted-foreground font-mono">
              your data stays yours. open source, 
              transparent, and trustworthy.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container max-w-4xl mx-auto px-4 py-16 border-t border-border">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-mono font-bold mb-2">how it works</h2>
          <p className="text-muted-foreground font-mono">three steps to better testing</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-2">
            <div className="border border-primary w-10 h-10 rounded-full flex items-center justify-center mx-auto">
              <span className="font-mono font-bold text-primary text-sm">01</span>
            </div>
            <h3 className="font-mono font-bold">create questions</h3>
            <p className="text-sm text-muted-foreground font-mono">
              build question banks, organize by topics, 
              reuse across multiple tests.
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="border border-primary w-10 h-10 rounded-full flex items-center justify-center mx-auto">
              <span className="font-mono font-bold text-primary text-sm">02</span>
            </div>
            <h3 className="font-mono font-bold">distribute tests</h3>
            <p className="text-sm text-muted-foreground font-mono">
              share test links, set time limits, 
              monitor live progress.
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="border border-primary w-10 h-10 rounded-full flex items-center justify-center mx-auto">
              <span className="font-mono font-bold text-primary text-sm">03</span>
            </div>
            <h3 className="font-mono font-bold">analyze results</h3>
            <p className="text-sm text-muted-foreground font-mono">
              automatic grading, detailed analytics, 
              export to csv.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container max-w-4xl mx-auto px-4 py-16 border-t border-border">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-mono font-bold">
            ready to simplify testing?
          </h2>
          <p className="text-muted-foreground font-mono">
            start using evaly today - completely free during alpha
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <a href="/app">
              <Button >
                get started now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <h1 className="text-sm font-mono font-bold">evaly</h1>
              <span className="text-xs font-mono text-muted-foreground">open source testing platform</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://github.com/fahreziadh/evaly" target="_blank" rel="noopener noreferrer" 
                 className="text-sm font-mono text-muted-foreground hover:text-foreground">
                github
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;