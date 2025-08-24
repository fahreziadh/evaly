import { useQuery } from "convex-helpers/react/cache";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Trophy,
  Target,
  AlertCircle,
  CheckCircle,
  Activity
} from "lucide-react";

interface TestAnalyticsProps {
  testId: Id<"test">;
  onQuestionClick?: (questionId: Id<"question">) => void;
}

export function TestAnalytics({ testId, onQuestionClick }: TestAnalyticsProps) {
  const analytics = useQuery(api.organizer.testResult.getComprehensiveAnalytics, {
    testId,
  });

  if (!analytics) {
    return (
      <div className="space-y-3">
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border p-3 animate-pulse">
              <div className="space-y-2">
                <div className="h-3 w-16 bg-muted"></div>
                <div className="h-6 w-12 bg-muted"></div>
                <div className="h-2 w-full bg-muted"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Chart Skeleton */}
        <div className="border p-3 animate-pulse">
          <div className="space-y-3">
            <div className="h-3 w-24 bg-muted"></div>
            <div className="space-y-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-2 w-8 bg-muted"></div>
                  <div className="h-2 flex-1 bg-muted"></div>
                  <div className="h-2 w-4 bg-muted"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success-foreground";
    if (score >= 60) return "text-warning-foreground";
    return "text-destructive";
  };

  return (
    <div className="space-y-3">
      {/* Overview Stats - Classic Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {/* Participants */}
        <div className="border p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs  text-muted-foreground">PARTICIPANTS</span>
            <Users className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="text-xl  font-bold text-foreground">
            {analytics.overview.totalParticipants}
          </div>
          <div className="text-xs  text-muted-foreground mb-2">
            {analytics.overview.completedParticipants}/{analytics.overview.totalParticipants} done
          </div>
          <Progress value={analytics.overview.completionRate} className="h-1" />
        </div>

        {/* Average Score */}
        <div className="border p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs  text-muted-foreground">AVG SCORE</span>
            <Trophy className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className={`text-xl  font-bold ${getScoreColor(analytics.overview.averageScore)}`}>
            {analytics.overview.averageScore}%
          </div>
          <div className="text-xs  text-muted-foreground">
            median: {analytics.overview.medianScore}%
          </div>
        </div>

        {/* Score Range */}
        <div className="border p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs  text-muted-foreground">RANGE</span>
            <Target className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="flex items-center justify-between text-sm ">
            <div className="flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-destructive" />
              <span>{analytics.overview.lowestScore}%</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{analytics.overview.highestScore}%</span>
              <TrendingUp className="h-3 w-3 text-green-600" />
            </div>
          </div>
          <div className="w-full h-1 bg-gradient-to-r from-red-300 to-green-300 mt-2"></div>
        </div>

        {/* Average Time */}
        <div className="border p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs  text-muted-foreground">AVG TIME</span>
            <Clock className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="text-xl  font-bold text-foreground">
            {formatTime(analytics.overview.averageTimeSpent)}
          </div>
          <div className="text-xs  text-muted-foreground">
            per participant
          </div>
        </div>
      </div>

      {/* Score Distribution - Classic */}
      <div className="border p-3">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm  font-medium text-foreground">SCORE DISTRIBUTION</span>
          <span className="text-xs  text-muted-foreground ml-auto">
            {analytics.overview.totalParticipants} total
          </span>
        </div>
        
        <div className="space-y-2">
          {Object.entries(analytics.scoreDistribution).map(([range, count]) => {
            const percentage = analytics.overview.totalParticipants > 0 
              ? (count / analytics.overview.totalParticipants) * 100 
              : 0;
            
            // Simple color coding
            const getBarColor = (range: string) => {
              const numRange = parseInt(range.split('-')[0] || range.replace('+', ''));
              if (numRange >= 90) return 'bg-green-600';
              if (numRange >= 80) return 'bg-blue-600';
              if (numRange >= 70) return 'bg-yellow-600';
              if (numRange >= 60) return 'bg-orange-600';
              return 'bg-red-600';
            };

            return (
              <div key={range}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs  w-12 text-muted-foreground">
                      {range}%
                    </span>
                    <span className="text-xs  text-muted-foreground">
                      {count} participants
                    </span>
                  </div>
                  <span className="text-xs  font-medium text-foreground">
                    {Math.round(percentage)}%
                  </span>
                </div>
                
                <div className="h-2 bg-muted">
                  <div
                    className={`h-full ${getBarColor(range)} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {/* Hardest Questions - Classic */}
        <div className="border p-3">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm  font-medium text-foreground">CHALLENGING QUESTIONS</span>
            <span className="text-xs  text-muted-foreground ml-auto">
              top {analytics.hardestQuestions.length}
            </span>
          </div>
          
          <div className="space-y-2">
            {analytics.hardestQuestions.map((q, index) => (
              <div 
                key={q.questionId} 
                className="border-l-2 border-l-destructive pl-2 py-1 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => onQuestionClick?.(q.questionId)}
              >
                <div className="flex items-start gap-2">
                  <span className="text-xs  bg-muted px-1 text-center min-w-[16px]">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div 
                      className="text-xs  line-clamp-2 custom-prose"
                      style={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                      dangerouslySetInnerHTML={{ __html: q.question }}
                    />
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs  text-destructive">
                        {Math.round(q.successRate)}%
                      </span>
                      <span className="text-xs  text-muted-foreground">
                        {q.correctAttempts}/{q.totalAttempts}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Easiest Questions - Classic */}
        <div className="border p-3">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm  font-medium text-foreground">HIGH-PERFORMING QUESTIONS</span>
            <span className="text-xs  text-muted-foreground ml-auto">
              top {analytics.easiestQuestions.length}
            </span>
          </div>
          
          <div className="space-y-2">
            {analytics.easiestQuestions.map((q, index) => (
              <div 
                key={q.questionId} 
                className="border-l-2 border-l-green-600 pl-2 py-1 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => onQuestionClick?.(q.questionId)}
              >
                <div className="flex items-start gap-2">
                  <span className="text-xs  bg-muted px-1 text-center min-w-[16px]">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div 
                      className="text-xs  line-clamp-2 custom-prose"
                      style={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                      dangerouslySetInnerHTML={{ __html: q.question }}
                    />
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs  text-green-600">
                        {Math.round(q.successRate)}%
                      </span>
                      <span className="text-xs  text-muted-foreground">
                        {q.correctAttempts}/{q.totalAttempts}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Performance - Classic */}
      <div className="border p-3">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm  font-medium text-foreground">SECTION PERFORMANCE</span>
          <span className="text-xs  text-muted-foreground ml-auto">
            {analytics.sectionAnalysis.length} sections
          </span>
        </div>
        
        <div className="space-y-2">
          {analytics.sectionAnalysis.map((section, index) => (
            <div key={section.sectionId}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs  bg-muted px-1 text-center min-w-[16px]">
                    {index + 1}
                  </span>
                  <span className="text-xs  text-foreground truncate">
                    {section.sectionTitle}
                  </span>
                </div>
                <span className={`text-xs  font-medium ${
                  section.averageScore >= 80 ? 'text-green-600' :
                  section.averageScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {section.averageScore}%
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs  text-muted-foreground mb-1">
                <span>{section.questionsCount} questions</span>
                <span>{section.completedBy} completed</span>
              </div>
              
              <div className="h-1 bg-muted">
                <div
                  className={`h-full transition-all duration-500 ${
                    section.averageScore >= 80 ? 'bg-green-600' :
                    section.averageScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${section.averageScore}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}