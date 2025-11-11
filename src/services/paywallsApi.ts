/**
 * Paywalls AI API Integration
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Sign up at https://paywalls.ai and get your API key
 * 2. Replace 'YOUR_PAYWALLS_AI_API_KEY' with your actual API key
 * 3. Update PAYWALLS_API_URL if using a custom endpoint
 * 4. For production, store API key in environment variables (process.env.VITE_PAYWALLS_API_KEY)
 */

const PAYWALLS_API_KEY = 'YOUR_PAYWALLS_AI_API_KEY';
const PAYWALLS_API_URL = 'https://api.paywalls.ai/v1';

// Enable mock mode for development (set to false in production)
const USE_MOCK_DATA = true;

export interface SubscriptionPlan {
  id: string;
  name: 'Basic' | 'Premium' | 'Enterprise';
  price: number;
  interval: 'month' | 'year';
  features: string[];
}

export interface PaymentSession {
  sessionId: string;
  checkoutUrl: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface SubscriptionStatus {
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'expired' | 'trial';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

/**
 * Create a checkout session for a subscription
 */
export async function createCheckoutSession(
  planId: string,
  userId: string,
  successUrl: string,
  cancelUrl: string
): Promise<PaymentSession> {
  if (USE_MOCK_DATA) {
    // Mock response for development
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          sessionId: `session_${Date.now()}`,
          checkoutUrl: `https://checkout.paywalls.ai/mock/${planId}`,
          status: 'pending'
        });
      }, 500);
    });
  }

  try {
    const response = await fetch(`${PAYWALLS_API_URL}/checkout/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAYWALLS_API_KEY}`
      },
      body: JSON.stringify({
        plan_id: planId,
        customer_id: userId,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          app: 'baho-tech',
          environment: 'production'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Paywalls API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Validate a payment session
 */
export async function validatePayment(sessionId: string): Promise<boolean> {
  if (USE_MOCK_DATA) {
    // Mock validation - always returns true after delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 300);
    });
  }

  try {
    const response = await fetch(`${PAYWALLS_API_URL}/checkout/sessions/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${PAYWALLS_API_KEY}`
      }
    });

    if (!response.ok) {
      return false;
    }

    const session = await response.json();
    return session.status === 'completed';
  } catch (error) {
    console.error('Error validating payment:', error);
    return false;
  }
}

/**
 * Get subscription status for a user
 */
export async function getSubscriptionStatus(userId: string): Promise<SubscriptionStatus | null> {
  if (USE_MOCK_DATA) {
    // Mock subscription data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          userId,
          planId: 'premium',
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false
        });
      }, 300);
    });
  }

  try {
    const response = await fetch(`${PAYWALLS_API_URL}/subscriptions?customer_id=${userId}`, {
      headers: {
        'Authorization': `Bearer ${PAYWALLS_API_KEY}`
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.subscriptions[0] || null;
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return null;
  }
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<boolean> {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 500);
    });
  }

  try {
    const response = await fetch(`${PAYWALLS_API_URL}/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${PAYWALLS_API_KEY}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return false;
  }
}

/**
 * Handle webhook from Paywalls AI
 * This should be implemented on your backend server
 */
export function handlePaywallsWebhook(webhookData: any): void {
  // This is a client-side placeholder
  // In production, implement this on your backend:
  // 
  // Example Flask endpoint:
  // @app.route('/webhooks/paywalls', methods=['POST'])
  // def paywalls_webhook():
  //     payload = request.json
  //     signature = request.headers.get('Paywalls-Signature')
  //     
  //     # Verify webhook signature
  //     if not verify_signature(payload, signature):
  //         return jsonify({'error': 'Invalid signature'}), 401
  //     
  //     # Handle different event types
  //     if payload['type'] == 'subscription.created':
  //         handle_subscription_created(payload['data'])
  //     elif payload['type'] == 'subscription.updated':
  //         handle_subscription_updated(payload['data'])
  //     elif payload['type'] == 'subscription.canceled':
  //         handle_subscription_canceled(payload['data'])
  //     
  //     return jsonify({'status': 'success'}), 200

  console.log('Webhook received:', webhookData);
}
