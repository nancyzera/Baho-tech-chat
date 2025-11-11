# Baho Tech - Quick Start Guide

Get up and running with Baho Tech in 5 minutes!

## 🚀 Installation

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Start development server
npm run dev
```

**That's it!** The app will run with mock data at http://localhost:5173

---

## 📁 Project Structure

```
baho-tech/
├── components/           # React components
│   ├── LandingPage.tsx      # Hero & features
│   ├── ChatbotInterface.tsx # AI chat interface
│   ├── PricingPage.tsx      # Subscription plans
│   └── AdminDashboard.tsx   # Analytics dashboard
├── services/            # API integrations
│   ├── paywallsApi.ts      # Payment processing
│   ├── flowxoApi.ts        # AI chatbot
│   └── backendExample.py   # Flask/FastAPI server
├── config/             # Configuration
│   └── apiConfig.ts        # Centralized config
└── App.tsx             # Main app router
```

---

## 🎯 Key Features

### 1. Landing Page
- Hero section with CTA buttons
- Accessibility feature showcase
- Gradient purple-blue design
- Responsive layout

### 2. Chatbot Interface
- AI-powered responses via FlowXO
- Accessibility settings (font size, high contrast)
- Voice-to-Text & Text-to-Speech services
- Training and resources

### 3. Pricing Page
- 3 subscription tiers (Basic, Premium, Enterprise)
- Paywalls AI integration
- Mock checkout for development
- Real payment processing ready

### 4. Admin Dashboard
- User statistics
- Recent activity tracking
- System health metrics
- Subscription management

---

## 🔑 API Integration

### Mock Mode (Development)

Already configured! The app uses mock data automatically in development.

```typescript
// services/paywallsApi.ts
const USE_MOCK_DATA = true; // ✅ Enabled by default

// services/flowxoApi.ts
const USE_MOCK_DATA = true; // ✅ Enabled by default
```

### Production Mode

1. **Get API Keys:**
   - Paywalls AI: https://paywalls.ai/dashboard/api-keys
   - FlowXO: https://flowxo.com/account/api

2. **Update .env:**
   ```env
   VITE_USE_MOCK_DATA=false
   VITE_PAYWALLS_API_KEY=your_key
   VITE_FLOWXO_API_KEY=your_key
   VITE_FLOWXO_FLOW_ID=your_flow_id
   ```

3. **Deploy Backend:**
   ```bash
   # See DEPLOYMENT.md for detailed instructions
   cd backend
   python backend.py
   ```

---

## 🎨 Customization

### Colors

Edit `/styles/globals.css`:

```css
:root {
  --color-primary: #4A00E0;    /* Deep purple */
  --color-secondary: #8E2DE2;  /* Light purple */
}
```

### Content

Edit component files:
- **Landing Page**: `/components/LandingPage.tsx`
- **Chat Messages**: `/services/flowxoApi.ts` (mock responses)
- **Pricing Plans**: `/components/PricingPage.tsx`

---

## 🧪 Testing

### Test Payment Flow

1. Go to `/pricing`
2. Click "Subscribe Now" (Premium or Enterprise)
3. Mock checkout URL will be generated
4. Session ID logged to console

### Test Chatbot

1. Go to `/chatbot`
2. Try these messages:
   - "I need help with voice to text"
   - "Tell me about premium features"
   - "Show me accessibility resources"
3. Responses are contextual based on selected service

### Test Accessibility

1. Click Settings icon in chatbot
2. Change font size (Small/Medium/Large)
3. Toggle high contrast mode
4. Verify UI updates instantly

---

## 🚢 Deployment

### Quick Deploy to Vercel

```bash
vercel
```

### Quick Deploy to Netlify

```bash
npm run build
netlify deploy --prod
```

### Backend Deploy to Railway

```bash
railway link
railway up
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) | Complete API integration details |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production deployment guide |
| [services/README.md](./services/README.md) | API services documentation |
| [.env.example](./.env.example) | Environment variables template |

---

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Backend (Python)
python backend.py        # Run Flask server
uvicorn backend:app      # Run FastAPI server

# Environment
cp .env.example .env     # Create config file
```

---

## 🆘 Troubleshooting

### Issue: Port already in use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Issue: API not responding
- Check mock mode is enabled (`USE_MOCK_DATA=true`)
- Verify API keys in `.env`
- Check browser console for errors

### Issue: Payment redirect not working
- Ensure checkout URL is valid
- Check browser doesn't block popups
- Verify Paywalls API key

---

## 🎯 Next Steps

After setup:

1. ✅ Explore all pages (Landing, Chatbot, Pricing, Admin)
2. ✅ Test accessibility features
3. ✅ Review API integration code
4. ✅ Configure real API keys (optional)
5. ✅ Deploy to production

---

## 💡 Pro Tips

- **Development:** Keep mock mode enabled for fast iteration
- **Styling:** Use Tailwind classes, respect typography tokens
- **Icons:** Use lucide-react for consistency
- **Accessibility:** Test with high contrast mode
- **Performance:** Images use fallback system

---

## 📞 Support

- **Email:** support@bahotech.com
- **Docs:** See /guidelines/Guidelines.md
- **GitHub:** [Report issues]

---

**Built with:** React, TypeScript, Tailwind CSS, Vite  
**Integrations:** Paywalls AI, FlowXO  
**Version:** 1.0.0

Happy coding! 🎉
