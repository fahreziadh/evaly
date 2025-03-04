import LogIn from "@/components/shared/login";
import { Suspense } from "react";

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Suspense>
        <LogIn />
      </Suspense>
    </div>
  );
};

export default LoginPage;
