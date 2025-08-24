import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  GraduationCap,
  Building,
  Users,
  BookOpen,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Star
} from "lucide-react";
import { fetchGitHubStars } from "@/lib/github";
import { useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute("/use-cases")({
  component: UseCasesPage,
  loader: async () => {
    const stars = await fetchGitHubStars("fahreziadh/evaly");
    return { stars };
  },
  staleTime: 1000 * 60 * 60 * 4, // 4 hours cache
  gcTime: 1000 * 60 * 60 * 8,    // 8 hours garbage collection
  head: () => ({
    meta: [
      {
        title: "Use Cases - Evaly Testing Platform",
      },
      {
        name: "description",
        content: "Discover how educators, companies, training centers, and self-learners use Evaly for their testing needs.",
      },
    ],
  }),
});

function UseCasesPage() {
  const { stars } = useLoaderData({ from: "/use-cases" });
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <h1 className="text-lg font-mono font-bold">evaly</h1>
            </a>
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
                <Button variant="outline" size="sm" >
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

      {/* Hero */}
      <section className="container max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-6">
          <div className="inline-block border px-3 py-1 text-xs font-mono text-muted-foreground">
            USE CASES
          </div>
          
          <h1 className="text-3xl md:text-4xl font-mono font-bold tracking-tight">
            Perfect for every<br />
            testing <span className="text-primary">need</span>
          </h1>
          
          <p className="text-muted-foreground max-w-xl font-mono">
            from classrooms to corporate training,<br />
            evaly adapts to your specific requirements.
          </p>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="container max-w-4xl mx-auto px-4 py-16 border-t border-border">
        <div className="grid grid-cols-1 gap-8">
          {/* Educators */}
          <div className="border p-6">
            <div className="flex items-start gap-4">
              <GraduationCap className="h-8 w-8 text-primary mt-1" />
              <div className="flex-1">
                <h2 className="text-xl font-mono font-bold mb-3">educators</h2>
                <p className="text-muted-foreground font-mono mb-4">
                  streamline classroom assessments and track student progress
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="font-mono font-bold text-sm mb-2">classroom testing</h3>
                    <ul className="text-sm text-muted-foreground font-mono space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        quick pop quizzes
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        midterm exams
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        final assessments
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-sm mb-2">student management</h3>
                    <ul className="text-sm text-muted-foreground font-mono space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        progress tracking
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        grade analytics
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        parent reports
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Companies */}
          <div className="border p-6">
            <div className="flex items-start gap-4">
              <Building className="h-8 w-8 text-primary mt-1" />
              <div className="flex-1">
                <h2 className="text-xl font-mono font-bold mb-3">companies</h2>
                <p className="text-muted-foreground font-mono mb-4">
                  enhance employee training and validate skills across teams
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="font-mono font-bold text-sm mb-2">training & development</h3>
                    <ul className="text-sm text-muted-foreground font-mono space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        onboarding tests
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        skills assessments
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        compliance training
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-sm mb-2">hr & recruitment</h3>
                    <ul className="text-sm text-muted-foreground font-mono space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        candidate screening
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        performance reviews
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        certification tracking
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Training Centers */}
          <div className="border p-6">
            <div className="flex items-start gap-4">
              <Users className="h-8 w-8 text-primary mt-1" />
              <div className="flex-1">
                <h2 className="text-xl font-mono font-bold mb-3">training centers</h2>
                <p className="text-muted-foreground font-mono mb-4">
                  manage courses and certifications with professional testing
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="font-mono font-bold text-sm mb-2">course management</h3>
                    <ul className="text-sm text-muted-foreground font-mono space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        module completion tests
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        skill validations
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        progress monitoring
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-sm mb-2">certifications</h3>
                    <ul className="text-sm text-muted-foreground font-mono space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        certification exams
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        badge tracking
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        renewal tests
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Self-Learners */}
          <div className="border p-6">
            <div className="flex items-start gap-4">
              <BookOpen className="h-8 w-8 text-primary mt-1" />
              <div className="flex-1">
                <h2 className="text-xl font-mono font-bold mb-3">self-learners</h2>
                <p className="text-muted-foreground font-mono mb-4">
                  practice and validate knowledge at your own pace
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="font-mono font-bold text-sm mb-2">practice & study</h3>
                    <ul className="text-sm text-muted-foreground font-mono space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        knowledge checks
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        practice tests
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        flashcard quizzes
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-sm mb-2">progress tracking</h3>
                    <ul className="text-sm text-muted-foreground font-mono space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        study progress
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        skill building
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        performance analytics
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container max-w-4xl mx-auto px-4 py-16 border-t border-border">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-mono font-bold">
            ready for your use case?
          </h2>
          <p className="text-muted-foreground font-mono">
            start testing today - completely free during alpha
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <a href="/app">
              <Button size="lg" >
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
}