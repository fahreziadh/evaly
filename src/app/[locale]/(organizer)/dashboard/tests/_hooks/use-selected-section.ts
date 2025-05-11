import { useQueryState } from "nuqs";

export function useSelectedSection() {
  return useQueryState("selected-section");
}
