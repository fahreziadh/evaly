/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "evaly-io",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    new sst.aws.TanStackStart("EvalyWeb", {
      warm: 1,
      regions: ["us-east-1", "ap-southeast-1"],
      domain: {
        name: $app.stage === "main" ? "evaly.io" : "staging.evaly.io",
        dns: sst.cloudflare.dns(),
        redirects: $app.stage === "main" ? ["www.evaly.io"] : undefined,
      },
    });
  },
});
