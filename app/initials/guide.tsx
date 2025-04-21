import { StyleSheet, View, Text, useColorScheme } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useTranslation } from "react-i18next";
import { lightColors, darkColors } from "@/theme";

export default function GuideScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === "light");

  return (
    <View style={styles.container}>
      <FontAwesome6
        name="map-location-dot"
        size={60}
        color={
          colorScheme === "light"
            ? lightColors.common.primaryColor
            : darkColors.common.primaryColor
        }
      />
      <Text style={styles.notice}>{t("Guide.message")}</Text>
    </View>
  );
}

const createStyles = (isLight: boolean) => {
  const colors = isLight ? lightColors : darkColors;

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.common.backgroundColor,
    },
    notice: {
      marginTop: 30,
      marginHorizontal: 20,
      color: colors.common.color,
    },
  });
};
