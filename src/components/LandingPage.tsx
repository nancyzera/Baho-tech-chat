import { Accessibility, MessageSquare, Headphones, BookOpen, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4A00E0] via-[#6B21E8] to-[#8E2DE2]">
      {/* Header */}
      <header className="relative z-10 px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
            <Accessibility className="w-7 h-7 text-[#4A00E0]" />
          </div>
          <span className="text-white text-2xl">Baho Tech</span>
        </div>
        
        <nav className="flex items-center gap-8">
          <button onClick={() => onNavigate('landing')} className="text-white hover:text-white/80 transition-colors">
            Home
          </button>
          <button onClick={() => onNavigate('landing')} className="text-white hover:text-white/80 transition-colors">
            Features
          </button>
          <button onClick={() => onNavigate('chatbot')} className="text-white hover:text-white/80 transition-colors">
            Support
          </button>
          <button onClick={() => onNavigate('pricing')} className="text-white hover:text-white/80 transition-colors">
            Pricing
          </button>
          <button onClick={() => onNavigate('landing')} className="text-white hover:text-white/80 transition-colors">
            Contact
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative px-8 py-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white text-sm">AI-Powered Accessibility</span>
            </div>
            
            <h1 className="text-white text-6xl leading-tight">
              Empowering Every Ability with Smart AI
            </h1>
            
            <p className="text-white/90 text-xl leading-relaxed">
              AI-powered assistance for communication, accessibility, and independence.
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={() => onNavigate('chatbot')}
                className="px-8 py-4 rounded-full bg-white text-[#4A00E0] hover:bg-white/90 transition-all transform hover:scale-105 shadow-xl"
              >
                Start Chat
              </button>
              <button
                onClick={() => onNavigate('landing')}
                className="px-8 py-4 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all"
              >
                Explore Features
              </button>
            </div>

            {/* Feature Icons */}
            <div className="grid grid-cols-4 gap-6 pt-8">
              <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <span className="text-white text-sm text-center">Voice to Text</span>
              </div>
              
              <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Headphones className="w-6 h-6 text-white" />
                </div>
                <span className="text-white text-sm text-center">Text to Speech</span>
              </div>
              
              <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-white text-sm text-center">Resources</span>
              </div>
              
              <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Accessibility className="w-6 h-6 text-white" />
                </div>
                <span className="text-white text-sm text-center">Training</span>
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-3xl blur-3xl"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1633466153506-a396b670565b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjB1c2luZyUyMGFzc2lzdGl2ZSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYyMTU4NDQ2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Person using assistive technology"
                className="w-full h-auto"
              />
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -bottom-6 -left-6 p-6 rounded-2xl bg-white shadow-2xl max-w-xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4A00E0] to-[#8E2DE2] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-gray-900">Real-time AI Support</div>
                  <div className="text-gray-600 text-sm">Available 24/7</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-[#8E2DE2]/30 blur-3xl"></div>
      </main>
    </div>
  );
}
