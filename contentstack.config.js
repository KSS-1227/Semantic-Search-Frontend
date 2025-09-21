// ContentStack Launch Configuration
module.exports = {
  // Build configuration
  build: {
    command: "npm run build",
    directory: "dist",
  },

  // Environment variables
  environment: {
    VITE_API_BASE_URL: "https://backend-6omk.onrender.com",
    VITE_APP_NAME: "Search App",
    VITE_ENABLE_ANALYTICS: "true",
    VITE_ENABLE_EXPLAINABILITY: "true",
  },

  // Headers for better performance
  headers: [
    {
      source: "/assets/*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      source: "/*",
      headers: [
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
      ],
    },
  ],

  // Redirects for SPA
  redirects: [
    {
      source: "/*",
      destination: "/index.html",
      statusCode: 200,
    },
  ],
};
