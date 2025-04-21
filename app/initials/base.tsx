import { StyleSheet, View, Text, useColorScheme } from "react-native";
import { useTranslation } from "react-i18next";
import { BaseCurrenciesScrollView, BaseCurrenciesSelector } from "@/components";
import { darkColors, lightColors } from "@/theme";

export default function BaseCurrencyScreen() {
  const [t] = useTranslation();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === "light");
  return (
    <View style={styles.body}>
      <Text style={styles.label}>{t("base currencies")}</Text>
      <BaseCurrenciesScrollView />
      <BaseCurrenciesSelector />
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
    },
  });
};
