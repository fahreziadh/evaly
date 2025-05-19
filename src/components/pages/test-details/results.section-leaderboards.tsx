import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

const SectionLeaderBoards = ({ className }: { className?: string }) => {
    const parentRef = useRef(null);
  
    // The virtualizer
    const rowVirtualizer = useVirtualizer({
      count: 30000,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 32,
      overscan: 20,
    });
  
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <CardTitle>Leaderboards</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div ref={parentRef} className="h-[200px] overflow-auto rounded-md">
            <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
              <div className="flex flex-row items-center">
                <span className="w-8"></span>
                <span className="flex-1 text-sm text-muted-foreground">Name</span>
                <span className="text-sm text-muted-foreground">Pts</span>
              </div>
              {rowVirtualizer.getVirtualItems().map((virtualItem, i) => (
                <div
                  key={virtualItem.key}
                  style={{
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start - i * virtualItem.size}px)`,
                  }}
                  className="flex flex-row items-center"
                >
                  <span className="w-8">{virtualItem.index + 1}.</span>
                  <Avatar className="size-6">
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <span className="flex-1 ml-2">Fahrezi Adha</span>
                  <span>{93}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
};

export default SectionLeaderBoards