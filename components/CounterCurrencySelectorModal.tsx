import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  useColorScheme,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Portal } from "react-native-portalize";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useSearchCurrency } from "@/hooks";
import { flagImageMap } from "@/constants";
import { lightColors, darkColors } from "@/theme";
import type { CounterCurrency } from "@/types";

interface CounterCurrencySelectorModalProps {
  selectedCurrencyCode: string;
  closeModal: () => void;
  onCurrencyPress: (currency: CounterCurrency) => void;
}

export default function CounterCurrencySelectorModal({
  selectedCurrencyCode,
  closeModal,
  onCurrencyPress,
}: CounterCurrencySelectorModalProps) {
  const [t] = useTranslation();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === "light");
  const [searchWord, searchedCurrencies, handleSearchWordChange] =
    useSearchCurrency();

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
          <FlatList
            data={searchedCurrencies}
            keyExtractor={(item) => item.flag}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={
                  selectedCurrencyCode === item.code
                    ? styles.selectedItem
                    : styles.item
                }
                onPress={() => {
                  onCurrencyPress(item);
                  closeModal();
                }}
              >
                <Image style={styles.flag} source={flagImageMap[item.flag]} />
                <Text style={styles.currencyText}>{item.code}</Text>
              </TouchableOpacity>
            )}
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
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    selectedItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: colors.common.primaryColor,
    },
    currencyText: {
      marginLeft: 10,
      color: colors.common.color,
    },
    flag: {
      borderWidth: 1,
      borderRadius: 3,
      borderColor: "transparent",
      width: 40,
      height: 30,
    },
  });
};
