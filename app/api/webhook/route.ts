import paypal from '@paypal/checkout-server-sdk';
import prisma from '@/app/prismadb';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Initialize PayPal client
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID as string;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET as string;

function getPayPalClient() {
    let environment = new paypal.core.SandboxEnvironment(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET);
    return new paypal.core.PayPalHttpClient(environment);
}

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Paypal-Transmission-Sig") as string;
    const transmissionId = headers().get("Paypal-Transmission-Id") as string;
    const transmissionTime = headers().get("Paypal-Transmission-Time") as string;
    const certUrl = headers().get("Paypal-Cert-Url") as string;
    const authAlgo = headers().get("Paypal-Auth-Algo") as string;

    const client = getPayPalClient();

    let event: any;

    // Manually verify PayPal webhook
    try {
        const verifyPayload = {
            auth_algo: authAlgo,
            cert_url: certUrl,
            transmission_id: transmissionId,
            transmission_sig: signature,
            transmission_time: transmissionTime,
            webhook_id: process.env.PAYPAL_WEBHOOK_ID,
            webhook_event: JSON.parse(body)
        };

        // Manually construct the verification request
        const verifyResponse = await fetch(certUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Paypal-Transmission-Id': transmissionId,
                'Paypal-Transmission-Time': transmissionTime,
                'Paypal-Transmission-Sig': signature,
                'Paypal-Cert-Url': certUrl,
                'Paypal-Auth-Algo': authAlgo,
                'Paypal-Webhook-Id': process.env.PAYPAL_WEBHOOK_ID!
            },
            body: JSON.stringify(verifyPayload)
        });

        const verifyResult = await verifyResponse.json();
        if (verifyResult.verification_status !== 'SUCCESS') {
            throw new Error('Verification failed');
        }

        event = JSON.parse(body);
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    // Process PayPal event
    if (event.event_type === 'CHECKOUT.ORDER.APPROVED') {
        const order = event.resource;
        const purchaseUnits = order.purchase_units;

        for (const purchaseUnit of purchaseUnits) {
            const purchasedId = purchaseUnit.custom_id;
            const userId = parseInt(purchaseUnit.reference_id as string);

            if (purchasedId) {
                const jsonArray = JSON.parse(purchasedId);

                if (Array.isArray(jsonArray)) {
                    for (const productId of jsonArray) {
                        await prisma.purchased.create({
                            data: {
                                isPaid: true,
                                productId: productId,
                                userId: userId
                            }
                        });

                        await prisma.cart.deleteMany({
                            where: {
                                userId: userId,
                                productId: productId
                            }
                        });
                    }
                }
            }
        }
    }

    return new NextResponse(null, { status: 200 });
}
