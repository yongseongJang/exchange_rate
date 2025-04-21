import { memo } from "react";
import {
  StyleSheet,
  Pressable,
  View,
  Image,
  Text,
  useColorScheme,
} from "react-native";
import Checkbox from "expo-checkbox";
import { flagImageMap } from "@/constants";
import type { BaseCurrency } from "@/types";
import { darkColors, lightColors } from "@/theme";

interface BaseCurrencySelectorItemProps {
  isChecked: boolean;
  item: BaseCurrency;
  onValueChange: (isChecked: boolean, item: BaseCurrency) => void;
}
const BaseCurrencySelectorItem = memo(
  ({ isChecked, item, onValueChange }: BaseCurrencySelectorItemProps) => {
    const colorScheme = useColorScheme();
    const styles = createStyles(colorScheme === "light");
    return (
      <Pressable
        style={({ pressed }) => [
          styles.itemContainer,
          pressed && styles.pressedItemContainer,
        ]}
        onPress={() => onValueChange(!isChecked, item)}
      >
        <Checkbox
          style={styles.checkbox}
          value={isChecked}
          color={
            isChecked
              ? colorScheme === "light"
                ? lightColors.common.primaryColor
                : darkColors.common.primaryColor
              : undefined
          }
          onValueChange={(isChecked: boolean) => onValueChange(isChecked, item)}
        />
        <View style={styles.flagWrapper} key={item.code}>
          <Image style={styles.flag} source={flagImageMap[item.flag]} />
        </View>
        <Text style={styles.label}>{item.code}</Text>
      </Pressable>
    );
  }
);

const createStyles = (isLight: boolean) => {
  const colors = isLight ? lightColors : darkColors;
  return StyleSheet.create({
    itemContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 30,
    },
    pressedItemContainer: {
      backgroundColor: colors.common.primaryColor,
    },
    checkbox: {
      marginRight: 5,
    },
    flagWrapper: {
      marginHorizontal: 3,
    },
    flag: {
      borderWidth: 1,
      borderRadius: 3,
      borderColor: "transparent",
      width: 40,
      height: 30,
    },
    label: { marginLeft: 5, color: colors.common.color },
  });
};

export default BaseCurrencySelectorItem;
