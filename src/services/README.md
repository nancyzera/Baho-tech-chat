# API Services Documentation

This directory contains the API integration code for Baho Tech's external services.

## Services Overview

### 1. Paywalls AI (`paywallsApi.ts`)
Handles payment processing and subscription management.

**Features:**
- Create checkout sessions
- Validate payments
- Get subscription status
- Cancel subscriptions
- Handle payment webhooks

**Usage Example:**
```typescript
import { createCheckoutSession } from './services/paywallsApi';

const session = await createCheckoutSession(
  'premium',           // Plan ID
  'user_123',          // User ID
  '/success',          // Success URL
  '/cancel'            // Cancel URL
);

// Redirect user to checkout
window.location.href = session.checkoutUrl;
```

### 2. FlowXO (`flowxoApi.ts`)
Provides AI-powered chatbot and automation capabilities.

**Features:**
- Send messages to AI chatbot
- Trigger specific flows
- Get conversation history
- Handle chatbot webhooks
- Context-aware responses

**Usage Example:**
```typescript
import { sendMessageToFlowXO } from './services/flowxoApi';

const context = {
  userId: 'user_123',
  sessionId: 'session_456',
  selectedService: 'voice-to-text',
  userPreferences: {
    fontSize: 'large',
    highContrast: true
  }
};

const response = await sendMessageToFlowXO(
  'I need help with voice to text',
  context
);

// Display bot responses
response.messages.forEach(msg => {
  console.log(msg.text);
});
```

### 3. Backend Example (`backendExample.py`)
Complete Flask/FastAPI backend implementation.

**Features:**
- RESTful API endpoints
- Webhook handlers
- Signature verification
- CORS configuration
- Error handling

## Development Mode

Both API services support a development mode with mock data:

```typescript
// In paywallsApi.ts
const USE_MOCK_DATA = true;  // Mock mode enabled

// In flowxoApi.ts
const USE_MOCK_DATA = true;  // Mock mode enabled
```

**When to use mock mode:**
- Local development
- Testing without API keys
- Prototyping
- Demo environments

**When to disable mock mode:**
- Staging environment
- Production deployment
- Integration testing
- Live demos

## API Configuration

### Paywalls AI Configuration

```typescript
const PAYWALLS_API_KEY = 'YOUR_PAYWALLS_AI_API_KEY';
const PAYWALLS_API_URL = 'https://api.paywalls.ai/v1';
```

Get your API key from: https://paywalls.ai/dashboard/api-keys

### FlowXO Configuration

```typescript
const FLOWXO_API_KEY = 'YOUR_FLOWXO_API_KEY';
const FLOWXO_FLOW_ID = 'YOUR_FLOW_ID';
const FLOWXO_API_URL = 'https://api.flowxo.com/v1';
```

Get your credentials from: https://flowxo.com/account/api

## Error Handling

All API functions include error handling:

```typescript
try {
  const result = await createCheckoutSession(...);
  // Handle success
} catch (error) {
  console.error('Payment error:', error);
  // Handle error (show user message, retry, etc.)
}
```

## TypeScript Types

### Paywalls AI Types

```typescript
interface SubscriptionPlan {
  id: string;
  name: 'Basic' | 'Premium' | 'Enterprise';
  price: number;
  interval: 'month' | 'year';
  features: string[];
}

interface PaymentSession {
  sessionId: string;
  checkoutUrl: string;
  status: 'pending' | 'completed' | 'failed';
}

interface SubscriptionStatus {
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'expired' | 'trial';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}
```

### FlowXO Types

```typescript
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface FlowXOResponse {
  success: boolean;
  messages: Array<{
    text: string;
    type: 'text' | 'image' | 'button' | 'card';
    buttons?: Array<{ text: string; value: string }>;
  }>;
  nextAction?: string;
}

interface UserContext {
  userId: string;
  sessionId: string;
  selectedService?: 'voice-to-text' | 'text-to-speech' | 'resources' | 'tutorials';
  userPreferences?: {
    fontSize: string;
    highContrast: boolean;
  };
}
```

## Security Considerations

### API Keys
- Never commit API keys to version control
- Use environment variables in production
- Rotate keys regularly
- Use different keys for dev/staging/production

### Webhooks
- Always verify webhook signatures
- Use HTTPS only
- Implement rate limiting
- Log all webhook events

### User Data
- Don't store sensitive payment data
- Comply with GDPR/CCPA
- Encrypt data at rest and in transit
- Implement data retention policies

## Testing

### Unit Tests

```typescript
// Mock API responses for testing
jest.mock('./services/paywallsApi', () => ({
  createCheckoutSession: jest.fn(() => Promise.resolve({
    sessionId: 'test_session',
    checkoutUrl: 'https://test.com',
    status: 'pending'
  }))
}));
```

### Integration Tests

```bash
# Test with real API (use test mode)
USE_MOCK_DATA=false npm test
```

## Rate Limits

### Paywalls AI
- 100 requests per minute
- 10,000 requests per day

### FlowXO
- 60 requests per minute
- Unlimited messages for paid plans

## Webhooks

### Paywalls AI Webhook Events

```json
{
  "type": "subscription.created",
  "data": {
    "subscription_id": "sub_123",
    "customer_id": "user_123",
    "plan_id": "premium",
    "status": "active"
  }
}
```

### FlowXO Webhook Events

```json
{
  "type": "message",
  "user_id": "user_123",
  "message": "Hello",
  "timestamp": "2025-11-03T12:00:00Z"
}
```

## Monitoring

Track these metrics:
- API response times
- Error rates
- Webhook delivery success
- Payment conversion rates
- Chatbot engagement

## Support

- Paywalls AI docs: https://docs.paywalls.ai
- FlowXO docs: https://flowxo.com/docs
- API status: Check service status pages
- GitHub issues: Report bugs and request features

## Changelog

### v1.0.0 (2025-11-03)
- Initial release
- Paywalls AI integration
- FlowXO integration
- Backend examples (Flask & FastAPI)
- Mock data for development
- TypeScript types
- Error handling
- Documentation
