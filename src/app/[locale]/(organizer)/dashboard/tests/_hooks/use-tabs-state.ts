import { parseAsString, useQueryState } from "nuqs";

export function useTabsState(defaultValue: string) {
  return useQueryState(
    "tabs",
    parseAsString.withDefault(defaultValue).withOptions({
      scroll: false,
    })
  );
}
