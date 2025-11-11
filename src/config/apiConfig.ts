/**
 * API Configuration
 * 
 * This file centralizes all API configuration.
 * Update these values based on your environment.
 */

export const config = {
  // Environment
  environment: import.meta.env.MODE || 'development',
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',

  // Feature flags
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true' || import.meta.env.MODE === 'development',

  // Backend API
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',

  // Paywalls AI
  paywalls: {
    apiKey: import.meta.env.VITE_PAYWALLS_API_KEY || 'YOUR_PAYWALLS_AI_API_KEY',
    apiUrl: import.meta.env.VITE_PAYWALLS_API_URL || 'https://api.paywalls.ai/v1',
    useMock: import.meta.env.VITE_PAYWALLS_USE_MOCK === 'true' || import.meta.env.MODE === 'development'
  },

  // FlowXO
  flowxo: {
    apiKey: import.meta.env.VITE_FLOWXO_API_KEY || 'YOUR_FLOWXO_API_KEY',
    flowId: import.meta.env.VITE_FLOWXO_FLOW_ID || 'YOUR_FLOW_ID',
    apiUrl: import.meta.env.VITE_FLOWXO_API_URL || 'https://api.flowxo.com/v1',
    useMock: import.meta.env.VITE_FLOWXO_USE_MOCK === 'true' || import.meta.env.MODE === 'development'
  },

  // Application
  app: {
    name: 'Baho Tech',
    version: '1.0.0',
    supportEmail: 'support@bahotech.com'
  }
};

/**
 * Get full API endpoint URL
 */
export function getApiUrl(endpoint: string): string {
  const baseUrl = config.backendUrl;
  return `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
}

/**
 * Check if we're using mock data
 */
export function shouldUseMockData(): boolean {
  return config.useMockData;
}

/**
 * Get environment-specific configuration
 */
export function getEnvironmentConfig() {
  return {
    environment: config.environment,
    isDevelopment: config.isDevelopment,
    isProduction: config.isProduction,
    backendUrl: config.backendUrl,
    useMockData: config.useMockData
  };
}

/**
 * Validate configuration
 * Logs warnings if important values are missing in production
 */
export function validateConfig(): void {
  if (config.isProduction) {
    const warnings: string[] = [];

    if (config.paywalls.apiKey === 'YOUR_PAYWALLS_AI_API_KEY') {
      warnings.push('Paywalls AI API key not configured');
    }

    if (config.flowxo.apiKey === 'YOUR_FLOWXO_API_KEY') {
      warnings.push('FlowXO API key not configured');
    }

    if (config.flowxo.flowId === 'YOUR_FLOW_ID') {
      warnings.push('FlowXO Flow ID not configured');
    }

    if (config.backendUrl === 'http://localhost:5000') {
      warnings.push('Backend URL still pointing to localhost');
    }

    if (warnings.length > 0) {
      console.warn('⚠️  Configuration Warnings:');
      warnings.forEach(warning => console.warn(`  - ${warning}`));
      console.warn('Please set environment variables in .env file');
    }
  }
}

// Run validation on import (only in browser)
if (typeof window !== 'undefined') {
  validateConfig();
}

export default config;
