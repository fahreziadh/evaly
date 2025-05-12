// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "evaly",
      removal: input?.stage === "main" ? "retain" : "remove",
      protect: ["main"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    new sst.aws.Nextjs("MainWebsite", {
      warm: 1,
      regions: ["us-east-1", "ap-southeast-1"],
      domain: {
        name: $app.stage === "main" ? "evaly.io" : "staging.evaly.io",
        dns: sst.cloudflare.dns(),
        redirects: $app.stage === "main" ? ["www.evaly.io"] : undefined,
      },
      environment: {
        DATABASE_URL: new sst.Secret("DATABASE_URL").value,
        SMTP_HOST: new sst.Secret("SMTP_HOST").value,
        SMTP_PORT: new sst.Secret("SMTP_PORT").value,
        SMTP_USER: new sst.Secret("SMTP_USER").value,
        SMTP_PASSWORD: new sst.Secret("SMTP_PASSWORD").value,
        BETTER_AUTH_URL: new sst.Secret("BETTER_AUTH_URL").value,
        BETTER_AUTH_SECRET: new sst.Secret("BETTER_AUTH_SECRET").value,
        GOOGLE_CLIENT_ID: new sst.Secret("GOOGLE_CLIENT_ID").value,
        GOOGLE_CLIENT_SECRET: new sst.Secret("GOOGLE_CLIENT_SECRET").value,
        CLOUDFLARE_ACCOUNT_ID: new sst.Secret("CLOUDFLARE_ACCOUNT_ID").value,
        CLOUDFLARE_ACCESS_KEY_ID: new sst.Secret("CLOUDFLARE_ACCESS_KEY_ID")
          .value,
        CLOUDFLARE_SECRET_ACCESS_KEY: new sst.Secret(
          "CLOUDFLARE_SECRET_ACCESS_KEY"
        ).value,
        NEXT_PUBLIC_CLOUDFLARE_CDN_URL: new sst.Secret("NEXT_PUBLIC_CLOUDFLARE_CDN_URL").value,
        CLOUDFLARE_BUCKET_NAME: new sst.Secret("CLOUDFLARE_BUCKET_NAME").value,
        EVALY_AWS_ACCESS_KEY_ID: new sst.Secret("EVALY_AWS_ACCESS_KEY_ID")
          .value,
        EVALY_AWS_SECRET_ACCESS_KEY: new sst.Secret(
          "EVALY_AWS_SECRET_ACCESS_KEY"
        ).value,
        OPENAI_API_KEY: new sst.Secret("OPENAI_API_KEY").value,
        GOOGLE_GENERATIVE_AI_API_KEY: new sst.Secret(
          "GOOGLE_GENERATIVE_AI_API_KEY"
        ).value,
        NEXT_PUBLIC_URL: new sst.Secret("NEXT_PUBLIC_URL").value,
        NEXT_PUBLIC_POSTHOG_KEY: new sst.Secret("NEXT_PUBLIC_POSTHOG_KEY")
          .value,
        NEXT_PUBLIC_POSTHOG_HOST: new sst.Secret("NEXT_PUBLIC_POSTHOG_HOST")
          .value,
        NEXT_PUBLIC_SUPABASE_URL: new sst.Secret("NEXT_PUBLIC_SUPABASE_URL")
          .value,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: new sst.Secret(
          "NEXT_PUBLIC_SUPABASE_ANON_KEY"
        ).value,
      },
    });
  },
});
