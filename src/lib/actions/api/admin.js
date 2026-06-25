"use server";
import { getAuthHeaders } from "./authHeaders";

const BaseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getAdminUsersAction = async () => {
    try {
        const response = await fetch(`${BaseUrl}/api/admin/users`, {
            method: "GET",
            headers: await getAuthHeaders(),
            next: { revalidate: 0 }
        });
        if (!response.ok) throw new Error("Failed to load users list.");
        return await response.json();
    } catch (err) {
        console.error("Error in getAdminUsersAction:", err);
        return [];
    }
};

export const updateUserRoleAction = async (id, role) => {
    try {
        const response = await fetch(`${BaseUrl}/api/admin/users/${id}`, {
            method: "PATCH",
            headers: await getAuthHeaders(),
            body: JSON.stringify({ role })
        });
        if (!response.ok) throw new Error("Failed to update user role.");
        return await response.json();
    } catch (err) {
        console.error("Error in updateUserRoleAction:", err);
        throw err;
    }
};

export const deleteUserAction = async (id) => {
    try {
        const response = await fetch(`${BaseUrl}/api/admin/users/${id}`, {
            method: "DELETE",
            headers: await getAuthHeaders()
        });
        if (!response.ok) throw new Error("Failed to delete user.");
        return await response.json();
    } catch (err) {
        console.error("Error in deleteUserAction:", err);
        throw err;
    }
};

export const getAdminTransactionsAction = async () => {
    try {
        const response = await fetch(`${BaseUrl}/api/admin/transactions`, {
            method: "GET",
            headers: await getAuthHeaders(),
            next: { revalidate: 0 }
        });
        if (!response.ok) throw new Error("Failed to load transactions.");
        return await response.json();
    } catch (err) {
        console.error("Error in getAdminTransactionsAction:", err);
        return [];
    }
};

export const getAdminAnalyticsAction = async () => {
    try {
        const response = await fetch(`${BaseUrl}/api/admin/analytics`, {
            method: "GET",
            headers: await getAuthHeaders(),
            next: { revalidate: 0 }
        });
        if (!response.ok) throw new Error("Failed to load analytics.");
        return await response.json();
    } catch (err) {
        console.error("Error in getAdminAnalyticsAction:", err);
        return null;
    }
};
