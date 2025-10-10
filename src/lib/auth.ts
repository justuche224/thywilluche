import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";
import db from "@/db";
import { sendVerificationEmail } from "@/mailer/handlers/auth/verification";
import { sendForgotPasswordEmail } from "@/mailer/handlers/auth/forgot-password";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
    // requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
        console.log("sendResetPassword", user, url, token, request);
        await sendForgotPasswordEmail(user.email, url);
      },
  },
  emailVerification: {
    enabled: true,
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
        console.log('sendVerificationEmail', user, url);
      await sendVerificationEmail(user.email, url);
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        default: "USER",
      },
    },
  },
  plugins: [
    username({
      minUsernameLength: 5,
      maxUsernameLength: 20,
      usernameValidator: (username) => {
        return username !== "admin";
      },
    }),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  rateLimit: {
    customRules: {
      "/forget-password": { window: 10, max: 3 },
      "/sign-up": {
        window: 10,
        max: 3,
      },
      "/sign-in": {
        window: 10,
        max: 5,
      },
    },
  },
  logger: {
    level: "debug",
    log(level, message, ...args) {
      console.log(level, message, ...args);
    },
  },
});
