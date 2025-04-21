import { useLayoutEffect, useState, useCallback, useContext } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  Pressable,
  useColorScheme,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Tabs, usePathname } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CounterCurrencySelectorModal, MenuModal } from "@/components";
import { CurrencyContext } from "@/contexts";
import { flagImageMap } from "@/constants";
import { darkColors, lightColors } from "@/theme";
import type { CounterCurrency } from "@/types";

export default function TabLayout() {
  const [t] = useTranslation();
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === "light");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const { currencyContextValue, updateCurrencyContextValue } =
    useContext(CurrencyContext);

  useLayoutEffect(() => {
    const initializeCurrency = async () => {
      const counterCurrency = await AsyncStorage.getItem("counterCurrency");
      const baseCurrencies = await AsyncStorage.getItem("baseCurrencies");

      if (counterCurrency) {
        updateCurrencyContextValue({
          counterCurrency: JSON.parse(counterCurrency),
        });
      }
      if (baseCurrencies) {
        updateCurrencyContextValue({
          baseCurrencies: JSON.parse(baseCurrencies),
        });
      }
    };

    initializeCurrency();
  }, []);

  const handleCounterCurrencyPress = () => {
    setIsModalVisible(true);
  };

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const handleMenuPress = () => {
    setIsMenuVisible(true);
  };

  const closeMenu = useCallback(() => {
    setIsMenuVisible(false);
  }, []);

  const handleCurrencyChange = (currency: CounterCurrency) => {
    updateCurrencyContextValue({ counterCurrency: currency });
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.header, pathname === "/rate" && styles.currencyHeader]}
      >
        {pathname === "/rate" && (
          <Pressable onPress={handleCounterCurrencyPress}>
            <View style={styles.flagWrapper}>
              <Image
                style={styles.flag}
                source={flagImageMap[currencyContextValue.counterCurrency.flag]}
              />
              <Text style={styles.code}>
                {currencyContextValue.counterCurrency.code}
              </Text>
              <AntDesign
                style={{ marginLeft: 5 }}
                name="caretdown"
                size={10}
                color={
                  colorScheme === "light"
                    ? lightColors.common.color
                    : darkColors.common.color
                }
              />
            </View>
          </Pressable>
        )}
        <Ionicons
          name="menu-sharp"
          size={24}
          color={
            colorScheme === "light"
              ? lightColors.common.color
              : darkColors.common.color
          }
          onPress={handleMenuPress}
        />
      </View>
      <View style={styles.body}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor:
              colorScheme === "light"
                ? lightColors.common.primaryColor
                : darkColors.common.primaryColor,
            tabBarActiveBackgroundColor:
              colorScheme === "light"
                ? lightColors.common.backgroundColor
                : darkColors.common.backgroundColor,
            tabBarInactiveBackgroundColor:
              colorScheme === "light"
                ? lightColors.common.backgroundColor
                : darkColors.common.backgroundColor,
            headerTintColor: "black",
            tabBarStyle: {
              borderColor:
                colorScheme === "light"
                  ? lightColors.common.borderColor
                  : darkColors.common.borderColor,
            },
          }}
        >
          <Tabs.Screen
            name="rate"
            options={{
              title: t("rate"),
              tabBarIcon: ({ color }) => (
                <AntDesign name="profile" size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="calculate"
            options={{
              title: t("calculate"),
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? "calculator" : "calculator-outline"}
                  size={24}
                  color={color}
                />
              ),
            }}
          />
        </Tabs>
      </View>
      <MenuModal isVisible={isMenuVisible} closeModal={closeMenu} />
      {isModalVisible && (
        <CounterCurrencySelectorModal
          selectedCurrencyCode={currencyContextValue.counterCurrency.code}
          closeModal={closeModal}
          onCurrencyPress={handleCurrencyChange}
        />
      )}
    </View>
  );
}

const createStyles = (isLight: boolean) => {
  const colors = isLight ? lightColors : darkColors;
  return StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      backgroundColor: colors.common.backgroundColor,
    },
    header: {
      flexDirection: "row-reverse",
      width: "100%",
      height: 50,
      borderBottomWidth: 1,
      borderColor: colors.common.borderColor,
      padding: 10,
    },
    currencyHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    body: {
      flex: 1,
      width: "100%",
    },
    flagWrapper: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 3,
    },
    flag: {
      borderWidth: 1,
      borderRadius: 3,
      borderColor: colors.common.backgroundColor,
      width: 40,
      height: 30,
    },
    code: {
      fontSize: 13,
      textAlign: "center",
      marginLeft: 5,
      color: colors.common.color,
    },
  });
};
