import Swal from 'sweetalert2'; 

const BaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const handlePayment = async (hiringRequestId) => {
  try {
    const response = await fetch(`${BaseUrl}/api/payment/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hiringId: hiringRequestId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || "Server error occurred");
      } catch {
        throw new Error(`Server status fault: ${response.status}`);
      }
    }

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      Swal.fire('Error', data.error || 'Failed to initialize payment.', 'error');
    }
  } catch (error) {
    console.error("Payment redirect error:", error);
    Swal.fire('Error', error.message || 'Something went wrong. Try again.', 'error');
  }
};