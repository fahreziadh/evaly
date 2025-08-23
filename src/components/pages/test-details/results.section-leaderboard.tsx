import { useQuery } from "convex-helpers/react/cache";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import LoadingScreen from "@/components/shared/loading-screen";

interface Props {
  testId: Id<"test">;
}

export default function ResultsLeaderboard({ testId }: Props) {
  const results = useQuery(api.organizer.testResult.getResultsWithScores, {
    testId,
  });

  if (results === undefined) {
    return <LoadingScreen />;
  }

  if (!results || results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
        <p className="text-muted-foreground text-center">
          Results will appear here once participants complete the test.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-1">
        {results.map((result, index) => (
          <div
            key={result.participantId}
            className="flex items-center justify-between py-3"
          >
            <div className="flex items-center space-x-3">
              <span className="w-8 text-left text-sm font-medium">
                {index + 1}
              </span>

              <div className="size-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {result.participantImage ? (
                  <img 
                    src={result.participantImage} 
                    alt={result.participantName || 'Participant'} 
                    className="size-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-medium text-muted-foreground">
                    {result.participantName ? 
                      result.participantName.slice(0, 2).toUpperCase() : 
                      result.participantId.slice(-2).toUpperCase()
                    }
                  </span>
                )}
              </div>

              <p className="font-medium text-foreground">
                {result.participantName || `Participant ${result.participantId.slice(-6)}`}
              </p>
            </div>

              <p className="font-semibold text-foreground text-right">
                {result.percentage}%
              </p>
          </div>
        ))}
      </div>
    </div>
  );
}
