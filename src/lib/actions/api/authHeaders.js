'use server';

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

export const getAuthHeaders = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });
        if (!session?.user) {
            return { "Content-Type": "application/json" };
        }
        
        const user = session.user;
        const secret = process.env.BETTER_AUTH_SECRET ;
        const token = jwt.sign(
            { id: user.id || user._id, email: user.email, role: user.role || "client" },
            secret,
            { expiresIn: "7d" }
        );
        return {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };
    } catch (err) {
        console.error("Failed to generate JWT auth headers:", err);
        return { "Content-Type": "application/json" };
    }
};
