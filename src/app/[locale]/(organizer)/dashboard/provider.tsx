"use client";

import LoadingScreen from "@/components/shared/loading/loading-screen";
import { SidebarProvider } from "@/components/ui/sidebar";
import { usePathname } from "@/i18n/navigation";
import { api } from "convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { redirect, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useQuery(api.auth.isAuthenticated);
  const profile = useQuery(api.organizer.profile.getProfile);
  const createInitialOrganization = useMutation(api.organizer.profile.createInitialOrganization);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && profile && profile.selectedOrganizationId === undefined) {
      setIsLoading(true);
      createInitialOrganization().then(() => {
        setIsLoading(false);
      });
    }
  }, [isAuthenticated, profile, createInitialOrganization]);

  const pathName = usePathname();
  const { locale } = useParams();

  if (isAuthenticated === undefined) return <LoadingScreen />;
  if (profile === undefined) return <LoadingScreen />;
  if (isLoading) return <LoadingScreen />;

  if (isAuthenticated === false) {
    return redirect(
      `/${locale}/login?callbackURL=${encodeURIComponent(`${pathName}`)}`
    );
  }

  return <SidebarProvider>{children}</SidebarProvider>;
};

export default Provider;
