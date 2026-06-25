'use server';
import { revalidatePath } from "next/cache";
import { getAuthHeaders } from "./authHeaders";

const BaseUrl = process.env.NEXT_PUBLIC_API_URL;

export const ProfileImage = async ({ userId, imageUrl }) => {
    if (!userId || !imageUrl) {
        throw new Error("Missing required fields: userId and imageUrl are required.");
    }

    try {
        const response = await fetch(`${BaseUrl}/api/images`, {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify({ userId, imageUrl })
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();
        revalidatePath('/');
        return data;
    } catch (error) {
        console.error("Error inside ProfileImage server action:", error);
        throw error; 
    }
};

export const GetUserImage = async (userId) => {
    try {
        const response = await fetch(`${BaseUrl}/api/images/${userId}`, {
            method: 'GET',
            cache: 'no-store'
        });

        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Error fetching user image:", error);
        return null;
    }
};

export const UpdateProfileImage = async ({ userId, imageUrl }) => {
    try {
        const response = await fetch(`${BaseUrl}/api/images/${userId}`, {
            method: 'PATCH',
            headers: await getAuthHeaders(),
            body: JSON.stringify({ imageUrl })
        });

        if (!response.ok) {
            throw new Error(`Update failed with status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating profile image:", error);
        throw error;
    }
};