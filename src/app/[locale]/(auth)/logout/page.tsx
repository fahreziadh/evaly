"use client";
import { authClient } from "@/lib/auth.client";
import { useEffect, useTransition } from "react";
import { useProgressRouter } from "@/components/shared/progress-bar";
import LoadingScreen from "@/components/shared/loading/loading-screen";

const Page = () => {
  const router = useProgressRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      await authClient.signOut();
      window.location.href = "/";
    });
  }, [router]);

  if (isPending) return <LoadingScreen />;
  
  return null;
};

export default Page;
