'use server';


const BaseUrl = process.env.NEXT_URI ;

export const LawyerProfile = async (NewLawyer) => {
    try {
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


export const LawyerServices = async (Services) => {
    try {
        const response = await fetch(`${BaseUrl}/api/services`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Services)
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
