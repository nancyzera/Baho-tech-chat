import { useState } from 'react';
import { Check, Sparkles, Zap, Crown, Globe, Home, Accessibility, Loader2 } from 'lucide-react';
import { createCheckoutSession } from '../services/paywallsApi';

interface PricingPageProps {
  onNavigate: (page: string) => void;
}

export function PricingPage({ onNavigate }: PricingPageProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const handleSubscribe = async (planId: string, planName: string) => {
    if (planName === 'Basic') {
      // Free plan - just navigate to chatbot
      onNavigate('chatbot');
      return;
    }

    setLoadingPlan(planId);

    try {
      // Create checkout session via Paywalls AI
      const userId = `user_${Date.now()}`; // In production, use actual user ID
      const successUrl = `${window.location.origin}?payment=success`;
      const cancelUrl = `${window.location.origin}?payment=canceled`;

      const session = await createCheckoutSession(planId, userId, successUrl, cancelUrl);

      // Redirect to checkout page
      if (session.checkoutUrl) {
        window.location.href = session.checkoutUrl;
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Unable to process payment. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 'Free',
      description: 'Essential accessibility tools',
      icon: Home,
      features: [
        'Voice-to-Text conversion',
        'Text-to-Speech output',
        'Basic accessibility resources',
        'Community support',
        'Up to 100 messages/month'
      ],
      gradient: 'from-gray-500 to-gray-700',
      glowColor: 'shadow-gray-500/50'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$19',
      period: '/month',
      description: 'Advanced AI assistance',
      icon: Zap,
      features: [
        'Unlimited messages',
        'Real-time translation (50+ languages)',
        'Personalized training assistant',
        'Smart device IoT control',
        'Priority 24/7 support',
        'Advanced voice customization',
        'Custom accessibility profiles'
      ],
      gradient: 'from-[#4A00E0] to-[#8E2DE2]',
      glowColor: 'shadow-[#8E2DE2]/50',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$49',
      period: '/month',
      description: 'Full-featured solution',
      icon: Crown,
      features: [
        'Everything in Premium',
        'Multi-user accounts (up to 10)',
        'Advanced analytics dashboard',
        'Custom AI model training',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
        'White-label options'
      ],
      gradient: 'from-purple-600 to-pink-600',
      glowColor: 'shadow-purple-600/50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4A00E0] via-[#6B21E8] to-[#8E2DE2]">
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <Accessibility className="w-6 h-6 text-[#4A00E0]" />
          </div>
          <span className="text-white text-xl">Baho Tech</span>
        </div>
        
        <button
          onClick={() => onNavigate('landing')}
          className="px-4 py-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
        >
          Back to Home
        </button>
      </header>

      {/* Main Content */}
      <main className="px-8 py-16 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-white text-sm">Unlock Advanced Assistance</span>
          </div>
          
          <h1 className="text-white text-5xl">
            Choose Your Plan
          </h1>
          
          <p className="text-white/90 text-xl max-w-2xl mx-auto">
            Select the perfect plan to enhance your accessibility experience with AI-powered tools
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div
                key={index}
                className={`relative rounded-3xl bg-white p-8 transition-all duration-300 hover:scale-105 ${
                  plan.popular ? `ring-4 ring-white ${plan.glowColor} shadow-2xl` : 'shadow-xl'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg">
                    <span className="text-white">Most Popular</span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.gradient} mb-4 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-gray-900 text-2xl mb-2">
                    {plan.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl text-gray-900">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-gray-600">{plan.period}</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-4 rounded-full bg-gradient-to-r ${plan.gradient} text-white hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                  onClick={() => handleSubscribe(plan.id, plan.name)}
                  disabled={loadingPlan === plan.id}
                >
                  {loadingPlan === plan.id ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>{plan.price === 'Free' ? 'Get Started' : 'Subscribe Now'}</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center space-y-6">
          <div className="inline-flex items-center gap-8 px-8 py-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-white" />
              <div className="text-left">
                <div className="text-white">Powered by AI</div>
                <div className="text-white/70 text-sm">Advanced machine learning</div>
              </div>
            </div>
            
            <div className="w-px h-12 bg-white/20"></div>
            
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-white" />
              <div className="text-left">
                <div className="text-white">Paywalls AI Integration</div>
                <div className="text-white/70 text-sm">Secure payment processing</div>
              </div>
            </div>
            
            <div className="w-px h-12 bg-white/20"></div>
            
            <div className="flex items-center gap-3">
              <Accessibility className="w-6 h-6 text-white" />
              <div className="text-left">
                <div className="text-white">Accessible to All</div>
                <div className="text-white/70 text-sm">Inclusive design standards</div>
              </div>
            </div>
          </div>

          <p className="text-white/80 max-w-2xl mx-auto">
            All plans include access to our community forum and basic training resources. 
            Cancel anytime with no hidden fees. 30-day money-back guarantee on all paid plans.
          </p>
        </div>
      </main>

      {/* Background Decorative Elements */}
      <div className="fixed top-20 right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-20 left-20 w-80 h-80 rounded-full bg-[#8E2DE2]/30 blur-3xl pointer-events-none"></div>
    </div>
  );
}
