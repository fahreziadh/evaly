// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { cn } from "@/lib/utils";
// import { api } from "@convex/_generated/api";
// import { useQuery } from "convex/react";
// import { useVirtualizer } from "@tanstack/react-virtual";
// import { useRef } from "react";
// import type { Id } from "@convex/_generated/dataModel";
// import { useSearch } from "@tanstack/react-router";
// import { Badge } from "@/components/ui/badge";
// const SectionLeaderBoards = ({ className }: { className?: string }) => {
//   const parentRef = useRef(null);
//   const { testId } = useSearch({ from: "/(organizer)/app/tests/details" });
//   const results = useQuery(api.organizer.testResult.getProgress, {
//     testId: testId as Id<"test">,
//   });

//   // The virtualizer
//   const rowVirtualizer = useVirtualizer({
//     count: results?.leaderboard.length || 0,
//     getScrollElement: () => parentRef.current,
//     estimateSize: () => 32,
//     overscan: 20,
//   });

//   return (
//     <Card className={cn(className)}>
//       <CardHeader>
//         <CardTitle>Leaderboards</CardTitle>
//       </CardHeader>
//       <CardContent className="pt-0">
//         <div
//           ref={parentRef}
//           className="min-h-[100px] max-h-[100px] overflow-auto rounded-md"
//         >
//           <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
//             {!rowVirtualizer.getVirtualItems().length ? (
//               <div className="bg-secondary px-4 py-2 rounded-md text-foreground/60">
//                 No participant progress yet.
//               </div>
//             ) : null}
//             {rowVirtualizer.getVirtualItems().map((virtualItem, i) => {
//               const participant = results?.leaderboard[virtualItem.index];
//               const name = participant?.participant?.name || "Unknown";
//               return (
//                 <div
//                   key={virtualItem.key}
//                   style={{
//                     height: `${virtualItem.size}px`,
//                     transform: `translateY(${virtualItem.start - i * virtualItem.size}px)`,
//                   }}
//                   className="flex flex-row items-center bg-secondary px-2 rounded-md"
//                 >
//                   <Badge className="w-6" variant={"outline"}>
//                     {virtualItem.index + 1}
//                   </Badge>
//                   <span className="flex-1 ml-2">{name}</span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default SectionLeaderBoards;
