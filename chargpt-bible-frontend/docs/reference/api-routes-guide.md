# Next.js API Routes Reference

**Purpose:** Create serverless API routes in `app/api/` for webhooks, third-party integrations, and server-side operations. Each route is a standalone serverless function.

## Overall Pattern

```
app/api/[route]/route.ts → HTTP Method Handler → Request Validation → Business Logic → Response
```

## Step 1: Create Route File Structure

```typescript
// app/api/checkout/create-session/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Extract request body
    const body = await request.json();
    
    // Validate input
    if (!body.priceId) {
      return NextResponse.json(
        { error: 'priceId is required' },
        { status: 400 }
      );
    }

    // Business logic
    const session = await createCheckoutSession(body.priceId);

    return NextResponse.json({ sessionId: session.id }, { status: 200 });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Rules:** Export named function matching HTTP method (`GET`, `POST`, `PUT`, `DELETE`), use `NextRequest`/`NextResponse`, handle errors with try/catch, return proper status codes.

## Step 2: Validate Request Data

```typescript
import { z } from 'zod';

const CreateSessionSchema = z.object({
  priceId: z.string().min(1),
  userId: z.string().uuid().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate with Zod
    const validation = CreateSessionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { priceId, userId } = validation.data;
    // Use validated data...
  } catch (error) {
    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }
    throw error;
  }
}
```

**Rules:** Use Zod for validation, validate all inputs, return 400 for invalid data, handle JSON parse errors separately.

## Step 3: Handle Webhooks

```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
```

**Rules:** Get raw body text for signature verification, always verify webhook signatures, use switch statement for event types, return 200 immediately after receiving (process async if needed), log unhandled events.

## Step 4: Access Environment Variables

```typescript
export async function POST(request: NextRequest) {
  // Validate required env vars
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    console.error('STRIPE_SECRET_KEY is not set');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  // Use env var
  const stripe = new Stripe(apiKey);
  // ...
}
```

**Rules:** Validate env vars at runtime, never commit secrets, use descriptive error messages, log errors for debugging.

## Step 5: Handle CORS (if needed)

```typescript
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_BASE_URL || '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

**Rules:** Only add CORS if route is called from external domains, restrict origins in production, allow OPTIONS method for preflight.

## Quick Checklist

- [ ] Created route file in `app/api/[route-name]/route.ts`
- [ ] Exported named function matching HTTP method (`GET`, `POST`, etc.)
- [ ] Used `NextRequest` and `NextResponse` types
- [ ] Added try/catch error handling
- [ ] Validated request data (Zod or manual validation)
- [ ] Returned proper HTTP status codes (200, 400, 500)
- [ ] Validated environment variables before use
- [ ] Handled JSON parse errors separately
- [ ] Verified webhook signatures (if applicable)
- [ ] Logged errors with context
- [ ] Never exposed sensitive data in error responses
- [ ] Added CORS headers only if needed
- [ ] Tested with valid and invalid requests
