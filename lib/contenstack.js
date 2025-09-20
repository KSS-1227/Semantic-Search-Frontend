import contentstack from "contentstack";
import dotenv from "dotenv";

// Load environment variables from .env if not already loaded
dotenv.config();

// Validate required environment variables
const requiredVars = [
  "CONTENTSTACK_API_KEY",
  "CONTENTSTACK_DELIVERY_TOKEN",
  "CONTENTSTACK_ENVIRONMENT",
  // "CONTENTSTACK_REGION", // Recommended to be set in your .env file, e.g., 'eu'
];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

// Initialize Contentstack Stack
const Stack = contentstack.Stack({
  api_key: process.env.CONTENTSTACK_API_KEY,
  delivery_token: process.env.CONTENTSTACK_DELIVERY_TOKEN,
  environment: process.env.CONTENTSTACK_ENVIRONMENT,
  region: process.env.CONTENTSTACK_REGION, // Set region from env, e.g., 'eu'
});

// The host is set automatically by the SDK when a region is provided,
// so the setHost call is not needed.

export default Stack;
