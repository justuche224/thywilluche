import {createAuthClient} from "better-auth/react"
import { usernameClient,inferAdditionalFields } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_AUTH_URL,
    plugins: [
        usernameClient(),
        inferAdditionalFields({
            user: {
                role: {
                    type: "string",
                    enum: ["ADMIN", "USER"],
                    defaultValue: "USER"
                }
            },
        }),
    ]
})