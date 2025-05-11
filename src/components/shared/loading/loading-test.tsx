import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingTest = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex flex-col gap-4 min-h-dvh", className)}>
      {Array.from({ length: 10 }).map((_, e) => (
          <Skeleton className="w-full h-24" key={e} />
      ))}
    </div>
  );
};

export default LoadingTest;
