import { useContext, useCallback } from "react";
import {
  StyleSheet,
  Modal,
  View,
  TextInput,
  FlatList,
  useColorScheme,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Portal } from "react-native-portalize";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useSearchCurrency } from "@/hooks";
import { CurrencyContext } from "@/contexts";
import {
  BaseCurrenciesScrollView,
  BaseCurrencySelectorItem,
} from "@/components";
import type { BaseCurrency } from "@/types";
import { darkColors, lightColors } from "@/theme";

interface BaseCurrenciesSelectorModalProps {
  closeModal: () => void;
}

export default function BaseCurrenciesSelectorModal({
  closeModal,
}: BaseCurrenciesSelectorModalProps) {
  const [t] = useTranslation();
  const [searchWord, searchedCurrencies, handleSearchWordChange] =
    useSearchCurrency();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === "light");

  const { currencyContextValue, updateCurrencyContextValue } =
    useContext(CurrencyContext);

  const handleCheckBoxPress = useCallback(
    (isChecked: boolean, item: BaseCurrency) => {
      if (isChecked) {
        const baseCurrencies = [...currencyContextValue.baseCurrencies, item];
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
    <Portal>
      <Modal transparent animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalHeader}>
          <AntDesign
            onPress={closeModal}
            name="left"
            size={20}
            color={colorScheme === "light" ? "black" : "white"}
          />
          <TextInput
            style={styles.input}
            placeholder={t("search")}
            placeholderTextColor={
              colorScheme === "light"
                ? lightColors.common.color
                : darkColors.common.color
            }
            value={searchWord}
            onChangeText={handleSearchWordChange}
          />
        </View>
        <View style={styles.modalContent}>
          <BaseCurrenciesScrollView />
          <FlatList
            data={searchedCurrencies}
            keyExtractor={(item) => item.flag}
            renderItem={({ item }) => {
              if (item.code === currencyContextValue.counterCurrency.code)
                return;
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
      </Modal>
    </Portal>
  );
}

const createStyles = (isLight: boolean) => {
  const colors = isLight ? lightColors : darkColors;
  return StyleSheet.create({
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      height: 50,
      backgroundColor: colors.common.backgroundColor,
      borderBottomWidth: 1,
      borderColor: colors.common.borderColor,
      paddingHorizontal: 10,
    },
    input: {
      marginLeft: 15,
      color: colors.common.color,
    },
    modalContent: {
      height: "93%",
      backgroundColor: colors.common.backgroundColor,
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
    },
  });
};
