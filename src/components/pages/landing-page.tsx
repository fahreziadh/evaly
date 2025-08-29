import { Button } from "../ui/button";
import {
  ArrowRight,
  Check,
  Zap,
  ChartBar,
  Users,
  Star,
  Sparkles,
  LineChart,
  Shield,
  Clock,
  MousePointer
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

// Placeholder component for demo GIFs
const DemoPlaceholder = ({ feature }: { feature: string }) => {
  const getFeatureVisual = () => {
    switch (feature) {
      case "questions":
        return (
          <div className="space-y-3">
            <div className="bg-white/80 backdrop-blur rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-5 h-5 rounded-full border-2 border-primary"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="space-y-2 ml-8">
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-5 h-5 rounded border-2 border-gray-300"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="grid grid-cols-2 gap-2 ml-8">
                <div className="h-8 bg-gray-100 rounded"></div>
                <div className="h-8 bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        );
      case "realtime":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{i}</span>
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                  <span className="text-gray-600 text-xs">+12</span>
                </div>
              </div>
              <Badge variant="default" className="bg-green-500">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1"></div>
                16 Active
              </Badge>
            </div>
            <div className="space-y-2">
              {["John D. - Question 5", "Sarah M. - Question 8", "Mike R. - Submitted"].map((text, i) => (
                <div key={i} className="bg-white/80 rounded-lg px-3 py-2 text-sm flex items-center justify-between">
                  <span className="text-gray-700">{text}</span>
                  <span className="text-xs text-gray-500">just now</span>
                </div>
              ))}
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="bg-white/80 backdrop-blur rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-700">Performance Overview</span>
              <Badge variant="secondary">Live</Badge>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">89%</div>
                <div className="text-xs text-gray-500">Avg Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">42</div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">5m</div>
                <div className="text-xs text-gray-500">Avg Time</div>
              </div>
            </div>
            <div className="h-24 flex items-end justify-between gap-1">
              {[60, 75, 85, 70, 90, 85, 95].map((height, i) => (
                <div key={i} className="flex-1 bg-gradient-to-t from-primary to-primary/60 rounded-t opacity-80" style={{ height: `${height}%` }}></div>
              ))}
            </div>
          </div>
        );
      case "instant":
        return (
          <div className="space-y-3">
            <div className="bg-white/80 backdrop-blur rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MousePointer className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">One-Click Sharing</div>
                  <div className="text-xs text-gray-500">Copy link • Send via WhatsApp • Email</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800">Test link copied to clipboard!</span>
              </div>
            </div>
            <div className="text-center text-xs text-gray-500 mt-2">
              evaly.com/s/physics-quiz-2024
            </div>
          </div>
        );
      case "secure":
        return (
          <div className="space-y-3">
            <div className="bg-white/80 backdrop-blur rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="default" className="bg-green-500">
                  <Shield className="h-3 w-3 mr-1" />
                  Secure Mode Active
                </Badge>
                <span className="text-xs text-gray-500">Time left: 45:32</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Browser lockdown enabled</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Copy/paste disabled</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Activity monitoring</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 h-full min-h-[300px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative z-10 w-full max-w-sm">
        {getFeatureVisual()}
      </div>
    </div>
  );
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50">
      {/* Minimal Header */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="container max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="font-bold text-xl">evaly</div>
            <div className="flex items-center gap-3">
              <a href="https://github.com/fahreziadh/evaly" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <Star className="h-4 w-4 mr-2" />
                  Star
                </Button>
              </a>
              <a href="/app">
                <Button size="sm">
                  Get started
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="text-center space-y-6">
            <Badge variant="secondary">
              <Zap className="h-3 w-3 mr-1" />
              CURRENTLY IN BETA
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
              Testing made<br />
              <span className="bg-gradient-to-r from-gray-600 to-gray-900 bg-clip-text text-transparent">
                beautifully simple
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Create and manage tests with a platform that just works. 
              No complexity, no learning curve, just results.
            </p>
            
            <div className="pt-8">
              <a href="/app">
                <Button size="lg">
                  Start creating tests
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <p className="text-sm text-gray-500 mt-4">Free forever. No credit card required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Visual Preview */}
      <section className="container max-w-6xl mx-auto px-6 pb-20">
        <Card className="p-8 md:p-12">
          <div className="space-y-8">
            {/* Fake Dashboard Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="font-semibold text-gray-900">Dashboard</div>
                <div className="flex gap-6 text-sm">
                  <span className="text-gray-500">Tests</span>
                  <span className="text-gray-500">Analytics</span>
                  <span className="text-gray-500">Settings</span>
                </div>
              </div>
              <Button size="sm">
                Create Test
              </Button>
            </div>
            
            {/* Simple Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="text-3xl font-bold text-gray-900">24</div>
                <div className="text-sm text-gray-500 mt-1">Active tests</div>
              </Card>
              <Card className="p-6">
                <div className="text-3xl font-bold text-gray-900">1,248</div>
                <div className="text-sm text-gray-500 mt-1">Total responses</div>
              </Card>
              <Card className="p-6">
                <div className="text-3xl font-bold text-gray-900">89%</div>
                <div className="text-sm text-gray-500 mt-1">Average score</div>
              </Card>
            </div>
            
            {/* Simple Chart Placeholder */}
            <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl flex items-end justify-around p-4 gap-2">
              {[40, 65, 45, 80, 70, 90, 75, 85, 60, 95, 80, 70].map((height, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-gray-300/50 rounded-t"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* Feature Showcase - Zigzag Layout */}
      <section className="py-20 bg-white">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              POWERFUL FEATURES
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From creating engaging tests to tracking real-time progress, we've built the features that matter
            </p>
          </div>

          <div className="space-y-24">
            {/* Feature 1: Smart Question Builder - Left Text, Right Demo */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="outline" className="text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  QUESTION BUILDER
                </Badge>
                <h3 className="text-3xl font-bold text-gray-900">
                  Create any type of question in seconds
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Multiple choice, essays, file uploads, audio responses - we support them all. 
                  Our rich text editor makes formatting a breeze, while smart templates save you hours of work.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">9+ question types available</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Rich text editor with media support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Reusable question templates</span>
                  </li>
                </ul>
              </div>
              <div className="order-first md:order-last">
                <DemoPlaceholder feature="questions" />
              </div>
            </div>

            {/* Feature 2: Real-time Monitoring - Left Demo, Right Text */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <DemoPlaceholder feature="realtime" />
              </div>
              <div className="space-y-6">
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  LIVE MONITORING
                </Badge>
                <h3 className="text-3xl font-bold text-gray-900">
                  Watch progress unfold in real-time
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  See who's taking your test, which questions they're on, and who's finished - all in real-time. 
                  Perfect for proctored exams or when you need to provide immediate support.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Live participant tracking</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Real-time progress updates</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Instant submission notifications</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 3: Analytics Dashboard - Left Text, Right Demo */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="outline" className="text-xs">
                  <LineChart className="h-3 w-3 mr-1" />
                  ANALYTICS
                </Badge>
                <h3 className="text-3xl font-bold text-gray-900">
                  Insights that drive improvement
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Understand performance at a glance with beautiful charts and detailed reports. 
                  Identify problem areas, track improvement over time, and make data-driven decisions.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Automatic grading & scoring</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Question-level analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Export results to CSV</span>
                  </li>
                </ul>
              </div>
              <div className="order-first md:order-last">
                <DemoPlaceholder feature="analytics" />
              </div>
            </div>

            {/* Feature 4: Instant Sharing - Left Demo, Right Text */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <DemoPlaceholder feature="instant" />
              </div>
              <div className="space-y-6">
                <Badge variant="outline" className="text-xs">
                  <MousePointer className="h-3 w-3 mr-1" />
                  INSTANT ACCESS
                </Badge>
                <h3 className="text-3xl font-bold text-gray-900">
                  Share with one click, start in seconds
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  No more complicated invitations or registration hassles. Share your test link via WhatsApp, 
                  email, or any platform. Participants can start immediately - it's that simple.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Direct link sharing</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">No sign-up required for participants</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Works on any device</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 5: Security & Control - Left Text, Right Demo */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="outline" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  SECURE TESTING
                </Badge>
                <h3 className="text-3xl font-bold text-gray-900">
                  Keep your tests secure and fair
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Prevent cheating with browser lockdown, randomized questions, and time limits. 
                  Monitor activity, control access, and ensure every test is taken fairly.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Browser lockdown mode</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Question randomization</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Time limits & scheduling</span>
                  </li>
                </ul>
              </div>
              <div className="order-first md:order-last">
                <DemoPlaceholder feature="secure" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Key Features */}
      <section className="border-y border-gray-100 py-20 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-black/5 mb-4">
                <Zap className="h-5 w-5 text-gray-700" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Lightning fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Create a test in under 60 seconds. Share with a link. Get instant results.
              </p>
            </div>
            
            <div className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-black/5 mb-4">
                <ChartBar className="h-5 w-5 text-gray-700" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Smart analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Understand performance at a glance. Detailed insights without the complexity.
              </p>
            </div>
            
            <div className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-black/5 mb-4">
                <Users className="h-5 w-5 text-gray-700" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Built for teams</h3>
              <p className="text-gray-600 leading-relaxed">
                Collaborate seamlessly. Share question banks. Track progress together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Case */}
      <section className="py-20">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perfect for educators and trainers
            </h2>
            <p className="text-lg text-gray-600">
              Whether you're teaching a class or training a team, we've got you covered.
            </p>
          </div>
          
          <Card className="p-8 md:p-12 bg-gray-50">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-4">
                <h3 className="font-semibold text-xl text-gray-900">For Education</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Create quizzes and exams in minutes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Automatic grading saves hours</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Track student progress over time</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-xl text-gray-900">For Business</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Assess candidates efficiently</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Train and certify employees</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Ensure compliance with testing</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Simple Pricing */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Start free, upgrade when you need more.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <Card className="p-8">
              <h3 className="font-semibold text-xl mb-2">Free</h3>
              <div className="text-3xl font-bold mb-4">$0</div>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>Up to 100 responses/month</li>
                <li>Unlimited tests</li>
                <li>Basic analytics</li>
              </ul>
              <Button variant="outline" className="w-full">
                Get started
              </Button>
            </Card>
            
            <Card className="p-8 border-2 border-primary relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                RECOMMENDED
              </Badge>
              <h3 className="font-semibold text-xl mb-2">Pro</h3>
              <div className="text-3xl font-bold mb-4">$29<span className="text-base font-normal text-gray-600">/month</span></div>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>Unlimited responses</li>
                <li>Advanced analytics</li>
                <li>Priority support</li>
              </ul>
              <Button className="w-full">
                Start free trial
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of educators and trainers using Evaly.
          </p>
          <a href="/app">
            <Button size="lg">
              Create your first test
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-gray-100 py-12 bg-white">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="font-bold text-lg">evaly</div>
            <div className="flex gap-8 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">About</a>
              <a href="#" className="hover:text-gray-900">Privacy</a>
              <a href="#" className="hover:text-gray-900">Terms</a>
              <a href="https://github.com/fahreziadh/evaly" className="hover:text-gray-900">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;