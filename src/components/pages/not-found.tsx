import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";

export function NotFound({ children }: { children?: any }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-lg">
        {children || <p>The page you are looking for does not exist.</p>}
      </div>
      <div className="flex items-center gap-2 flex-wrap mt-4">
        <Button variant={"outline-solid"} onClick={() => window.history.back()}>Go back</Button>
        <Link to="/">
          <Button>Start Over</Button>
        </Link>
      </div>
    </div>
  );
}
