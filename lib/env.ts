// Simple getEnv function for accessing environment variables in a unified way
// Usage: getEnv().apiUrl, getEnv().baseUrl, getEnv().authUrl, getEnv().authSecret

export function getEnv() {
  const env = {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8888/gestiondestock/api/v1",
    authUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
    authSecret: process.env.NEXTAUTH_SECRET || "development-secret-key-for-testing",
  };

  Object.entries(env).forEach(([key, value]) => {
    if (!value || (key === 'authSecret' && value === 'development-secret-key-for-testing')) {
      // Only log in development mode on client, always log on server
      if (
          (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') ||
          typeof window === 'undefined'
      ) {
        console.warn(`Environment variable for ${key} is missing or using fallback value.`);
      }
    }
  });

  return env;
}
