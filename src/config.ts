/**
 * Application configuration from environment variables
 */

interface AppConfig {
  apiUrl: string
  environment: string
  appName: string
  appVersion: string
}

const config: AppConfig = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  environment: import.meta.env.VITE_ENVIRONMENT || 'development',
  appName: import.meta.env.VITE_APP_NAME || 'Construction Bid Intelligence Platform',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
}

// Helper to get full API URL
export const getApiUrl = (path: string = ''): string => {
  const baseUrl = config.apiUrl.endsWith('/') 
    ? config.apiUrl.slice(0, -1) 
    : config.apiUrl
  
  const apiPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${apiPath}`
}

export default config
