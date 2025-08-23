import { useQuery } from "convex-helpers/react/cache";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Medal, 
  Award, 
  Download,
  Users,
  Target
} from "lucide-react";
import { useState } from "react";
import LoadingScreen from "@/components/shared/loading-screen";
import { useMutation } from "convex/react";

interface Props {
  testId: Id<"test">;
}

export default function ResultsLeaderboard({ testId }: Props) {
  const results = useQuery(api.organizer.testResult.getResultsWithScores, {
    testId,
  });
  
  const calculateScore = useMutation(api.organizer.testResult.calculateAndStoreScore);
  const [calculatingScores, setCalculatingScores] = useState(false);

  const handleCalculateAllScores = async () => {
    if (!results) return;
    
    setCalculatingScores(true);
    try {
      // Calculate scores for all completed attempts
      const completedAttempts = results
        .filter(r => r.isCompleted)
        .flatMap(r => r.attempts.filter(a => a.finishedAt));
      
      for (const attempt of completedAttempts) {
        await calculateScore({ testAttemptId: attempt._id });
      }
      
      // Results will automatically refresh due to Convex reactivity
    } catch (error) {
      console.error("Failed to calculate scores:", error);
      alert("Failed to calculate scores. Please try again.");
    } finally {
      setCalculatingScores(false);
    }
  };

  const handleExportResults = () => {
    if (!results) return;
    
    // Create CSV content
    const headers = ["Rank", "Participant", "Score", "Max Score", "Percentage", "Grade", "Completed At", "Status"];
    const rows = results.map((result, index) => [
      index + 1,
      `Participant ${result.participantId.slice(-6)}`, // Use last 6 chars of ID as identifier
      result.totalScore,
      result.maxPossibleScore,
      `${result.percentage}%`,
      getLetterGrade(result.percentage),
      result.completedAt ? new Date(result.completedAt).toLocaleString() : "Not completed",
      result.isCompleted ? "Completed" : "In Progress"
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");
    
    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `test-results-${testId}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getLetterGrade = (percentage: number): string => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "text-green-600 bg-green-50 border-green-200";
      case "B": return "text-blue-600 bg-blue-50 border-blue-200";
      case "C": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "D": return "text-orange-600 bg-orange-50 border-orange-200";
      case "F": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="h-5 w-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  if (results === undefined) {
    return <LoadingScreen />;
  }

  if (!results || results.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
          <p className="text-muted-foreground text-center">
            Results will appear here once participants complete the test.
          </p>
        </CardContent>
      </Card>
    );
  }

  const completedCount = results.filter(r => r.isCompleted).length;
  const averageScore = results.length > 0 
    ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
    : 0;
  const highestScore = Math.max(...results.map(r => r.percentage));

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{results.length}</p>
                <p className="text-sm text-muted-foreground">Total Participants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{completedCount}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{averageScore}%</p>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{highestScore}%</p>
                <p className="text-sm text-muted-foreground">Highest Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button 
          onClick={handleCalculateAllScores}
          disabled={calculatingScores}
          variant="outline"
        >
          <Target className="mr-2 h-4 w-4" />
          {calculatingScores ? "Calculating..." : "Recalculate All Scores"}
        </Button>
        
        <Button onClick={handleExportResults} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Participant Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div 
                key={result.participantId}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10">
                    {getRankIcon(index + 1)}
                  </div>
                  
                  <div>
                    <p className="font-medium">
                      Participant {result.participantId.slice(-6)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {result.isCompleted 
                        ? `Completed on ${new Date(result.completedAt || 0).toLocaleDateString()}`
                        : `${result.completedSectionsCount || 0}/${result.attempts.length} sections completed`
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      {result.totalScore}/{result.maxPossibleScore}
                    </p>
                    <Progress value={result.percentage} className="w-20 h-2" />
                  </div>
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold">{result.percentage}%</p>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(getLetterGrade(result.percentage))}`}>
                      {getLetterGrade(result.percentage)}
                    </div>
                  </div>
                  
                  <Badge variant={result.isCompleted ? "success" : "secondary"}>
                    {result.isCompleted ? "Completed" : "In Progress"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}