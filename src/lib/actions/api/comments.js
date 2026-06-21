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
    const response = await fetch(`${BaseUrl}/api/comments?lawyerId=${lawyerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensures fresh data on every profile visit
    });

    if (!response.ok) {
      throw new Error("Server responded with an error protocol status.");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch evaluation matrix data:", error);
    throw error;
  }
};