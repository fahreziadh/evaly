"use client";

import LoadingScreen from "@/components/shared/loading/loading-screen";
import { SidebarProvider } from "@/components/ui/sidebar";
import { api } from "convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import {
  redirect,
  useParams,
  usePathname,
  useSearchParams,
} from "next/navigation";
import React, { useEffect, useState } from "react";
const Provider = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useQuery(api.auth.isAuthenticated);
  const profile = useQuery(api.organizer.profile.getProfile);

  useEffect(() => {
    console.log(isAuthenticated);
  }, [isAuthenticated]);

  const createInitialOrganization = useMutation(
    api.organizer.profile.createInitialOrganization
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (profile && profile.selectedOrganizationId === undefined) {
      setIsLoading(true);
      createInitialOrganization().then(() => {
        setIsLoading(false);
      });
    }
  }, [profile, createInitialOrganization]);

  const pathName = usePathname();
  const searchParams = useSearchParams();
  const { locale } = useParams();

  if (isLoading) return <LoadingScreen />;

  if (isAuthenticated === undefined) return <LoadingScreen />;
  if (isAuthenticated === false)
    return redirect(
      `/${locale}/login?callbackUrl=${pathName}?${searchParams.toString()}`
    );

  return <SidebarProvider>{children}</SidebarProvider>;
};

export default Provider;
