# Baho Tech - API Integration Guide

This guide explains how the Baho Tech application integrates with Paywalls AI and FlowXO APIs.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Quick Start](#quick-start)
3. [Paywalls AI Integration](#paywalls-ai-integration)
4. [FlowXO Integration](#flowxo-integration)
5. [Backend Setup](#backend-setup)
6. [Testing](#testing)
7. [Production Deployment](#production-deployment)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Landing     │  │  Chatbot     │  │   Pricing    │      │
│  │  Page        │  │  Interface   │  │   Page       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                    ┌───────▼───────┐                         │
│                    │  API Services │                         │
│                    └───────┬───────┘                         │
└────────────────────────────┼─────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │ Backend Server  │
                    │ (Flask/FastAPI) │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
         ┌────▼──────┐              ┌──────▼──────┐
         │ Paywalls  │              │   FlowXO    │
         │    AI     │              │     API     │
         └───────────┘              └─────────────┘
```

---

## Quick Start

### 1. Clone and Install

```bash
# Install frontend dependencies
npm install

# Install backend dependencies (Python)
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your API keys
# For development, keep VITE_USE_MOCK_DATA=true
```

### 3. Run Development Servers

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend (optional for mock mode)
cd backend
python backend.py
```

### 4. Access Application

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## Paywalls AI Integration

### Purpose
Handles subscription management and payment processing for Premium and Enterprise plans.

### Features Implemented

1. **Checkout Session Creation**
   - Creates secure payment sessions
   - Redirects users to Paywalls checkout page
   - Handles success/cancel callbacks

2. **Payment Validation**
   - Verifies payment completion
   - Updates user subscription status

3. **Subscription Management**
   - Fetches active subscriptions
   - Handles upgrades/downgrades
   - Processes cancellations

4. **Webhook Handling**
   - Receives payment notifications
   - Updates database on status changes

### Code Implementation

**Frontend: `/services/paywallsApi.ts`**

```typescript
// Create checkout session
export async function createCheckoutSession(
  planId: string,
  userId: string,
  successUrl: string,
  cancelUrl: string
): Promise<PaymentSession> {
  // In mock mode, returns fake session
  if (USE_MOCK_DATA) {
    return mockCheckoutSession(planId);
  }

  // Real API call
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
      cancel_url: cancelUrl
    })
  });

  return await response.json();
}
```

**Usage in PricingPage:**

```typescript
const handleSubscribe = async (planId: string) => {
  try {
    const session = await createCheckoutSession(
      planId,
      userId,
      '/payment/success',
      '/payment/cancel'
    );
    
    // Redirect to checkout
    window.location.href = session.checkoutUrl;
  } catch (error) {
    console.error('Payment error:', error);
  }
};
```

**Backend: `/services/backendExample.py`**

```python
@app.route('/api/payments/create-checkout', methods=['POST'])
def create_checkout():
    data = request.json
    
    response = requests.post(
        f'{PAYWALLS_API_URL}/checkout/sessions',
        headers={'Authorization': f'Bearer {PAYWALLS_API_KEY}'},
        json={
            'plan_id': data['planId'],
            'customer_id': data['userId'],
            'success_url': data['successUrl'],
            'cancel_url': data['cancelUrl']
        }
    )
    
    return jsonify(response.json())

@app.route('/webhooks/paywalls', methods=['POST'])
def paywalls_webhook():
    payload = request.json
    
    # Verify signature
    if not verify_signature(payload):
        return jsonify({'error': 'Invalid signature'}), 401
    
    # Handle event
    if payload['type'] == 'subscription.created':
        # Update database, send welcome email, etc.
        handle_new_subscription(payload['data'])
    
    return jsonify({'status': 'success'})
```

### Paywalls AI Flow Diagram

```
User clicks "Subscribe Now"
        ↓
Frontend calls createCheckoutSession()
        ↓
Backend forwards to Paywalls AI API
        ↓
Paywalls AI returns checkout URL
        ↓
User redirected to Paywalls checkout
        ↓
User completes payment
        ↓
Paywalls sends webhook to backend
        ↓
Backend updates subscription status
        ↓
User redirected back to success page
```

---

## FlowXO Integration

### Purpose
Provides AI-powered chatbot responses and automation for accessibility assistance.

### Features Implemented

1. **Message Processing**
   - Sends user messages to AI
   - Receives contextual responses
   - Supports button-based interactions

2. **Context Management**
   - Tracks user session
   - Remembers selected service
   - Applies accessibility preferences

3. **Flow Triggers**
   - Triggers specific workflows
   - Routes to appropriate assistance
   - Handles multi-step conversations

4. **Service-Specific Responses**
   - Voice-to-Text guidance
   - Text-to-Speech options
   - Resource recommendations
   - Tutorial pathways

### Code Implementation

**Frontend: `/services/flowxoApi.ts`**

```typescript
export async function sendMessageToFlowXO(
  message: string,
  context: UserContext
): Promise<FlowXOResponse> {
  // Mock mode for development
  if (USE_MOCK_DATA) {
    return generateMockResponse(message, context);
  }

  // Real API call
  const response = await fetch(
    `${FLOWXO_API_URL}/flows/${FLOWXO_FLOW_ID}/messages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FLOWXO_API_KEY}`
      },
      body: JSON.stringify({
        message: message,
        context: {
          user_id: context.userId,
          session_id: context.sessionId,
          service: context.selectedService,
          preferences: context.userPreferences
        }
      })
    }
  );

  return await response.json();
}
```

**Usage in ChatbotInterface:**

```typescript
const handleSendMessage = async () => {
  const context: UserContext = {
    userId,
    sessionId,
    selectedService: activeMenu,
    userPreferences: { fontSize, highContrast }
  };

  try {
    const response = await sendMessageToFlowXO(inputText, context);
    
    // Display bot responses
    response.messages.forEach(msg => {
      addMessage(msg.text, 'bot');
    });
  } catch (error) {
    console.error('Chat error:', error);
  }
};
```

**Backend: `/services/backendExample.py`**

```python
@app.route('/api/chat/message', methods=['POST'])
def send_chat_message():
    data = request.json
    
    response = requests.post(
        f'{FLOWXO_API_URL}/flows/{FLOWXO_FLOW_ID}/messages',
        headers={'Authorization': f'Bearer {FLOWXO_API_KEY}'},
        json={
            'message': data['message'],
            'context': data['context']
        }
    )
    
    return jsonify(response.json())

@app.route('/webhooks/flowxo', methods=['POST'])
def flowxo_webhook():
    payload = request.json
    
    # Store message in database
    if payload['type'] == 'message':
        save_chat_message(
            payload['user_id'],
            payload['message']
        )
    
    return jsonify({'status': 'received'})
```

### FlowXO Flow Diagram

```
User types message
        ↓
Frontend sends to sendMessageToFlowXO()
        ↓
Backend forwards with context to FlowXO
        ↓
FlowXO AI processes message + context
        ↓
FlowXO returns response + optional buttons
        ↓
Frontend displays response in chat
        ↓
User clicks button (optional)
        ↓
Trigger specific flow
```

### FlowXO Configuration

In your FlowXO dashboard, create flows for:

1. **Voice-to-Text Flow**
   - Trigger: User selects "Voice-to-Text" or mentions "voice", "deaf"
   - Actions: Provide recording options, settings, history

2. **Text-to-Speech Flow**
   - Trigger: User selects "Text-to-Speech" or mentions "speak", "mute"
   - Actions: Offer voice selection, language options, conversion

3. **Resources Flow**
   - Trigger: User selects "Resources" or asks for "help", "guide"
   - Actions: Show accessibility guides, tools, community links

4. **Training Flow**
   - Trigger: User selects "Training" or mentions "learn", "tutorial"
   - Actions: Present learning paths, courses, progress tracking

5. **Premium Inquiry Flow**
   - Trigger: Mentions "premium", "upgrade", "price"
   - Actions: Explain benefits, show pricing, link to checkout

---

## Backend Setup

### Flask Implementation

The backend serves as a secure proxy between the frontend and external APIs.

**Key Files:**
- `backend.py` - Main Flask application
- `.env` - Environment configuration
- `requirements.txt` - Python dependencies

**Endpoints:**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/payments/create-checkout` | Create Paywalls session |
| POST | `/api/payments/validate` | Validate payment |
| GET | `/api/subscriptions/:userId` | Get subscription |
| POST | `/api/chat/message` | Send chat message |
| POST | `/api/chat/trigger-flow` | Trigger FlowXO flow |
| POST | `/webhooks/paywalls` | Paywalls webhook |
| POST | `/webhooks/flowxo` | FlowXO webhook |
| GET | `/health` | Health check |

**Security Features:**
- CORS configuration
- Webhook signature verification
- API key management
- Rate limiting (recommended)
- Request logging

---

## Testing

### Mock Mode Testing

The application includes comprehensive mock data for development:

```typescript
// Enable mock mode
const USE_MOCK_DATA = true;

// Mock responses include:
// - Realistic payment sessions
// - Contextual AI responses
// - Subscription data
// - Error scenarios
```

### Test Scenarios

**Payment Flow:**
```bash
# 1. Navigate to pricing page
# 2. Click "Subscribe Now" on Premium
# 3. Verify mock checkout URL appears
# 4. Confirm session ID is generated
```

**Chatbot Flow:**
```bash
# 1. Open chatbot interface
# 2. Type "I need help with voice to text"
# 3. Verify context-aware response
# 4. Click button options
# 5. Verify flow triggers
```

**Accessibility Settings:**
```bash
# 1. Open settings panel
# 2. Change font size
# 3. Toggle high contrast
# 4. Verify UI updates
# 5. Send message - verify context includes preferences
```

### Integration Testing

With real APIs (test mode):

```bash
# 1. Set USE_MOCK_DATA=false
# 2. Configure test API keys
# 3. Run test suite
npm test

# 4. Test webhooks with ngrok
ngrok http 5000
# Update webhook URLs in dashboards
```

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] All API keys configured
- [ ] Mock mode disabled (`USE_MOCK_DATA=false`)
- [ ] Environment variables set
- [ ] Backend deployed and accessible
- [ ] Webhooks configured
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Database setup (if needed)
- [ ] Monitoring configured
- [ ] Error tracking setup

### Environment Variables

**Frontend (.env):**
```env
VITE_MODE=production
VITE_BACKEND_URL=https://api.bahotech.com
VITE_USE_MOCK_DATA=false
VITE_PAYWALLS_USE_MOCK=false
VITE_FLOWXO_USE_MOCK=false
```

**Backend (.env):**
```env
PAYWALLS_AI_API_KEY=pk_live_xxxxx
FLOWXO_API_KEY=fxo_xxxxx
FLOWXO_FLOW_ID=flow_xxxxx
SECRET_KEY=random_secure_key
PORT=5000
DEBUG=false
```

### Deployment Steps

1. **Deploy Backend:**
   ```bash
   # Heroku
   heroku create baho-tech-api
   heroku config:set PAYWALLS_AI_API_KEY=xxx
   git push heroku main

   # Or Railway
   railway link
   railway up
   ```

2. **Configure Webhooks:**
   ```bash
   # Paywalls AI
   https://your-backend.com/webhooks/paywalls

   # FlowXO
   https://your-backend.com/webhooks/flowxo
   ```

3. **Deploy Frontend:**
   ```bash
   # Vercel
   vercel --prod

   # Or Netlify
   npm run build
   netlify deploy --prod
   ```

4. **Verify Integration:**
   - Test payment flow end-to-end
   - Send test messages to chatbot
   - Verify webhooks receive events
   - Check error logging

### Monitoring

Track these metrics in production:

**Payment Metrics:**
- Checkout session created
- Payment success rate
- Payment failure reasons
- Average transaction value
- Subscription churn rate

**Chatbot Metrics:**
- Messages per session
- Average response time
- User satisfaction (thumbs up/down)
- Most common queries
- Flow completion rate

**System Metrics:**
- API response times
- Error rates by endpoint
- Webhook delivery success
- Server uptime
- Database performance

---

## Support & Resources

### Documentation
- [Paywalls AI Docs](https://docs.paywalls.ai)
- [FlowXO Docs](https://flowxo.com/docs)
- [Backend API Reference](/services/README.md)
- [Deployment Guide](/DEPLOYMENT.md)

### Common Issues

**"Payment checkout not working"**
- Verify API key is correct
- Check mock mode is disabled
- Ensure backend is accessible
- Check browser console for errors

**"Chatbot not responding"**
- Verify FlowXO API key and Flow ID
- Check flow is active in dashboard
- Verify context is being sent
- Check backend logs

**"Webhook not receiving"**
- Ensure webhook URL is publicly accessible
- Verify HTTPS is enabled
- Check signature verification
- Review service dashboard for delivery status

### Getting Help

- Email: support@bahotech.com
- GitHub Issues: [Report a bug]
- Community Forum: [Join discussion]

---

## Next Steps

After successful integration:

1. **Add User Authentication**
   - Implement login/signup
   - Store user data
   - Link subscriptions to accounts

2. **Enhance Analytics**
   - Add conversion tracking
   - Implement A/B testing
   - User behavior analysis

3. **Extend Features**
   - Real-time translation
   - IoT device control
   - Custom accessibility profiles

4. **Scale Infrastructure**
   - Load balancing
   - Caching layer
   - CDN for assets
   - Database optimization

---

**Last Updated:** November 3, 2025  
**Version:** 1.0.0  
**Maintainer:** Baho Tech Team
