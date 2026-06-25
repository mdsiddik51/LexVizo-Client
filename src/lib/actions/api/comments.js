'use server';
import { revalidatePath } from "next/cache";
import { getAuthHeaders } from "./authHeaders";

const BaseUrl = process.env.NEXT_PUBLIC_API_URL ;

export const postCommentAction = async ({ author, role, rating, text, lawyerId, userId }) => {
    try {
        const response = await fetch(`${BaseUrl}/api/comments`, {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify({
                author,
                role,
                rating: Number(rating),
                text,
                lawyerId,
                userId
            })
        });

        const data = await response.json();

        revalidatePath(`/lawyer/${lawyerId}`);
        revalidatePath('/');
        return data;
    } catch (error) {
        console.error("Error inside postCommentAction server action:", error);
        throw error;
    }
};

export const fetchCommentsAction = async (lawyerId) => {
    try {
        const response = await fetch(`${BaseUrl}/api/comments/${lawyerId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const serverMessage = errorData.message || errorData.error || "Unknown Server Error";
            throw new Error(`Server Error (${response.status}): ${serverMessage}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Fetch failure in action layer:", error.message);
        throw error;
    }
};

export const getUserCommentsAction = async (userId) => {
    try {
        if (!userId) throw new Error("User ID is required.");

        const response = await fetch(`${BaseUrl}/api/comments/user/${userId}`, {
            method: 'GET',
            headers: await getAuthHeaders(),
            next: { revalidate: 0 }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user comments: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error inside getUserCommentsAction server action:", error);
        throw error;
    }
};

export const updateCommentAction = async (commentId, { text, rating }) => {
    try {
        if (!commentId) throw new Error("Comment ID is required.");

        const response = await fetch(`${BaseUrl}/api/comments/${commentId}`, {
            method: 'PATCH',
            headers: await getAuthHeaders(),
            body: JSON.stringify({
                text,
                rating: Number(rating)
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to update comment: ${response.statusText}`);
        }

        const data = await response.json();
        revalidatePath('/dashboard/client');
        return data;
    } catch (error) {
        console.error("Error inside updateCommentAction server action:", error);
        throw error;
    }
};

export const deleteCommentAction = async (commentId) => {
    try {
        if (!commentId) throw new Error("Comment ID is required.");

        const response = await fetch(`${BaseUrl}/api/comments/${commentId}`, {
            method: 'DELETE',
            headers: await getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`Failed to delete comment: ${response.statusText}`);
        }

        const data = await response.json();
        if (data) {
            revalidatePath('/dashboard/client');
        }
        return data;
    } catch (error) {
        console.error("Error inside deleteCommentAction server action:", error);
        throw error;
    }
};