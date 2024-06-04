import paypal from '@paypal/checkout-server-sdk';
import { NextResponse } from 'next/server';
import prisma from '@/app/prismadb';

// Ensure that PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET are defined
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID as string;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET as string;

if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
  throw new Error('PayPal client ID and secret must be set in environment variables.');
}

// Set up and return PayPal client
function getPayPalClient() {
  let environment = new paypal.core.SandboxEnvironment(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET);
  return new paypal.core.PayPalHttpClient(environment);
}

const corsHeader = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeader });
}

export async function POST(req: Request) {
  const { productIds, userId } = await req.json();
  if (!productIds || productIds.length === 0) {
    return new NextResponse('Product ids not found', { status: 400 });
  }

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const orderRequest: paypal.orders.OrdersCreateRequest.RequestData = {
    intent: 'CAPTURE', // Ensure this matches the type CheckoutPaymentIntent
    purchase_units: products.map((product) => ({
      amount: {
        currency_code: 'USD',
        value: (product.price / 100).toFixed(2),
      },
      description: product.title,
    })),
  };

  const client = getPayPalClient();
  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody(orderRequest);

  let order;
  try {
    order = await client.execute(request);
  } catch (err) {
    let errorMessage = 'Error creating order';
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return new NextResponse(errorMessage, { status: 500 });
  }

  return NextResponse.json({ orderID: order.result.id, userId }, { headers: corsHeader });
}
