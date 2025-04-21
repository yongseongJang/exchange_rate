import { useState, useContext, useCallback } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  useColorScheme,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useTranslation } from "react-i18next";
import { CounterCurrencySelectorModal } from "@/components";
import { CurrencyContext } from "@/contexts";
import { flagImageMap } from "@/constants";
import type { CounterCurrency } from "@/types";
import { darkColors, lightColors } from "@/theme";

export default function CounterCurrencyScreen() {
  const [t] = useTranslation();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === "light");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { currencyContextValue, updateCurrencyContextValue } =
    useContext(CurrencyContext);

  const handleCurrencyPress = () => {
    setIsModalVisible(true);
  };

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const handleCurrencyChange = (currency: CounterCurrency) => {
    updateCurrencyContextValue({ counterCurrency: currency });
  };

  return (
    <View style={{ height: "100%" }}>
      <View style={styles.body}>
        <Text style={styles.label}>{t("counter currency")}</Text>
        <TouchableOpacity
          style={styles.currencyWrapper}
          onPress={handleCurrencyPress}
        >
          <Image
            style={styles.flag}
            source={flagImageMap[currencyContextValue.counterCurrency.flag]}
          />
          <Text style={styles.currencyText}>
            {currencyContextValue.counterCurrency.code}
          </Text>
          <AntDesign
            style={{ marginLeft: 5 }}
            name="caretdown"
            size={12}
            color={colorScheme === "light" ? "black" : "white"}
          />
        </TouchableOpacity>
      </View>
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
    body: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.common.backgroundColor,
    },
    label: {
      fontSize: 20,
      color: colors.common.color,
      marginBottom: 10,
    },
    currencyWrapper: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    currencyText: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.common.color,
      marginLeft: 5,
    },
    flag: {
      borderWidth: 1,
      borderRadius: 3,
      borderColor: colors.common.backgroundColor,
      width: 40,
      height: 30,
    },
  });
};
