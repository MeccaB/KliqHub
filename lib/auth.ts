/** Auth.js integration boundary. Configure providers only from environment variables. */
export const authProviders = {
  credentials: { enabled: true },
  google: { clientId: process.env.AUTH_GOOGLE_ID, clientSecret: process.env.AUTH_GOOGLE_SECRET },
  apple: { clientId: process.env.AUTH_APPLE_ID, clientSecret: process.env.AUTH_APPLE_SECRET },
};
export const authEnvironment = ['AUTH_SECRET', 'AUTH_GOOGLE_ID', 'AUTH_GOOGLE_SECRET', 'AUTH_APPLE_ID', 'AUTH_APPLE_SECRET'] as const;
