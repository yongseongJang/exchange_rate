import { useState, useEffect } from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import en from "@/locales/en.json";
import ko from "@/locales/ko.json";
import jp from "@/locales/jp.json";
import cn from "@/locales/cn.json";
import { DotLoading } from "@/components";
import { darkColors, lightColors } from "@/theme";
import "react-native-gesture-handler";

const resources = {
  en: {
    translation: en,
  },
  ko: {
    translation: ko,
  },
  jp: {
    translation: jp,
  },
  cn: {
    translation: cn,
  },
};
export default function Index() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === "light");

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const isDone = await AsyncStorage.getItem("initial_done");
      if (isDone) {
        // router.replace("/initials/guide");
        router.replace("/rate");
      } else {
        router.replace("/initials/guide");
      }
    };

    const initI18n = async () => {
      i18n.use(initReactI18next).init({
        resources,
        lng:
          (await AsyncStorage.getItem("lang")) ||
          Localization.locale.split("-")[0],
        fallbackLng: "en",
        supportedLngs: ["en", "ko", "jp", "cn"],
        compatibilityJSON: "v4",
        interpolation: {
          escapeValue: false,
        },
      });

      i18n.on("languageChanged", (lng) => {
        AsyncStorage.setItem("lang", lng);
      });
    };

    initI18n().finally(() =>
      checkFirstLaunch().finally(() => setIsLoading(false))
    );
  }, []);

  if (isLoading)
    return (
      <View style={styles.container}>
        <DotLoading />
      </View>
    );
  return null;
}
const createStyles = (isLight: boolean) => {
  const colors = isLight ? lightColors : darkColors;
  return StyleSheet.create({
    container: {
      height: "100%",
      backgroundColor: colors.common.backgroundColor,
      justifyContent: "center",
    },
  });
};
