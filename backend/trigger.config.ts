import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "proj_sxyflggmymvdezjiyzmr",
  runtime: "node",
  logLevel: "log",
  maxDuration: 360,
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  dirs: ["trigger"],
});