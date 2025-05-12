"use client";

import { useEffect } from "react";
import LoadingScreen from "@/components/shared/loading/loading-screen";
import { useAuthActions } from "@convex-dev/auth/react";

const PageClient = () => {
  const { signOut } = useAuthActions();
  useEffect(() => {
    signOut()
      .then(() => {
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return <LoadingScreen />;
};

export default PageClient;
