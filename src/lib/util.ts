const devConfig = {
  apiBaseUrl: "https://windseekerapp.ddns.net",
  debugMode: true,
};

const prodConfig = {
  apiBaseUrl: "https://windseekerapp.ddns.net",
  debugMode: false,
};

const config = process.env.NODE_ENV === "production" ? prodConfig : devConfig;

export default config;