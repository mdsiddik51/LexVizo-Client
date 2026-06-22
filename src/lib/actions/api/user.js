"use server";

import { revalidatePath } from "next/cache"; // <-- Imported revalidation tool

const BaseUrl = process.env.NEXT_URI;

export const updateUserNameAction = async (userId, newName) => {
    try {
        if (!userId) {
            throw new Error("User identification ID is required.");
        }

        const response = await fetch(`${BaseUrl}/api/user/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json" // Standard JSON header
            },
            body: JSON.stringify({ fullName: newName }) // Passing name string directly
        });

        if (!response.ok) {
            throw new Error(`Name update failed with status code: ${response.status}`);
        }

        const result = await response.json();

        // If the backend database mutation succeeds, clear the client-side router cache
        if (result.success) {
            revalidatePath("/dashboard/client"); // <-- Purges the cache for your client page
            return result.data;
        }

        return result;

    } catch (error) {
        console.error("Error in updateUserNameAction:", error);
        return null;
    }
};