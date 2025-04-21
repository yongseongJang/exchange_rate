import { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  useColorScheme,
} from "react-native";
import { Stack, useRouter, usePathname } from "expo-router";
import * as Location from "expo-location";
import { useTranslation } from "react-i18next";
import { DotLoading } from "@/components";
import { CurrencyContext, initialCurrencyContextValue } from "@/contexts";
import { flagToCode } from "@/constants";
import { darkColors, lightColors } from "@/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

const requestLocationPermission = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === "granted";
};

const getUserCountryCode = async () => {
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Highest,
  });
  const geocode = await Location.reverseGeocodeAsync(location.coords);

  if (Array.isArray(geocode) && geocode.length > 0) {
    return geocode[0].isoCountryCode?.toLowerCase();
  }

  throw new Error("Failed to get country code");
};

const setupInitialCounterCurrency = async () => {
  const permissionGranted = await requestLocationPermission();
  if (permissionGranted) {
    try {
      const countryCode = await getUserCountryCode();
      if (countryCode) {
        if (flagToCode[countryCode]) {
          return { code: flagToCode[countryCode], flag: countryCode };
        } else {
          return { code: "EUR", flag: "eu" };
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
};

export default function InitialLayout() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === "light");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { currencyContextValue, updateCurrencyContextValue } =
    useContext(CurrencyContext);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <DotLoading />
      </View>
    );
  }

  const handleBtnPress = () => {
    if (pathname === "/initials/guide") {
      setIsLoading(true);
      setupInitialCounterCurrency()
        .then((currency) => {
          updateCurrencyContextValue({ counterCurrency: currency });
        })
        .finally(() => {
          setIsLoading(false);
          router.replace("/initials/counter");
        });
    } else if (pathname === "/initials/counter") {
      const baseCurrencies = initialCurrencyContextValue.baseCurrencies.filter(
        (baseCurrency) =>
          baseCurrency.code !== currencyContextValue.counterCurrency.code
      );
      updateCurrencyContextValue({ baseCurrencies });
      AsyncStorage.setItem(
        "counterCurrency",
        JSON.stringify(currencyContextValue.counterCurrency)
      );
      router.replace("/initials/base");
    } else {
      AsyncStorage.setItem(
        "baseCurrencies",
        JSON.stringify(currencyContextValue.baseCurrencies)
      );
      AsyncStorage.setItem("initial_done", "true");
      router.replace("/rate");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="base" />
          <Stack.Screen name="counter" />
        </Stack>
      </View>
      <View style={styles.footer}>
        <Pressable style={styles.button} onPress={handleBtnPress}>
          <Text style={styles.buttonText}>
            {pathname === "/initials/guide" ? t("continue") : t("next")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
const createStyles = (isLight: boolean) => {
  const colors = isLight ? lightColors : darkColors;
  return StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.common.backgroundColor,
    },
    body: {
      width: "100%",
      height: "85%",
    },
    footer: {
      width: "100%",
      height: "15%",
      alignItems: "center",
      justifyContent: "center",
    },
    button: {
      backgroundColor: colors.common.primaryColor,
      paddingVertical: 12,
      paddingHorizontal: 32,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 100,
      width: "90%",
    },
    buttonText: {
      color: colors.common.secondaryColor,
      fontSize: 14,
      textAlign: "center",
    },
  });
};
