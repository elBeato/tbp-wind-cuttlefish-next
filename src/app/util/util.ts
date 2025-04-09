const devConfig = {
  apiBaseUrl: "http://localhost:5050",
  debugMode: true,
};

const prodConfig = {
  apiBaseUrl: "http://localhost:5050",
  debugMode: false,
};

// Use production settings when `NODE_ENV` is "production"
const config = process.env.NODE_ENV === "production" ? prodConfig : devConfig;

export default config;
