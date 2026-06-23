import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    baseURL: process.env.CLIENT_URI,
});

export const { signIn, signUp, signOut, useSession } = authClient;