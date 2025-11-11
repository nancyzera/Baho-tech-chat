"""
Baho Tech Backend API - Flask/FastAPI Example
================================================

This file demonstrates how to set up a backend server for the Baho Tech application.
You can use either Flask or FastAPI (examples for both provided).

DEPLOYMENT INSTRUCTIONS:
1. Install dependencies: pip install flask fastapi uvicorn requests python-dotenv
2. Create a .env file with your API keys:
   PAYWALLS_AI_API_KEY=your_key_here
   FLOWXO_API_KEY=your_key_here
   FLOWXO_FLOW_ID=your_flow_id_here
   SECRET_KEY=your_secret_key_here

3. Run with Flask: python backend.py
   Or with FastAPI: uvicorn backend:app --reload

4. Update your frontend to point to this backend URL
"""

# ============================================
# FLASK EXAMPLE
# ============================================

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import hmac
import hashlib
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Configuration
PAYWALLS_API_KEY = os.getenv('PAYWALLS_AI_API_KEY')
PAYWALLS_API_URL = 'https://api.paywalls.ai/v1'
FLOWXO_API_KEY = os.getenv('FLOWXO_API_KEY')
FLOWXO_FLOW_ID = os.getenv('FLOWXO_FLOW_ID')
FLOWXO_API_URL = 'https://api.flowxo.com/v1'
SECRET_KEY = os.getenv('SECRET_KEY')

# ============================================
# PAYWALLS AI ENDPOINTS
# ============================================

@app.route('/api/payments/create-checkout', methods=['POST'])
def create_checkout():
    """Create a Paywalls AI checkout session"""
    try:
        data = request.json
        plan_id = data.get('planId')
        user_id = data.get('userId')
        
        # Call Paywalls AI API
        response = requests.post(
            f'{PAYWALLS_API_URL}/checkout/sessions',
            headers={
                'Authorization': f'Bearer {PAYWALLS_API_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'plan_id': plan_id,
                'customer_id': user_id,
                'success_url': data.get('successUrl'),
                'cancel_url': data.get('cancelUrl'),
                'metadata': {
                    'app': 'baho-tech',
                    'user_id': user_id
                }
            }
        )
        
        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({'error': 'Failed to create checkout session'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/payments/validate', methods=['POST'])
def validate_payment():
    """Validate a payment session"""
    try:
        data = request.json
        session_id = data.get('sessionId')
        
        response = requests.get(
            f'{PAYWALLS_API_URL}/checkout/sessions/{session_id}',
            headers={'Authorization': f'Bearer {PAYWALLS_API_KEY}'}
        )
        
        if response.status_code == 200:
            session_data = response.json()
            is_valid = session_data.get('status') == 'completed'
            return jsonify({'valid': is_valid, 'data': session_data}), 200
        else:
            return jsonify({'valid': False}), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/subscriptions/<user_id>', methods=['GET'])
def get_subscription(user_id):
    """Get subscription status for a user"""
    try:
        response = requests.get(
            f'{PAYWALLS_API_URL}/subscriptions',
            headers={'Authorization': f'Bearer {PAYWALLS_API_KEY}'},
            params={'customer_id': user_id}
        )
        
        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({'subscription': None}), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/webhooks/paywalls', methods=['POST'])
def paywalls_webhook():
    """Handle webhooks from Paywalls AI"""
    try:
        payload = request.json
        signature = request.headers.get('Paywalls-Signature')
        
        # Verify webhook signature
        if not verify_paywalls_signature(payload, signature):
            return jsonify({'error': 'Invalid signature'}), 401
        
        # Handle different event types
        event_type = payload.get('type')
        
        if event_type == 'subscription.created':
            handle_subscription_created(payload['data'])
        elif event_type == 'subscription.updated':
            handle_subscription_updated(payload['data'])
        elif event_type == 'subscription.canceled':
            handle_subscription_canceled(payload['data'])
        elif event_type == 'payment.succeeded':
            handle_payment_succeeded(payload['data'])
        
        return jsonify({'status': 'success'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================
# FLOWXO ENDPOINTS
# ============================================

@app.route('/api/chat/message', methods=['POST'])
def send_chat_message():
    """Send a message to FlowXO and get AI response"""
    try:
        data = request.json
        message = data.get('message')
        context = data.get('context', {})
        
        # Call FlowXO API
        response = requests.post(
            f'{FLOWXO_API_URL}/flows/{FLOWXO_FLOW_ID}/messages',
            headers={
                'Authorization': f'Bearer {FLOWXO_API_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'message': message,
                'context': context
            }
        )
        
        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({'error': 'Failed to send message'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/chat/trigger-flow', methods=['POST'])
def trigger_flow():
    """Trigger a specific FlowXO flow"""
    try:
        data = request.json
        flow_name = data.get('flowName')
        flow_data = data.get('data', {})
        
        response = requests.post(
            f'{FLOWXO_API_URL}/triggers/{flow_name}',
            headers={
                'Authorization': f'Bearer {FLOWXO_API_KEY}',
                'Content-Type': 'application/json'
            },
            json=flow_data
        )
        
        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({'error': 'Failed to trigger flow'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/webhooks/flowxo', methods=['POST'])
def flowxo_webhook():
    """Handle webhooks from FlowXO"""
    try:
        payload = request.json
        signature = request.headers.get('X-FlowXO-Signature')
        
        # Verify webhook signature
        if not verify_flowxo_signature(payload, signature):
            return jsonify({'error': 'Invalid signature'}), 401
        
        # Process the webhook
        event_type = payload.get('type')
        
        if event_type == 'message':
            user_id = payload.get('user_id')
            message = payload.get('message')
            
            # Store message in database (implement your database logic)
            save_message_to_db(user_id, message)
            
            # Trigger additional flows if needed
            if 'accessibility' in message.lower():
                trigger_accessibility_flow(user_id)
        
        return jsonify({'status': 'received'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================
# HELPER FUNCTIONS
# ============================================

def verify_paywalls_signature(payload, signature):
    """Verify Paywalls AI webhook signature"""
    if not signature:
        return False
    
    expected_signature = hmac.new(
        SECRET_KEY.encode(),
        str(payload).encode(),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(signature, expected_signature)


def verify_flowxo_signature(payload, signature):
    """Verify FlowXO webhook signature"""
    if not signature:
        return False
    
    expected_signature = hmac.new(
        FLOWXO_API_KEY.encode(),
        str(payload).encode(),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(signature, expected_signature)


def handle_subscription_created(data):
    """Handle new subscription creation"""
    user_id = data.get('customer_id')
    plan_id = data.get('plan_id')
    print(f"New subscription created: User {user_id} -> Plan {plan_id}")
    # Implement your logic (e.g., send welcome email, update database)


def handle_subscription_updated(data):
    """Handle subscription updates"""
    print(f"Subscription updated: {data}")
    # Implement your logic


def handle_subscription_canceled(data):
    """Handle subscription cancellation"""
    print(f"Subscription canceled: {data}")
    # Implement your logic


def handle_payment_succeeded(data):
    """Handle successful payment"""
    print(f"Payment succeeded: {data}")
    # Implement your logic


def save_message_to_db(user_id, message):
    """Save chat message to database"""
    # Implement your database logic
    print(f"Saving message from {user_id}: {message}")


def trigger_accessibility_flow(user_id):
    """Trigger accessibility assistance flow"""
    # Implement flow trigger logic
    print(f"Triggering accessibility flow for user {user_id}")


# ============================================
# HEALTH CHECK
# ============================================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat()
    }), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


# ============================================
# FASTAPI ALTERNATIVE
# ============================================

"""
Uncomment below for FastAPI version:

from fastapi import FastAPI, Request, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CheckoutRequest(BaseModel):
    planId: str
    userId: str
    successUrl: str
    cancelUrl: str

class ChatRequest(BaseModel):
    message: str
    context: dict = {}

@app.post("/api/payments/create-checkout")
async def create_checkout(request: CheckoutRequest):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{PAYWALLS_API_URL}/checkout/sessions",
            headers={
                "Authorization": f"Bearer {PAYWALLS_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "plan_id": request.planId,
                "customer_id": request.userId,
                "success_url": request.successUrl,
                "cancel_url": request.cancelUrl
            }
        )
        return response.json()

@app.post("/api/chat/message")
async def send_message(request: ChatRequest):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{FLOWXO_API_URL}/flows/{FLOWXO_FLOW_ID}/messages",
            headers={
                "Authorization": f"Bearer {FLOWXO_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "message": request.message,
                "context": request.context
            }
        )
        return response.json()

# Run with: uvicorn backend:app --reload
"""
