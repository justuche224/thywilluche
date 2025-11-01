import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";
import db from "@/db";
import { sendVerificationEmail } from "@/mailer/handlers/auth/verification";
import { sendForgotPasswordEmail } from "@/mailer/handlers/auth/forgot-password";
import { sendWelcomeEmail } from "@/mailer/handlers/auth/welcome";
import { notifyAdminNewSignup } from "@/mailer/handlers/auth/new-signup";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
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
      console.log("sendVerificationEmail", user, url);
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
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            if (!user?.email) return;
            await sendWelcomeEmail(user.email, user.name);
          } catch (err) {
            console.error("Failed to send welcome email:", err);
          }

          try {
            await notifyAdminNewSignup(
              user.email,
              user.name,
              (user.username as string) || null,
              user.id,
              user.createdAt
            );
          } catch (err) {
            console.error("Failed to send admin notification:", err);
          }
        },
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
