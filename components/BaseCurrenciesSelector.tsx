import { useContext, useCallback } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  useColorScheme,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useSearchCurrency } from "@/hooks";
import { CurrencyContext } from "@/contexts";
import { BaseCurrencySelectorItem } from "@/components";
import type { BaseCurrency } from "@/types";
import { darkColors, lightColors } from "@/theme";

export default function BaseCurrenciesSelector() {
  const [searchWord, searchedCurrencies, handleSearchWordChange] =
    useSearchCurrency();
  const { currencyContextValue, updateCurrencyContextValue } =
    useContext(CurrencyContext);
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === "light");

  const handleCheckBoxPress = useCallback(
    (isChecked: boolean, item: BaseCurrency) => {
      if (isChecked) {
        const baseCurrencies = [
          item,
          ...currencyContextValue.baseCurrencies,
        ].sort((a, b) => a.flag.localeCompare(b.flag));
        updateCurrencyContextValue({ baseCurrencies });
      } else {
        currencyContextValue.baseCurrencies.forEach((currency, index) => {
          if (currency.flag === item.flag) {
            const baseCurrencies = [...currencyContextValue.baseCurrencies];
            baseCurrencies.splice(index, 1);
            updateCurrencyContextValue({ baseCurrencies });
          }
        });
      }
    },
    [currencyContextValue.baseCurrencies]
  );

  return (
    <>
      <View style={styles.inputWrapper}>
        <AntDesign
          style={{ marginLeft: 5 }}
          name="search1"
          size={12}
          color="black"
        />
        <TextInput
          style={styles.input}
          value={searchWord}
          onChangeText={handleSearchWordChange}
        />
      </View>
      <View style={styles.items}>
        <FlatList
          data={searchedCurrencies}
          keyExtractor={(item) => item.flag}
          renderItem={({ item }) => {
            if (item.code === currencyContextValue.counterCurrency.code) return;
            const isChecked = currencyContextValue.baseCurrencies.some(
              (currency) => currency.code === item.code
            );
            return (
              <BaseCurrencySelectorItem
                isChecked={isChecked}
                item={item}
                onValueChange={handleCheckBoxPress}
              />
            );
          }}
        />
      </View>
    </>
  );
}

const createStyles = (isLight: boolean) => {
  const colors = isLight ? lightColors : darkColors;
  return StyleSheet.create({
    inputWrapper: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.common.secondaryColor,
      borderRadius: 12,
      width: "90%",
      paddingHorizontal: 10,
      marginVertical: 5,
    },
    input: {
      padding: 5,
      width: "100%",
    },
    items: {
      width: "100%",
      height: "60%",
      marginVertical: 5,
    },
  });
};
