import { Button } from "../ui/button";
import {
  Users,
  BarChart3,
  Shield,
  ChevronDown,
  CheckCircle,
  TrendingUp,
  FileText,
  Zap,
  Lock,
  Globe,
  Star,
  ArrowRight,
  Check,
  Sparkles,
  Clock,
  BookOpen,
  Award,
  Settings,
  ChartBar
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { useLoaderData } from "@tanstack/react-router";
import { Badge } from "../ui/badge";

// Placeholder Dashboard Component
const DashboardPlaceholder = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
              <span className="text-white font-bold">E</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Test Analytics</h3>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Tests
            </button>
            <button className="text-gray-600 hover:text-gray-900">Questions</button>
            <button className="text-gray-600 hover:text-gray-900">Participants</button>
            <button className="text-gray-600 hover:text-gray-900">Analytics</button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              Filter
            </span>
          </button>
          <button className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
            Last 24 hours
          </button>
          <button className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800">
            Switch to Events
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">• Tests</span>
            <span className="text-xs text-gray-500">▲</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">7.2K</div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-green-600">↑ 18%</span>
            <span className="text-xs text-gray-500">vs last week</span>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">• Completions</span>
            <span className="text-xs text-gray-500">▲</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">165</div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-green-600">↑ 5%</span>
            <span className="text-xs text-gray-500">vs last week</span>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">• Avg Score</span>
            <span className="text-xs text-gray-500">▲</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">85%</div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-red-600">↓ 2%</span>
            <span className="text-xs text-gray-500">vs last week</span>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">• Active</span>
            <span className="text-xs text-gray-500">▲</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">42</div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-green-600">↑ 12%</span>
            <span className="text-xs text-gray-500">vs last week</span>
          </div>
        </div>
      </div>
      
      {/* Chart Area */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="h-64 flex items-end justify-between gap-2">
          {[40, 65, 45, 70, 55, 80, 60, 75, 50, 85, 70, 90, 65, 75, 80, 60, 85, 70, 95, 75].map((height, i) => (
            <div key={i} className="flex-1">
              <div 
                className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm hover:from-blue-600 hover:to-blue-500 transition-colors cursor-pointer"
                style={{ height: `${height}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-xs text-gray-500">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const { stars = 0 } = useLoaderData({ from: "/" }) as { stars: number };
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-lg z-50">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold">evaly</h1>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                      Product
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem asChild>
                      <a href="#features" className="cursor-pointer">
                        <FileText className="h-4 w-4 mr-2" />
                        Test Management
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="#analytics" className="cursor-pointer">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analytics & Insights
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="#security" className="cursor-pointer">
                        <Shield className="h-4 w-4 mr-2" />
                        Security & Privacy
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                      Solutions
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem>
                      <Users className="h-4 w-4 mr-2" />
                      For Educators
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      For Companies
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      For Training Centers
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                      Resources
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem>
                      Documentation
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      API Reference
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Community
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  Enterprise
                </Button>
                
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  Customers
                </Button>
                
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  Pricing
                </Button>
              </nav>
            </div>
            
            <div className="flex items-center gap-3">
              <a href="/app">
                <Button className="bg-black text-white hover:bg-gray-800 rounded-lg px-4 py-2 h-auto font-medium">
                  Dashboard
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="container max-w-7xl mx-auto px-6 pt-20 pb-12">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Badge */}
            <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer rounded-full">
              Introducing Evaly Analytics
              <span className="ml-2 text-gray-500">Read more →</span>
            </Badge>
            
            {/* Heading */}
            <div className="space-y-4 max-w-4xl">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900">
                Turn tests into insights
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Evaly is the modern testing platform for educators,
                training centers, and assessment teams.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Button className="bg-black text-white hover:bg-gray-800 px-6 py-3 text-base font-medium rounded-lg h-auto">
                Start for free
              </Button>
              <Button variant="outline" className="border-gray-300 hover:bg-gray-50 px-6 py-3 text-base font-medium rounded-lg h-auto">
                Get a demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pills */}
      <section className="container max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-2 text-base font-medium">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <FileText className="h-4 w-4 text-orange-600" />
            </div>
            <span>Test Management</span>
          </div>
          <div className="flex items-center gap-2 text-base font-medium">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-green-600" />
            </div>
            <span>Analytics Dashboard</span>
          </div>
          <div className="flex items-center gap-2 text-base font-medium">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            <span>Participant Tracking</span>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="container max-w-7xl mx-auto px-6 py-12">
        <div className="relative">
          {/* Placeholder Dashboard */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <DashboardPlaceholder />
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="container max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
            <Sparkles className="h-3 w-3 inline mr-1" />
            POWERFUL FEATURES
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Everything you need to run tests
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From question banks to detailed analytics, we've got you covered
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group hover:shadow-lg transition-shadow p-8 rounded-2xl border border-gray-200 bg-white">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Question Banks</h3>
            <p className="text-gray-600 mb-4">Build and organize reusable question libraries. Tag by topic, difficulty, and type for easy management.</p>
            <a href="#" className="text-blue-600 font-medium flex items-center group-hover:gap-2 transition-all">
              Learn more <ArrowRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div className="group hover:shadow-lg transition-shadow p-8 rounded-2xl border border-gray-200 bg-white">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ChartBar className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Real-time Analytics</h3>
            <p className="text-gray-600 mb-4">Monitor test progress live. Get instant insights on completion rates, scores, and time spent.</p>
            <a href="#" className="text-blue-600 font-medium flex items-center group-hover:gap-2 transition-all">
              Learn more <ArrowRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div className="group hover:shadow-lg transition-shadow p-8 rounded-2xl border border-gray-200 bg-white">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Auto Grading</h3>
            <p className="text-gray-600 mb-4">Automatic scoring with customizable grading rules. Instant results for participants and organizers.</p>
            <a href="#" className="text-blue-600 font-medium flex items-center group-hover:gap-2 transition-all">
              Learn more <ArrowRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div className="group hover:shadow-lg transition-shadow p-8 rounded-2xl border border-gray-200 bg-white">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Time Management</h3>
            <p className="text-gray-600 mb-4">Set time limits per test or per question. Schedule tests to start and end automatically.</p>
            <a href="#" className="text-blue-600 font-medium flex items-center group-hover:gap-2 transition-all">
              Learn more <ArrowRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div className="group hover:shadow-lg transition-shadow p-8 rounded-2xl border border-gray-200 bg-white">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Secure Testing</h3>
            <p className="text-gray-600 mb-4">Prevent cheating with randomized questions, browser lockdown, and activity monitoring.</p>
            <a href="#" className="text-blue-600 font-medium flex items-center group-hover:gap-2 transition-all">
              Learn more <ArrowRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div className="group hover:shadow-lg transition-shadow p-8 rounded-2xl border border-gray-200 bg-white">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Settings className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Customization</h3>
            <p className="text-gray-600 mb-4">Brand your tests with custom themes, logos, and certificates. Make it truly yours.</p>
            <a href="#" className="text-blue-600 font-medium flex items-center group-hover:gap-2 transition-all">
              Learn more <ArrowRight className="h-4 w-4 ml-1" />
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-24">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-2">10K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-2">50K+</div>
              <div className="text-gray-600">Tests Created</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-2">1M+</div>
              <div className="text-gray-600">Questions Answered</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="container max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
            <Users className="h-3 w-3 inline mr-1" />
            USE CASES
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Built for every testing need
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Whether you're an educator, trainer, or recruiter, Evaly adapts to your requirements
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">For Educators</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Create and manage course assessments</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Track student progress over time</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Generate detailed performance reports</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Support for multiple question types</span>
              </li>
            </ul>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Start Teaching <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">For Companies</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Streamline recruitment assessments</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Conduct skills verification tests</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Employee training and certification</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Compliance and knowledge checks</span>
              </li>
            </ul>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Start Hiring <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-gray-50 py-24">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Loved by educators worldwide
            </h2>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-600 ml-2">4.9/5 from {stars} reviews</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6">"Evaly transformed how I conduct assessments. The analytics are incredible and my students love the clean interface."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Johnson</div>
                  <div className="text-sm text-gray-600">University Professor</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6">"We cut our recruitment time by 50% using Evaly's assessment platform. The automated grading is a game-changer."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600"></div>
                <div>
                  <div className="font-semibold text-gray-900">Michael Chen</div>
                  <div className="text-sm text-gray-600">HR Director</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6">"The question bank feature saves me hours every week. I can reuse and remix questions across different tests easily."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600"></div>
                <div>
                  <div className="font-semibold text-gray-900">Emily Davis</div>
                  <div className="text-sm text-gray-600">Training Manager</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Source CTA */}
      <section className="container max-w-7xl mx-auto px-6 py-24">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Globe className="h-3 w-3 inline mr-1" />
              OPEN SOURCE
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Free and open source forever
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join our community of contributors. Help us build the future of online testing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="https://github.com/fahreziadh/evaly" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                  <Star className="h-5 w-5 mr-2" />
                  Star on GitHub
                  {stars > 0 && <span className="ml-2 bg-black/10 px-2 py-0.5 rounded-full text-sm">{stars}</span>}
                </Button>
              </a>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Read the Docs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-black text-white rounded-2xl mx-6 max-w-7xl lg:mx-auto mt-12 mb-12">
        <div className="container px-12 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Get Started in Minutes</h3>
              </div>
              <p className="text-gray-300 max-w-xl">
                No credit card required. Start creating tests immediately with our generous free tier.
              </p>
            </div>
            <Button className="bg-white text-black hover:bg-gray-100 px-6 py-3 font-medium rounded-lg h-auto">
              Start for free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-24">
        <div className="container max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 md:col-span-1">
              <h3 className="font-bold text-xl mb-4">evaly</h3>
              <p className="text-sm text-gray-600">The modern testing platform for educators and training teams.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-gray-900">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Test Management</a></li>
                <li><a href="#" className="hover:text-gray-900">Analytics</a></li>
                <li><a href="#" className="hover:text-gray-900">Question Banks</a></li>
                <li><a href="#" className="hover:text-gray-900">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-gray-900">Solutions</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">For Educators</a></li>
                <li><a href="#" className="hover:text-gray-900">For Companies</a></li>
                <li><a href="#" className="hover:text-gray-900">For Training</a></li>
                <li><a href="#" className="hover:text-gray-900">Enterprise</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-gray-900">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Documentation</a></li>
                <li><a href="#" className="hover:text-gray-900">API Reference</a></li>
                <li><a href="#" className="hover:text-gray-900">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-gray-900">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">About</a></li>
                <li><a href="#" className="hover:text-gray-900">Careers</a></li>
                <li><a href="https://github.com/fahreziadh/evaly" className="hover:text-gray-900">GitHub</a></li>
                <li><a href="#" className="hover:text-gray-900">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-12 pt-8 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              © 2024 Evaly. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">Privacy</a>
              <a href="#" className="hover:text-gray-900">Terms</a>
              <a href="#" className="hover:text-gray-900">Security</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;