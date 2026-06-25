'use server'
import { revalidatePath } from "next/cache";
import { getAuthHeaders } from "./authHeaders";

const BaseUrl = process.env.NEXT_PUBLIC_API_URL ;
export const GetLawyerData = async (userid) => {
    const response = await fetch(`${BaseUrl}/api/lawyer/${userid}`);
    const data = await response.json();
    return data;
};

export const updateLawyerData = async (userId, updatedFields) => {
    try {
        const response = await fetch(`${BaseUrl}/api/lawyer/${userId}`, {
            method: "PATCH",
            headers: await getAuthHeaders(),
            body: JSON.stringify(updatedFields),
        });

        if (!response.ok) {
            throw new Error(`HTTP error status received: ${response.status}`);
        }

        const data = await response.json();

        // Extract modifiedCount safely whether it's wrapped in data.result or sent raw
        const modifiedCount = data?.result?.modifiedCount ?? data?.modifiedCount ?? 0;
        const acknowledged = data?.result?.acknowledged ?? data?.acknowledged ?? false;

        // Trigger cache revalidation if document fields were updated or confirmed
        if (modifiedCount > 0 || acknowledged) {
            revalidatePath('/dashboard/lawyer');
        }

        return data;
    } catch (error) {
        console.error("Action error:", error);
        throw error;
    }
}