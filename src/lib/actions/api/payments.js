import { getAuthHeaders } from "./authHeaders";

const BaseUrl = process.env.NEXT_PUBLIC_API_URL ;

export const handlePayment = async (id) => {
  try {
    const response = await fetch(
      `${BaseUrl}/api/payment/create-checkout-session`,
      {
        method: "POST",
        headers: await getAuthHeaders(),
        body: JSON.stringify({ hiringId: id }),
      },
    );

    const responseData = await response.json();

    if (!response.ok) {
      return { error: responseData.error, details: responseData.details || "Server error" };
    }

    if (responseData.url) {
      return { url: responseData.url };
    }
  } catch (error) {
    console.error("Fetch API error:", error);
    return { error: error.message };
  }
};