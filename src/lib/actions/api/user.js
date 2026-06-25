"use server";
import { revalidatePath } from "next/cache";
import { getAuthHeaders } from "./authHeaders";

const BaseUrl = process.env.NEXT_PUBLIC_API_URL;

export const updateUserNameAction = async (userId, newName) => {
    try {
        if (!userId) {
            throw new Error("User identification ID is required.");
        }

        const response = await fetch(`${BaseUrl}/api/user/${userId}`, {
            method: "PUT",
            headers: await getAuthHeaders(),
            body: JSON.stringify({ fullName: newName })
        });

        if (!response.ok) {
            throw new Error(`Name update failed with status code: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            revalidatePath("/dashboard/client");
            return result.data;
        }

        return result;
    } catch (error) {
        console.error("Error in updateUserNameAction:", error);
        return null;
    }
};