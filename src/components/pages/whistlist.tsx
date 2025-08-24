import { Button } from "../ui/button";
import {
  Github,
  Users,
  BarChart3,
  Shield,
  ArrowRight
} from "lucide-react";
const Whistlist = () => {

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-lg  font-bold">evaly</h1>
            </div>
            <div className="flex items-center gap-2">
              <a href="https://github.com/fahreziadh/evaly" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="">
                  <Github className="h-4 w-4 mr-1" />
                  star
                </Button>
              </a>
              <Button asChild className="">
                <a href="/app">get started</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container max-w-4xl mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <div className="inline-block border px-3 py-1 text-xs  text-muted-foreground">
            OPEN SOURCE • FREE • ALPHA
          </div>
          
          <h1 className="text-4xl md:text-5xl  font-bold tracking-tight">
            test platform<br />
            for <span className="text-primary">educators</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-xl mx-auto ">
            create, distribute, and analyze tests with zero hassle.<br />
            built for classrooms, designed for simplicity.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Button asChild size="lg" className="">
              <a href="/app">
                start testing now
                <ArrowRight className="h-4 w-4 ml-2" />
              </a>
            </Button>
            <Button variant="outline" asChild className="">
              <a href="https://github.com/fahreziadh/evaly" target="_blank" rel="noopener noreferrer">
                view source
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container max-w-4xl mx-auto px-4 py-16 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border p-4">
            <Users className="h-5 w-5 mb-2 text-primary" />
            <h3 className=" font-bold mb-2">easy management</h3>
            <p className="text-sm text-muted-foreground ">
              create questions, organize tests, invite participants. 
              everything in one place.
            </p>
          </div>
          
          <div className="border p-4">
            <BarChart3 className="h-5 w-5 mb-2 text-primary" />
            <h3 className=" font-bold mb-2">real insights</h3>
            <p className="text-sm text-muted-foreground ">
              detailed analytics, performance tracking, 
              and automatic grading.
            </p>
          </div>
          
          <div className="border p-4">
            <Shield className="h-5 w-5 mb-2 text-primary" />
            <h3 className=" font-bold mb-2">secure & private</h3>
            <p className="text-sm text-muted-foreground ">
              your data stays yours. open source, 
              transparent, and trustworthy.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container max-w-4xl mx-auto px-4 py-16 border-t border-border">
        <div className="text-center mb-10">
          <h2 className="text-2xl  font-bold mb-2">how it works</h2>
          <p className="text-muted-foreground ">three steps to better testing</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-2">
            <div className="border border-primary w-10 h-10 rounded-full flex items-center justify-center mx-auto">
              <span className=" font-bold text-primary text-sm">01</span>
            </div>
            <h3 className=" font-bold">create questions</h3>
            <p className="text-sm text-muted-foreground ">
              build question banks, organize by topics, 
              reuse across multiple tests.
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="border border-primary w-10 h-10 rounded-full flex items-center justify-center mx-auto">
              <span className=" font-bold text-primary text-sm">02</span>
            </div>
            <h3 className=" font-bold">distribute tests</h3>
            <p className="text-sm text-muted-foreground ">
              share test links, set time limits, 
              monitor live progress.
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="border border-primary w-10 h-10 rounded-full flex items-center justify-center mx-auto">
              <span className=" font-bold text-primary text-sm">03</span>
            </div>
            <h3 className=" font-bold">analyze results</h3>
            <p className="text-sm text-muted-foreground ">
              automatic grading, detailed analytics, 
              export to csv.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container max-w-4xl mx-auto px-4 py-16 border-t border-border">
        <div className="text-center space-y-4">
          <h2 className="text-2xl  font-bold">
            ready to simplify testing?
          </h2>
          <p className="text-muted-foreground ">
            start using evaly today - completely free during alpha
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <Button asChild size="lg" className="">
              <a href="/app">
                get started now
                <ArrowRight className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <h1 className="text-sm  font-bold">evaly</h1>
              <span className="text-xs  text-muted-foreground">open source testing platform</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://github.com/fahreziadh/evaly" target="_blank" rel="noopener noreferrer" 
                 className="text-sm  text-muted-foreground hover:text-foreground">
                github
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Whistlist;
