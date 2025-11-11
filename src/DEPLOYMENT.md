# Baho Tech Community Support Hub - Deployment Guide

## Overview

This guide will help you deploy the Baho Tech application with backend integration for Paywalls AI (payment processing) and FlowXO (AI chatbot).

## Architecture

```
Frontend (React + TypeScript)
    ↓
Backend API (Flask/FastAPI)
    ↓
External Services:
    - Paywalls AI (Payment Processing)
    - FlowXO (AI Chatbot & Automation)
```

## Prerequisites

1. Node.js 16+ (for frontend)
2. Python 3.8+ (for backend)
3. Paywalls AI account and API key
4. FlowXO account, Flow ID, and API key

## Step 1: Frontend Setup

The frontend is already configured and can run in development mode with mock data.

```bash
# Install dependencies (if needed)
npm install

# Run development server
npm run dev
```

The frontend will use mock data by default. To connect to real APIs, proceed to Step 2.

## Step 2: Backend Setup

### Option A: Flask Backend

1. Install dependencies:
```bash
pip install flask flask-cors requests python-dotenv
```

2. Create `.env` file in your backend directory:
```env
PAYWALLS_AI_API_KEY=your_paywalls_api_key_here
FLOWXO_API_KEY=your_flowxo_api_key_here
FLOWXO_FLOW_ID=your_flowxo_flow_id_here
SECRET_KEY=your_secret_key_for_webhooks
```

3. Save the backend code from `/services/backendExample.py` as `backend.py`

4. Run the Flask server:
```bash
python backend.py
```

The server will run on `http://localhost:5000`

### Option B: FastAPI Backend

1. Install dependencies:
```bash
pip install fastapi uvicorn httpx python-dotenv
```

2. Create the same `.env` file as above

3. Uncomment the FastAPI section in `backendExample.py` or create a new file

4. Run the FastAPI server:
```bash
uvicorn backend:app --reload
```

The server will run on `http://localhost:8000`

## Step 3: Configure API Keys

### Paywalls AI Setup

1. Sign up at https://paywalls.ai
2. Create a new project
3. Go to Settings → API Keys
4. Copy your API key
5. Add to `.env` file
6. Configure webhook URL: `https://your-domain.com/webhooks/paywalls`

### FlowXO Setup

1. Sign up at https://flowxo.com
2. Create a new flow for the chatbot
3. Configure the following intents:
   - Voice-to-Text assistance
   - Text-to-Speech assistance
   - Accessibility resources
   - Training/tutorials
   - Premium plan inquiries
4. Get your Flow ID from the flow settings
5. Get your API key from Account → API Settings
6. Add both to `.env` file
7. Configure webhook URL: `https://your-domain.com/webhooks/flowxo`

## Step 4: Update Frontend Configuration

In the frontend, update the API service files to use real endpoints:

**services/paywallsApi.ts**:
```typescript
const USE_MOCK_DATA = false; // Change to false
```

**services/flowxoApi.ts**:
```typescript
const USE_MOCK_DATA = false; // Change to false
```

## Step 5: Deploy to Production

### Backend Deployment Options

#### Option 1: Deploy to Heroku
```bash
# Create Procfile
echo "web: python backend.py" > Procfile

# Deploy
heroku create baho-tech-backend
heroku config:set PAYWALLS_AI_API_KEY=your_key
heroku config:set FLOWXO_API_KEY=your_key
heroku config:set FLOWXO_FLOW_ID=your_id
heroku config:set SECRET_KEY=your_secret
git push heroku main
```

#### Option 2: Deploy to Railway
1. Connect your GitHub repository
2. Add environment variables in Railway dashboard
3. Railway will auto-detect and deploy your Flask/FastAPI app

#### Option 3: Deploy to DigitalOcean App Platform
1. Create new app from GitHub
2. Select Python environment
3. Add environment variables
4. Deploy

### Frontend Deployment Options

#### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

#### Option 2: Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

## Step 6: Configure Webhooks

After deploying your backend, configure webhooks in both services:

### Paywalls AI Webhooks
1. Go to Paywalls AI Dashboard → Webhooks
2. Add webhook URL: `https://your-backend-url.com/webhooks/paywalls`
3. Select events:
   - subscription.created
   - subscription.updated
   - subscription.canceled
   - payment.succeeded

### FlowXO Webhooks
1. Go to FlowXO Dashboard → Your Flow → Webhooks
2. Add webhook URL: `https://your-backend-url.com/webhooks/flowxo`
3. Enable webhook triggers for message events

## Step 7: Testing

### Test Payment Flow
1. Go to the Pricing page
2. Click "Subscribe Now" on Premium or Enterprise plan
3. Verify redirect to Paywalls AI checkout
4. Complete test payment (use test mode in Paywalls AI)
5. Verify webhook received and processed

### Test Chatbot
1. Go to the Chatbot interface
2. Send various messages:
   - "I need help with voice to text"
   - "Tell me about premium features"
   - "I want to learn sign language"
3. Verify FlowXO responses are contextual and accurate

## Environment Variables Reference

```env
# Required
PAYWALLS_AI_API_KEY=pk_live_xxxxxxxxxxxxx
FLOWXO_API_KEY=fxo_xxxxxxxxxxxxx
FLOWXO_FLOW_ID=flow_xxxxxxxxxxxxx
SECRET_KEY=random_secure_string_for_webhooks

# Optional
PORT=5000
DEBUG=false
DATABASE_URL=postgresql://user:pass@host:5432/db
```

## Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use HTTPS in production** - Required for webhooks
3. **Validate webhook signatures** - Prevent unauthorized requests
4. **Rate limit your API** - Prevent abuse
5. **Store user data securely** - Follow GDPR/privacy laws
6. **Regular security audits** - Keep dependencies updated

## Monitoring & Logging

Add monitoring to track:
- API response times
- Payment success/failure rates
- Chatbot conversation quality
- User engagement metrics
- Error rates and types

Recommended tools:
- Sentry (error tracking)
- LogRocket (session replay)
- Datadog (infrastructure monitoring)
- Mixpanel (analytics)

## Support

For issues:
1. Check `/services/backendExample.py` for implementation examples
2. Review Paywalls AI docs: https://docs.paywalls.ai
3. Review FlowXO docs: https://flowxo.com/docs
4. Contact support@bahotech.com

## Next Steps

After deployment:
1. Set up user authentication (Auth0, Firebase Auth, etc.)
2. Add database for user data (PostgreSQL, MongoDB)
3. Implement admin dashboard analytics
4. Add email notifications (SendGrid, Mailgun)
5. Set up continuous integration/deployment (GitHub Actions)
6. Configure domain and SSL certificates
7. Add monitoring and alerting
8. Create backup and disaster recovery plan

## API Endpoints Reference

### Backend Endpoints

#### Payment Endpoints
- `POST /api/payments/create-checkout` - Create payment session
- `POST /api/payments/validate` - Validate payment
- `GET /api/subscriptions/:userId` - Get user subscription
- `POST /webhooks/paywalls` - Paywalls webhook handler

#### Chat Endpoints
- `POST /api/chat/message` - Send chat message
- `POST /api/chat/trigger-flow` - Trigger specific flow
- `POST /webhooks/flowxo` - FlowXO webhook handler

#### Health Check
- `GET /health` - Server health status

## Troubleshooting

### Issue: Webhooks not receiving
**Solution**: Ensure your backend is publicly accessible and using HTTPS

### Issue: Payment checkout fails
**Solution**: Check Paywalls AI API key and ensure test mode is enabled for testing

### Issue: Chatbot not responding
**Solution**: Verify FlowXO API key and Flow ID are correct

### Issue: CORS errors
**Solution**: Ensure CORS is properly configured in backend with correct frontend URL

## License

Copyright © 2025 Baho Tech. All rights reserved.
