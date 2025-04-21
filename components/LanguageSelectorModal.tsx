import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  useColorScheme,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Portal } from "react-native-portalize";
import AntDesign from "@expo/vector-icons/AntDesign";
import { lightColors, darkColors } from "@/theme";
import { convertLanguage } from "@/utils";

interface LanguageSelectorModalProps {
  closeModal: () => void;
}

export default function LanguageSelectorModalProps({
  closeModal,
}: LanguageSelectorModalProps) {
  const [t] = useTranslation();
  const { i18n } = useTranslation();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === "light");

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
          <Text style={styles.text}>{t("language")}</Text>
        </View>
        <View style={styles.modalContent}>
          <FlatList
            data={["ko", "cn", "en", "jp"]}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={
                  i18n.language === item ? styles.selectedItem : styles.item
                }
                onPress={() => {
                  i18n.changeLanguage(item);
                  closeModal();
                }}
              >
                <Text style={styles.text}>{t(`${convertLanguage(item)}`)}</Text>
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
    text: {
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
