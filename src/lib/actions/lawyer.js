'use server';


const BaseUrl = process.env.NEXT_URI || 'http://localhost:8080';

export const LawyerProfile = async (NewLawyer) => {
    try {
        console.log(`Sending data to: ${BaseUrl}/api/lawyer`);
        
        const response = await fetch(`${BaseUrl}/api/lawyer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(NewLawyer)
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        return await response.json();
        
    } catch (error) {
        console.error("Error inside LawyerProfile server action:", error);
        throw error; 
    }
};