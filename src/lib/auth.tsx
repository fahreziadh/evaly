import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { account, session, user, verification } from "@/lib/db/schema";
import db from "@/lib/db";
import { env } from "@/lib/env";
import { emailOTP } from "better-auth/plugins";
import EmailLoginOTPEmail from "@/lib/emails/email-login-otp";
import { render } from "@react-email/components";
import { sendEmail } from "./email";

export const auth = betterAuth({
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  secret: env.BETTER_AUTH_SECRET!,
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        const emailHtml = await render(<EmailLoginOTPEmail otp={otp} />);
        await sendEmail({
          from: {
            name: "Evaly",
            address: "noreply@evaly.io",
          },
          to: email,
          subject: `Your OTP for Evaly is ${otp}`,
          html: emailHtml,
        });
      },
    }),
  ],
  database: drizzleAdapter(db, {
    // We're using Drizzle as our database
    provider: "pg",
    /*
     * Map your schema into a better-auth schema
     */
    schema: {
      user,
      session,
      verification,
      account,
    },
  }),
  emailAndPassword: {
    enabled: true, // If you want to use email and password auth
  },
  socialProviders: {
    /*
     * We're using Google and Github as our social provider,
     * make sure you have set your environment variables
     */
    google: {
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
