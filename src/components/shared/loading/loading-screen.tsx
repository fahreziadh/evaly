import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="size-12 animate-spin duration-1000" />
    </div>
  );
};

export default LoadingScreen;
