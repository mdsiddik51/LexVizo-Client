'use server';
import { getAuthHeaders } from "./authHeaders";

const BaseUrl = process.env.NEXT_PUBLIC_API_URL ;
export const createHiringRequestAction = async (payload) => {
    try {
        const response = await fetch(`${BaseUrl}/api/hiring`, {
            method: "POST",
            headers: await getAuthHeaders(),
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Server Pipeline Fault (${response.status}): ${errorData.message || "No contextual details provided"}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Critical execution fault logged in action layer:", error);
        throw new Error(error.message || "Failed to initialize hiring request.");
    }
};

export const updateRequestStatusAction = async (requestId, decision) => {
    try {
        const response = await fetch(`${BaseUrl}/api/hiring/${requestId}`, {
            method: "PATCH",
            headers: await getAuthHeaders(),
            body: JSON.stringify({ status: decision }),
        });
        return await response.json();
    } catch (error) {
        console.error(error);
        throw new Error("Failed to update system pipeline routing.");
    }
};

export const completeHiringPaymentAction = async (requestId, paymentDetails) => {
    try {
        const response = await fetch(`${BaseUrl}/api/hiring/${requestId}/payment`, {
            method: "POST",
            headers: await getAuthHeaders(),
            body: JSON.stringify({ status: "paid", paymentDetails, sessionId: paymentDetails }),
        });
        return await response.json();
    } catch (error) {
        console.error(error);
        throw new Error("Failed to log payment validation confirmation.");
    }
};

export const getPendingRequestsAction = async (lawyerId) => {
    try {
        if (!lawyerId) throw new Error("Lawyer identification id required.");

        const response = await fetch(`${BaseUrl}/api/hiring?lawyerId=${lawyerId}`, {
            method: "GET",
            headers: await getAuthHeaders(),
            next: { revalidate: 0 } 
        });

        if (!response.ok) {
            throw new Error(`Data fetch failed status code: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error in getPendingRequestsAction:", error);
        return [];
    }
};

export const getClientRequestsAction = async (clientId) => {
    try {
        if (!clientId) throw new Error("Client identification id required.");

        const response = await fetch(`${BaseUrl}/api/hiring?clientId=${clientId}`, {
            method: "GET",
            headers: await getAuthHeaders(),
            next: { revalidate: 0 } 
        });

        if (!response.ok) {
            throw new Error(`Data fetch failed status code: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error in getClientRequestsAction:", error);
        return [];
    }
};

export const getLawyerRequestsAction = async (lawyerId) => {
  try {
    if (!lawyerId) throw new Error("Lawyer identification id required.");

    const response = await fetch(`${BaseUrl}/api/hiring?lawyerId=${lawyerId}`, {
      method: "GET",
      headers: await getAuthHeaders(),
      next: { revalidate: 0 } 
    });

    if (!response.ok) {
      throw new Error(`Data fetch failed status code: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getLawyerRequestsAction:", error);
    return [];
  }
};