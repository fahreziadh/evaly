import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import betterAuthView from "./lib/auth/auth-view";
import { organizationRouter } from "./router/organization/organization.router";
import { swagger } from "@elysiajs/swagger";
import { participantRouter } from "./router/participant/participant.router";
import { opentelemetry } from "./lib/opentelemetery";

const app = new Elysia()
  .use(cors())
  .use(swagger())
  .use(opentelemetry())
  // .get("/", async function*() {
  //   const task = await tasks.trigger("hello-world", {},{})
  //   for await (const run of runs.subscribeToRun(task.id, {stopOnCompletion: true})){
  //     yield run
  //     yield "\n\n"
  //   }
  // })
  .all("/api/auth/*", betterAuthView) // Handle auth routes
  .use(organizationRouter)
  .use(participantRouter)
  .listen({
    port: 4000,
    idleTimeout: 30,
  });

export type App = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
