import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import betterAuthView from "./lib/auth/auth-view";
import { organizationRouter } from "./router/organization/organization.router";
import { swagger } from "@elysiajs/swagger";
import { participantRouter } from "./router/participant/participant.router";

const app = new Elysia()
  .use(cors())
  .use(swagger())
  .get("/", async () => {
    return "Hello World";
  })
  .all("/api/auth/*", betterAuthView) // Handle auth routes
  .use(organizationRouter)
  .use(participantRouter)
  .listen({
    port: 4000,
  });


export type App = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
