import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "./db";
import * as schema from "./db/schema";
 
export const auth = betterAuth({
    database: drizzleAdapter(db,{
        provider: "sqlite",
        schema: schema
    }),
    emailAndPassword:{ 
        enabled: true,
    },
    advanced:{
        cookiePrefix: "evaly",
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            enabled: true,
        },
    }
})