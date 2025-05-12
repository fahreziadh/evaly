// convex/convex.config.ts
import { defineApp } from "convex/server";
import aggregate from "@convex-dev/aggregate/convex.config";
import r2 from "@convex-dev/r2/convex.config";

const app = defineApp();
app.use(aggregate);
app.use(r2);

export default app;