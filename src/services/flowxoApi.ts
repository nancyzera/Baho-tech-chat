/**
 * FlowXO API Integration
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Sign up at https://flowxo.com and create a flow
 * 2. Get your Flow ID and API Key from FlowXO dashboard
 * 3. Replace the placeholder values below
 * 4. Configure your flow triggers and responses in FlowXO
 * 5. For production, store credentials in environment variables
 */

const FLOWXO_API_KEY = 'YOUR_FLOWXO_API_KEY';
const FLOWXO_FLOW_ID = 'YOUR_FLOW_ID';
const FLOWXO_API_URL = 'https://api.flowxo.com/v1';

// Enable mock mode for development
const USE_MOCK_DATA = true;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface FlowXOResponse {
  success: boolean;
  messages: Array<{
    text: string;
    type: 'text' | 'image' | 'button' | 'card';
    buttons?: Array<{ text: string; value: string }>;
  }>;
  nextAction?: string;
}

export interface UserContext {
  userId: string;
  sessionId: string;
  selectedService?: 'voice-to-text' | 'text-to-speech' | 'resources' | 'tutorials';
  userPreferences?: {
    fontSize: string;
    highContrast: boolean;
  };
}

/**
 * Send a message to FlowXO and get AI response
 */
export async function sendMessageToFlowXO(
  message: string,
  context: UserContext
): Promise<FlowXOResponse> {
  if (USE_MOCK_DATA) {
    // Mock AI responses based on context and message
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = generateMockResponse(message, context);
        resolve(response);
      }, 1000);
    });
  }

  try {
    const response = await fetch(`${FLOWXO_API_URL}/flows/${FLOWXO_FLOW_ID}/messages`, {
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
    });

    if (!response.ok) {
      throw new Error(`FlowXO API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message to FlowXO:', error);
    throw error;
  }
}

/**
 * Trigger a specific flow in FlowXO
 */
export async function triggerFlow(
  flowName: string,
  data: Record<string, any>
): Promise<FlowXOResponse> {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          messages: [
            {
              text: `Flow "${flowName}" triggered successfully. Processing your request...`,
              type: 'text'
            }
          ]
        });
      }, 500);
    });
  }

  try {
    const response = await fetch(`${FLOWXO_API_URL}/triggers/${flowName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FLOWXO_API_KEY}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`FlowXO trigger error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error triggering FlowXO flow:', error);
    throw error;
  }
}

/**
 * Handle incoming webhook from FlowXO
 * This should be implemented on your backend server
 */
export async function handleFlowXOWebhook(webhookData: any): Promise<void> {
  // This is a client-side placeholder
  // In production, implement this on your backend:
  // 
  // Example Flask endpoint:
  // @app.route('/webhooks/flowxo', methods=['POST'])
  // def flowxo_webhook():
  //     payload = request.json
  //     
  //     # Verify webhook authenticity
  //     signature = request.headers.get('X-FlowXO-Signature')
  //     if not verify_flowxo_signature(payload, signature):
  //         return jsonify({'error': 'Invalid signature'}), 401
  //     
  //     # Process the webhook
  //     if payload['type'] == 'message':
  //         user_id = payload['user_id']
  //         message = payload['message']
  //         
  //         # Store message in database
  //         save_message(user_id, message)
  //         
  //         # Trigger additional flows if needed
  //         if 'accessibility' in message.lower():
  //             trigger_accessibility_flow(user_id)
  //     
  //     return jsonify({'status': 'received'}), 200

  console.log('FlowXO webhook received:', webhookData);
}

/**
 * Get conversation history from FlowXO
 */
export async function getConversationHistory(
  userId: string,
  sessionId: string
): Promise<ChatMessage[]> {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            role: 'assistant',
            content: "Hello! I'm your Baho Tech AI assistant. How can I help you today?",
            timestamp: new Date(Date.now() - 60000)
          }
        ]);
      }, 300);
    });
  }

  try {
    const response = await fetch(
      `${FLOWXO_API_URL}/conversations/${userId}/sessions/${sessionId}`,
      {
        headers: {
          'Authorization': `Bearer ${FLOWXO_API_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch conversation history');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    return [];
  }
}

/**
 * Mock response generator for development
 */
function generateMockResponse(message: string, context: UserContext): FlowXOResponse {
  const lowerMessage = message.toLowerCase();

  // Voice to Text responses
  if (context.selectedService === 'voice-to-text' || lowerMessage.includes('voice') || lowerMessage.includes('deaf')) {
    return {
      success: true,
      messages: [
        {
          text: "I can help you with voice-to-text conversion! Our AI-powered system can transcribe speech in real-time with high accuracy. Would you like to:",
          type: 'text'
        },
        {
          text: "Choose an option:",
          type: 'button',
          buttons: [
            { text: '🎤 Start Voice Recording', value: 'start_recording' },
            { text: '📝 View Transcription History', value: 'view_history' },
            { text: '⚙️ Adjust Settings', value: 'settings' }
          ]
        }
      ],
      nextAction: 'await_voice_choice'
    };
  }

  // Text to Speech responses
  if (context.selectedService === 'text-to-speech' || lowerMessage.includes('speak') || lowerMessage.includes('mute')) {
    return {
      success: true,
      messages: [
        {
          text: "Our text-to-speech service can convert any text into natural-sounding speech. Features include multiple voices, languages, and customizable speed. What would you like to do?",
          type: 'text'
        },
        {
          text: "Select an option:",
          type: 'button',
          buttons: [
            { text: '🔊 Convert Text Now', value: 'convert_text' },
            { text: '🗣️ Choose Voice', value: 'select_voice' },
            { text: '🌍 Language Options', value: 'languages' }
          ]
        }
      ],
      nextAction: 'await_tts_choice'
    };
  }

  // Resources responses
  if (context.selectedService === 'resources' || lowerMessage.includes('resource') || lowerMessage.includes('help')) {
    return {
      success: true,
      messages: [
        {
          text: "Here are our accessibility resources:",
          type: 'text'
        },
        {
          text: "📚 Available Resources:",
          type: 'card',
          buttons: [
            { text: '📖 Accessibility Guides', value: 'guides' },
            { text: '🎯 Best Practices', value: 'best_practices' },
            { text: '🛠️ Tools & Software', value: 'tools' },
            { text: '👥 Community Forum', value: 'forum' }
          ]
        }
      ]
    };
  }

  // Tutorials responses
  if (context.selectedService === 'tutorials' || lowerMessage.includes('learn') || lowerMessage.includes('tutorial')) {
    return {
      success: true,
      messages: [
        {
          text: "Welcome to our training center! We offer personalized tutorials to help you master accessibility tools.",
          type: 'text'
        },
        {
          text: "Choose a learning path:",
          type: 'button',
          buttons: [
            { text: '🎓 Beginner Course', value: 'beginner' },
            { text: '📈 Advanced Training', value: 'advanced' },
            { text: '🎯 Custom Learning Path', value: 'custom' }
          ]
        }
      ]
    };
  }

  // Premium/Pricing inquiries
  if (lowerMessage.includes('premium') || lowerMessage.includes('price') || lowerMessage.includes('upgrade')) {
    return {
      success: true,
      messages: [
        {
          text: "Great question! Our Premium plan includes real-time translation, personalized training, and IoT device control for $19/month. Would you like to upgrade or learn more?",
          type: 'text'
        },
        {
          text: "Options:",
          type: 'button',
          buttons: [
            { text: '💎 View All Plans', value: 'view_plans' },
            { text: '⭐ Upgrade Now', value: 'upgrade' },
            { text: '❓ Compare Features', value: 'compare' }
          ]
        }
      ]
    };
  }

  // Default response
  return {
    success: true,
    messages: [
      {
        text: "I understand you need assistance. I'm here to help with voice-to-text, text-to-speech, accessibility resources, and training. What would you like to explore?",
        type: 'text'
      },
      {
        text: "Main Services:",
        type: 'button',
        buttons: [
          { text: '🎤 Voice-to-Text', value: 'voice_to_text' },
          { text: '🔊 Text-to-Speech', value: 'text_to_speech' },
          { text: '📚 Resources', value: 'resources' },
          { text: '🎓 Training', value: 'training' }
        ]
      }
    ]
  };
}
