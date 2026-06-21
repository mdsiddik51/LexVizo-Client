'use server';
import { revalidatePath } from "next/cache";
const BaseUrl = process.env.NEXT_URI;
console.log(BaseUrl)

export const postCommentAction = async ({ author, role, rating, text, lawyerId, userId }) => {
    try {
        const response = await fetch(`${BaseUrl}/api/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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
    });

    if (!response.ok) {
      // Extract the error message sent by your Express backend
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