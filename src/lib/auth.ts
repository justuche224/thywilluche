import {betterAuth} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins"
import db from "@/db";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                default: "USER",
            },
        },
    },    plugins: [
        username({
            minUsernameLength: 5,
            maxUsernameLength: 20,
            usernameValidator: (username) => {
                return username !== "admin";

            }
        })
    ]
});