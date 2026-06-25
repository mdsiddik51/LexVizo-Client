'use server';

const BaseUrl = process.env.NEXT_PUBLIC_API_URL ;

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

export const fetchLawyersList = async () => {
  try {
    const response = await fetch(`${BaseUrl}/api/collectlawyer`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Safety check: always return an array so your UI layout map operations don't break
    return Array.isArray(data) ? data : []; 
    
  } catch (error) {
    console.error("Error executing live lawyer collection fetch:", error);
    throw error;
  }
};