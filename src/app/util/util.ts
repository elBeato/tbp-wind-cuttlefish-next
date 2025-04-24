const devConfig = {
  apiBaseUrl: "http://localhost:5050",
  debugMode: true,
};

const prodConfig = {
  apiBaseUrl: "https://windseekerapp.ddns.net",
  debugMode: false,
};

// Use production settings when `NODE_ENV` is "production"
const config = process.env.NODE_ENV === "production" ? prodConfig : devConfig;

export default config;
