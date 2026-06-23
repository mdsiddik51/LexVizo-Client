// Backend Route (Node.js/Next.js API)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { amount, caseType, requestId } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Retainer Fee: ${caseType}`,
            },
            unit_amount: amount * 100, // Stripe expects amounts in cents ($50 = 5000)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Send the user to a success page with the ID so you can mark it paid in DB
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?payment_success=true&request_id=${requestId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?payment_cancel=true`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}