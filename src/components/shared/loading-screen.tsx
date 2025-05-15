import { TextShimmer } from "../ui/text-shimmer";

const LoadingScreen = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-background">
      <TextShimmer className="text-2xl font-medium">
        Loading...
      </TextShimmer>
    </div>
  );
};

export default LoadingScreen;
