import { $api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useTestInvitationByTestId(testId: string) {
  return useQuery({
    queryKey: ["test-invitation-by-test-id", testId],
    queryFn: () => {
      return $api.organization.test({ id: testId }).invitation.get();
    },
  });
}
