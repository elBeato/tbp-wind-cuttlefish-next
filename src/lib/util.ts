const devConfig = {
  apiBaseUrl: "http://localhost:5050",
  debugMode: true,
};

const prodConfig = {
  apiBaseUrl: "https://elbeatoserverrealp.tailc1c195.ts.net",
  debugMode: false,
};

const config = process.env.NODE_ENV === "production" ? prodConfig : devConfig;

export default config;