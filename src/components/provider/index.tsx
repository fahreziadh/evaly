"use client";

import React, { useEffect } from "react";
import TanstackQueryProvider from "./tanstack-query.provider";
import NuqsProvider from "./nuqs.provider";
import { ProgressBar } from "../shared/progress-bar";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import posthog from "posthog-js";
import { env } from "@/lib/env.client";
import SuspendedPostHogPageView from "./posthog-page-view";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const Provider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      capture_pageleave: true,
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      <TanstackQueryProvider>
        <NuqsProvider>
          <ProgressBar>
            <SuspendedPostHogPageView />
            <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>
          </ProgressBar>
        </NuqsProvider>
      </TanstackQueryProvider>
    </PHProvider>
  );
};

export default Provider;
