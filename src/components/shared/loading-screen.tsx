import { Loader2Icon } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Loader2Icon className="size-10 animate-spin" />
    </div>
  );
};

export default LoadingScreen;
