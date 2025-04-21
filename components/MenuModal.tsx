import { useEffect, useState, useContext, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Pressable,
  Animated,
  Dimensions,
  useColorScheme,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Portal } from "react-native-portalize";
import AntDesign from "@expo/vector-icons/AntDesign";
import Constants from "expo-constants";
import {
  CounterCurrencySelectorModal,
  BaseCurrenciesSelectorModal,
  LanguageSelectorModal,
} from "@/components";
import { CurrencyContext } from "@/contexts";
import type { CounterCurrency } from "@/types";
import { darkColors, lightColors } from "@/theme";
import { convertLanguage } from "@/utils";

const appVersion = Constants.expoConfig?.extra?.APP_VERSION;
const screenWidth = Dimensions.get("window").width;
const menuWidth = 220;

interface MenuModalProps {
  isVisible: boolean;
  closeModal: () => void;
}

const MenuModal = ({ isVisible, closeModal }: MenuModalProps) => {
  const [t] = useTranslation();
  const { i18n } = useTranslation();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === "light");
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const [isMenuModalVisible, setIsMenuModalVisible] = useState<boolean>(false);
  const [isCounterModalVisible, setIsCounterModalVisible] =
    useState<boolean>(false);
  const [isBaseModalVisible, setIsBaseModalVisible] = useState<boolean>(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] =
    useState<boolean>(false);

  const { currencyContextValue, updateCurrencyContextValue } =
    useContext(CurrencyContext);

  useEffect(() => {
    if (isVisible) {
      setIsMenuModalVisible(true);
      Animated.timing(slideAnim, {
        toValue: screenWidth - menuWidth,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenWidth,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setIsMenuModalVisible(false);
        setIsCounterModalVisible(false);
        setIsBaseModalVisible(false);
      });
    }
  }, [isVisible]);

  if (!isMenuModalVisible) return null;

  const handleCurrencyChange = (currency: CounterCurrency) => {
    updateCurrencyContextValue({ counterCurrency: currency });
  };

  return (
    <Portal>
      <Modal transparent animationType="none" onRequestClose={closeModal}>
        <View style={styles.container}>
          <Pressable style={styles.dimmedArea} onPress={closeModal} />
          <Animated.View style={[styles.modalArea, { left: slideAnim }]}>
            <View style={styles.modalHeader}>
              <AntDesign
                name="right"
                size={20}
                color={colorScheme === "light" ? "black" : "white"}
                onPress={closeModal}
              />
            </View>
            <View style={styles.modalBody}>
              <Pressable
                style={styles.menuItem}
                onPress={() => setIsCounterModalVisible(true)}
              >
                <Text style={styles.menuItemLabel}>
                  {t("counter currency")}
                </Text>
                <Text style={styles.menuItemValue}>
                  {currencyContextValue.counterCurrency.code}
                </Text>
              </Pressable>
              <Pressable
                style={styles.menuItem}
                onPress={() => setIsBaseModalVisible(true)}
              >
                <Text style={styles.menuItemLabel}>{t("base currencies")}</Text>
              </Pressable>
              <Pressable
                style={styles.menuItem}
                onPress={() => setIsLanguageModalVisible(true)}
              >
                <Text style={styles.menuItemLabel}>{t("language")}</Text>
                <Text style={styles.menuItemValue}>
                  {t(`${convertLanguage(i18n.language)}`)}
                </Text>
              </Pressable>
              <View style={styles.menuItem}>
                <Text style={styles.menuItemLabel}>{t("app version")}</Text>
                <Text style={styles.menuItemValue}>{appVersion}</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
      {isCounterModalVisible && (
        <CounterCurrencySelectorModal
          selectedCurrencyCode={currencyContextValue.counterCurrency.code}
          closeModal={() => setIsCounterModalVisible(false)}
          onCurrencyPress={handleCurrencyChange}
        />
      )}
      {isBaseModalVisible && (
        <BaseCurrenciesSelectorModal
          closeModal={() => setIsBaseModalVisible(false)}
        />
      )}
      {isLanguageModalVisible && (
        <LanguageSelectorModal
          closeModal={() => setIsLanguageModalVisible(false)}
        />
      )}
    </Portal>
  );
};

const createStyles = (isLight: boolean) => {
  const colors = isLight ? lightColors : darkColors;
  return StyleSheet.create({
    menuItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 3,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.common.borderColor,
    },
    menuItemLabel: {
      fontSize: 15,
      color: colors.common.color,
    },
    menuItemValue: {
      fontSize: 12,
      color: colors.common.primaryColor,
    },
    container: {
      flex: 1,
      flexDirection: "row",
    },
    dimmedArea: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    modalArea: {
      position: "absolute",
      top: 0,
      bottom: 0,
      width: menuWidth,
      backgroundColor: colors.common.backgroundColor,
    },
    modalHeader: {
      height: 50,
      borderBottomWidth: 1,
      borderColor: colors.common.borderColor,
      padding: 10,
      paddingLeft: 8,
      justifyContent: "center",
    },
    modalBody: {
      flex: 1,
    },
  });
};

export default MenuModal;
