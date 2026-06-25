import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db(process.env.DB_CU);

export const auth = betterAuth({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || process.env.CLIENT_URI,
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "client",
            },
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SEC,
        }
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    return {
                        data: {
                            ...user,
                            role: user.role || "client",
                        },
                    };
                },
            },
        },
    },
    database: mongodbAdapter(db, {
        client
    }),
});