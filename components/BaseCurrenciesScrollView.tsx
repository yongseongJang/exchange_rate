import { useContext } from "react";
import { CurrencyContext } from "@/contexts";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Pressable,
  useColorScheme,
} from "react-native";
import { flagImageMap } from "@/constants";
import Feather from "@expo/vector-icons/Feather";
import { lightColors, darkColors } from "@/theme";

export default function BaseCurrenciesScrollView() {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === "light");
  const { currencyContextValue, updateCurrencyContextValue } =
    useContext(CurrencyContext);

  const handleDeleteBtnPress = (code: string) => {
    currencyContextValue.baseCurrencies.forEach((currency, index) => {
      if (currency.code === code) {
        updateCurrencyContextValue({
          baseCurrencies: [
            ...currencyContextValue.baseCurrencies.slice(0, index),
            ...currencyContextValue.baseCurrencies.slice(index + 1),
          ],
        });
      }
    });
  };
  return (
    <View style={styles.selectedCurrenciesContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {Array.isArray(currencyContextValue.baseCurrencies) &&
          [...currencyContextValue.baseCurrencies]
            .sort((a, b) => a.code.localeCompare(b.code))
            .map((currency) => (
              <View
                style={styles.selectedCurrenciesWrapper}
                key={currency.code}
              >
                <View style={styles.flagWrapper}>
                  <Image
                    style={styles.flag}
                    source={flagImageMap[currency.flag]}
                  />
                </View>
                <Pressable
                  style={styles.deleteBtn}
                  onPress={() => handleDeleteBtnPress(currency.code)}
                >
                  <Feather
                    style={styles.deleteImage}
                    name="x-circle"
                    size={12}
                    color={colorScheme === "light" ? "#4d5054" : "white"}
                  />
                </Pressable>
              </View>
            ))}
      </ScrollView>
    </View>
  );
}

const createStyles = (isLight: boolean) => {
  const colors = isLight ? lightColors : darkColors;
  return StyleSheet.create({
    selectedCurrenciesContainer: {
      width: "90%",
      marginTop: 10,
      marginHorizontal: 20,
    },
    flagWrapper: {
      marginHorizontal: 3,
      marginVertical: 10,
    },
    flag: {
      borderWidth: 1,
      borderRadius: 3,
      borderColor: "transparent",
      height: 30,
    },
    selectedCurrenciesWrapper: {
      position: "relative",
    },
    deleteBtn: {
      position: "absolute",
      top: 5,
      right: 0,
      zIndex: 10,
    },
    deleteImage: {
      backgroundColor: colors.common.backgroundColor,
      borderBottomLeftRadius: 10,
    },
  });
};
