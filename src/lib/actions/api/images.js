'use server';
import { revalidatePath } from "next/cache";

const BaseUrl = process.env.NEXT_URI;

// Accept an object destructuring { userId, imageUrl }
export const ProfileImage = async ({ userId, imageUrl }) => {
    try {
        const response = await fetch(`${BaseUrl}/api/images`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Stringify the object properly
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