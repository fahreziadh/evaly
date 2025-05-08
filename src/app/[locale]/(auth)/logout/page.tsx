"use client";
import { authClient } from "@/lib/auth.client";
import { useEffect } from "react";
import LoadingScreen from "@/components/shared/loading/loading-screen";

const Page = () => {

  useEffect(() => {
    authClient.signOut().then(() => {
      window.location.href = "/";
    }).catch((error) => {
      console.error(error);
    })
  }, []);

    return <LoadingScreen />;
};

export default Page;
