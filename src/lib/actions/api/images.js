'use server';
import { revalidatePath } from "next/cache";

const BaseUrl = process.env.NEXT_URI;

export const ProfileImage = async ({ userId, imageUrl }) => {
    // 1. Quick defensive check for missing arguments
    if (!userId || !imageUrl) {
        throw new Error("Missing required fields: userId and imageUrl are required.");
    }

    try {
        const response = await fetch(`${BaseUrl}/api/images`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, imageUrl })
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();
        
        // 2. Next.js cache revalidation
        revalidatePath('/');
        
        return data;
    } catch (error) {
        // Logging the error for server-side debugging
        console.error("Error inside ProfileImage server action:", error);
        
        // Re-throwing so the calling client component can catch it and show a UI toast/error message
        throw error; 
    }
};

export const GetUserImage = async (userId) => {
    try {
        const response = await fetch(`${BaseUrl}/api/images/${userId}`, {
            method: 'GET',
            // Cache is set to no-store to ensure we always get the latest update
            cache: 'no-store'
        });

        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Error fetching user image:", error);
        return null;
    }
};

// 2. UPDATE: Update existing image by userId
export const UpdateProfileImage = async ({ userId, imageUrl }) => {
    try {
        const response = await fetch(`${BaseUrl}/api/images/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
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