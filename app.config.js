import "dotenv/config";

export default {
  expo: {
    name: "exchange_rate",
    slug: "exchange_rate",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.anonymous.exchange_rate",
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      EXCONVERT_API_URL: process.env.EXCONVERT_API_URL,
      EXCONVERT_API_KEY: process.env.EXCONVERT_API_KEY,
      APP_VERSION: process.env.APP_VERSION,
      eas: {
        projectId: "86903330-515d-4de5-a69c-c1078ce15b54",
      },
    },
  },
};
