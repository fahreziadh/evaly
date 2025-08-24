import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle,
  ArrowRight,
  ChevronDown,
  Star
} from "lucide-react";
import { fetchGitHubStars } from "@/lib/github";
import { useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  loader: async () => {
    const stars = await fetchGitHubStars("fahreziadh/evaly");
    return { stars };
  },
  staleTime: 1000 * 60 * 60 * 4, // 4 hours cache
  gcTime: 1000 * 60 * 60 * 8,    // 8 hours garbage collection
  head: () => ({
    meta: [
      {
        title: "Pricing - Evaly Testing Platform",
      },
      {
        name: "description",
        content: "Simple, transparent pricing for Evaly testing platform. Free during alpha, open source forever.",
      },
    ],
  }),
});

function PricingPage() {
  const { stars } = useLoaderData({ from: "/pricing" });
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <h1 className="text-lg font-bold">evaly</h1>
            </a>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
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
                <Button variant="ghost" size="sm">
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
                <Button size="sm">Get started</Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-6">
          <div className="inline-block border px-3 py-1 text-xs  text-muted-foreground">
            PRICING
          </div>
          
          <h1 className="text-3xl md:text-4xl  font-bold tracking-tight">
            Simple, transparent<br />
            <span className="text-primary">pricing</span>
          </h1>
          
          <p className="text-muted-foreground max-w-xl ">
            free during alpha, open source forever.<br />
            no hidden fees, no vendor lock-in.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container max-w-4xl mx-auto px-4 py-16 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Alpha (Current) */}
          <div className="border p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl  font-bold">alpha</h2>
                <div className="inline-block border border-primary px-2 py-1 text-xs  text-primary">
                  CURRENT
                </div>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl  font-bold">free</span>
              </div>
              <p className="text-sm text-muted-foreground ">
                full access during alpha testing
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm ">unlimited tests</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm ">unlimited participants</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm ">question banks</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm ">real-time analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm ">csv exports</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm ">community support</span>
              </div>
            </div>
            
            <a href="/app" className="block">
              <Button className="w-full ">
                start testing now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </a>
          </div>

          {/* Future Plans */}
          <div className="border p-6 opacity-75">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl  font-bold">future plans</h2>
                <div className="inline-block border px-2 py-1 text-xs  text-muted-foreground">
                  COMING SOON
                </div>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl  font-bold text-muted-foreground">tbd</span>
              </div>
              <p className="text-sm text-muted-foreground ">
                pricing will be announced before beta
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm  text-muted-foreground">everything in alpha</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm  text-muted-foreground">priority support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm  text-muted-foreground">advanced integrations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm  text-muted-foreground">custom branding</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm  text-muted-foreground">sla guarantees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm  text-muted-foreground">dedicated support</span>
              </div>
            </div>
            
            <Button disabled className="w-full ">
              coming soon
            </Button>
          </div>
        </div>
      </section>

      {/* Open Source Promise */}
      <section className="container max-w-4xl mx-auto px-4 py-16 border-t border-border">
        <div className="text-center space-y-6">
          <h2 className="text-2xl  font-bold">
            open source promise
          </h2>
          <p className="text-muted-foreground  max-w-2xl mx-auto">
            evaly will always have an open source version available.<br />
            self-host for free, forever. no vendor lock-in.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a href="https://github.com/fahreziadh/evaly" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="">
                <GithubIcon className="h-4 w-4 mr-2" />
                view source code
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container max-w-4xl mx-auto px-4 py-16 border-t border-border">
        <div className="mb-10">
          <h2 className="text-2xl  font-bold mb-2">frequently asked</h2>
          <p className="text-muted-foreground ">common pricing questions</p>
        </div>
        
        <div className="space-y-6">
          <div className="border p-4">
            <h3 className=" font-bold mb-2">how long is alpha free?</h3>
            <p className="text-sm text-muted-foreground ">
              alpha is free until we reach beta status. we'll announce pricing at least 30 days before any charges begin.
            </p>
          </div>
          
          <div className="border p-4">
            <h3 className=" font-bold mb-2">will there always be a free option?</h3>
            <p className="text-sm text-muted-foreground ">
              yes. evaly is open source, so you can always self-host for free. we'll also consider a free tier for hosted service.
            </p>
          </div>
          
          <div className="border p-4">
            <h3 className=" font-bold mb-2">what happens to my data?</h3>
            <p className="text-sm text-muted-foreground ">
              your data is yours. export anytime, migrate easily. no vendor lock-in with open source architecture.
            </p>
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
}