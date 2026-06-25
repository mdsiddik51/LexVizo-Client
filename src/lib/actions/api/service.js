'use server'
import { revalidatePath } from "next/cache";
import { getAuthHeaders } from "./authHeaders";

const BaseUrl = process.env.NEXT_PUBLIC_API_URL ;
// 1. INSERT SERVICE ACTION
export const insertServiceData = async (serviceFields) => {
    try {
        const response = await fetch(`${BaseUrl}/api/service`, {
            method: "POST",
            headers: await getAuthHeaders(),
            body: JSON.stringify(serviceFields),
        });

        if (!response.ok) {
            throw new Error(`HTTP error status received: ${response.status}`);
        }

        const data = await response.json();

        // If the document creation is acknowledged or contains an insertedId, refresh cache
        if (data?.acknowledged || data?.insertedId) {
            revalidatePath('/dashboard/lawyer');
        }

        return data;
    } catch (error) {
        console.error("Action error:", error);
        throw error;
    }
}

// 2. UPDATE SERVICE ACTION
export const updateServiceData = async (serviceId, updatedFields) => {
    try {
        const response = await fetch(`${BaseUrl}/api/service/${serviceId}`, {
            method: "PUT",
            headers: await getAuthHeaders(),
            body: JSON.stringify(updatedFields),
        });

        if (!response.ok) {
            throw new Error(`HTTP error status received: ${response.status}`);
        }

        const data = await response.json();

        const modifiedCount = data?.result?.modifiedCount ?? data?.modifiedCount ?? 0;
        const acknowledged = data?.result?.acknowledged ?? data?.acknowledged ?? false;

        // Trigger cache revalidation if document fields were modified or confirmed
        if (modifiedCount > 0 || acknowledged) {
            revalidatePath('/dashboard/lawyer');
        }

        return data;
    } catch (error) {
        console.error("Action error:", error);
        throw error;
    }
}

// 3. DELETE SERVICE ACTION
export const deleteServiceData = async (serviceId) => {
    try {
        const response = await fetch(`${BaseUrl}/api/service/${serviceId}`, {
            method: "DELETE",
            headers: await getAuthHeaders(),
            body: JSON.stringify({ serviceId }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error status received: ${response.status}`);
        }

        const data = await response.json();

        const deletedCount = data?.result?.deletedCount ?? data?.deletedCount ?? 0;
        const acknowledged = data?.result?.acknowledged ?? data?.acknowledged ?? false;

        // Trigger cache revalidation upon a successful deletion setup match
        if (deletedCount > 0 || acknowledged) {
            revalidatePath('/dashboard/lawyer');
        }

        return data;
    } catch (error) {
        console.error("Action error:", error);
        throw error;
    }
}

export const fetchServiceData = async (userId) => {
    try {
        if (!userId) throw new Error("Missing targeted user query context.");

        const response = await fetch(`${BaseUrl}/api/service?userId=${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error status received: ${response.status}`);
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Action error:", error);
        throw error;
    }
}