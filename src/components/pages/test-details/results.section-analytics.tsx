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
  CheckCircle
} from "lucide-react";

interface TestAnalyticsProps {
  testId: Id<"test">;
}

export function TestAnalytics({ testId }: TestAnalyticsProps) {
  const analytics = useQuery(api.organizer.testResult.getComprehensiveAnalytics, {
    testId,
  });

  if (!analytics) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-20 bg-muted rounded"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-muted rounded"></div>
          ))}
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
    <div className="space-y-4">
      {/* Overview Stats - Compact Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="border rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground">Participants</span>
            <Users className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="text-xl font-bold">{analytics.overview.totalParticipants}</div>
          <div className="text-xs text-muted-foreground mb-2">
            {analytics.overview.completedParticipants} completed
          </div>
          <Progress value={analytics.overview.completionRate} className="h-1" />
        </div>

        <div className="border rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground">Average</span>
            <Trophy className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className={`text-xl font-bold ${getScoreColor(analytics.overview.averageScore)}`}>
            {analytics.overview.averageScore}%
          </div>
          <div className="text-xs text-muted-foreground">
            Median: {analytics.overview.medianScore}%
          </div>
        </div>

        <div className="border rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground">Range</span>
            <Target className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <TrendingDown className="h-3 w-3 text-destructive mr-1" />
              <span className="text-sm font-medium">{analytics.overview.lowestScore}%</span>
            </div>
            <span className="text-xs text-muted-foreground">-</span>
            <div className="flex items-center">
              <TrendingUp className="h-3 w-3 text-success-foreground mr-1" />
              <span className="text-sm font-medium">{analytics.overview.highestScore}%</span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground">Avg. Time</span>
            <Clock className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="text-xl font-bold">
            {formatTime(analytics.overview.averageTimeSpent)}
          </div>
          <div className="text-xs text-muted-foreground">
            Per participant
          </div>
        </div>
      </div>

      {/* Score Distribution - Compact */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="h-4 w-4" />
          <span className="text-sm font-medium">Score Distribution</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {Object.entries(analytics.scoreDistribution).map(([range, count]) => (
            <div key={range} className="flex items-center gap-2">
              <div className="w-12 text-sm font-medium">{range}%</div>
              <div className="flex-1 h-4 bg-muted rounded overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{
                    width: `${analytics.overview.totalParticipants > 0 
                      ? (count / analytics.overview.totalParticipants) * 100 
                      : 0}%`
                  }}
                />
              </div>
              <div className="w-8 text-sm text-muted-foreground text-right">
                {count}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hardest Questions - Compact */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium">Hardest Questions</span>
          </div>
          <div className="space-y-2">
            {analytics.hardestQuestions.map((q, index) => (
              <div key={q.questionId} className="flex items-start gap-2 p-2 rounded border-l-2 border-l-destructive/30 bg-destructive/10">
                <span className="text-xs font-mono bg-destructive/20 text-destructive-foreground px-1.5 py-0.5 rounded text-center min-w-[20px]">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div 
                    className="text-sm line-clamp-1 mb-1"
                    dangerouslySetInnerHTML={{ __html: q.question }}
                  />
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-destructive font-medium">
                      {Math.round(q.successRate)}%
                    </span>
                    <span className="text-muted-foreground">
                      {q.correctAttempts}/{q.totalAttempts}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Easiest Questions - Compact */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-4 w-4 text-success-foreground" />
            <span className="text-sm font-medium">Easiest Questions</span>
          </div>
          <div className="space-y-2">
            {analytics.easiestQuestions.map((q, index) => (
              <div key={q.questionId} className="flex items-start gap-2 p-2 rounded border-l-2 border-l-success-foreground/30 bg-success">
                <span className="text-xs font-mono bg-success-foreground/20 text-success-foreground px-1.5 py-0.5 rounded text-center min-w-[20px]">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div 
                    className="text-sm line-clamp-1 mb-1"
                    dangerouslySetInnerHTML={{ __html: q.question }}
                  />
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-success-foreground font-medium">
                      {Math.round(q.successRate)}%
                    </span>
                    <span className="text-muted-foreground">
                      {q.correctAttempts}/{q.totalAttempts}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Analysis - Compact */}
      <div className="border rounded-lg p-4">
        <h3 className="text-sm font-medium mb-3">Section Performance</h3>
        <div className="space-y-3">
          {analytics.sectionAnalysis.map((section) => (
            <div key={section.sectionId} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium truncate">{section.sectionTitle}</span>
                  <span className={`text-sm font-medium ${getScoreColor(section.averageScore)}`}>
                    {section.averageScore}%
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-1">
                  <span>{section.questionsCount} questions</span>
                  <span>•</span>
                  <span>{section.completedBy} completed</span>
                </div>
                <Progress value={section.averageScore} className="h-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}