import { useContext, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  useColorScheme,
} from "react-native";
import { CurrencyContext } from "@/contexts";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useFetchAllQuery } from "@/queries";
import { DotLoading, DraggableItem } from "@/components";
import { flagImageMap } from "@/constants";
import type { BaseCurrency } from "@/types";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { darkColors, lightColors } from "@/theme";
import { useSharedValue } from "react-native-reanimated";

const RateScreen = () => {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === "light");
  const { currencyContextValue, updateCurrencyContextValue } =
    useContext(CurrencyContext);
  const positions = useSharedValue(
    currencyContextValue.baseCurrencies.map((_, i) => i)
  );

  const { isLoading, isError, error, data } = useFetchAllQuery(
    currencyContextValue.counterCurrency.code
  );

  const handleDragEnd = (index, newY) => {
    const newIndex = Math.round(newY / 60);
    if (newIndex !== index) {
      const newData = [...currencyContextValue.baseCurrencies];
      const movedItem = newData.splice(index, 1)[0];
      newData.splice(newIndex, 0, movedItem);
      updateCurrencyContextValue({ baseCurrencies: newData });
      positions.value = newData.map((_, i) => i);
    }
  };

  const ratesMap = useMemo(() => {
    const map = new Map();
    if (data && data.result && Array.isArray(Object.keys(data.result))) {
      Object.keys(data.result)?.forEach((code: string) => {
        map.set(code, Number((1 / Number(data.result[code])).toFixed(4)));
      });
    }

    return map;
  }, [data]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <DotLoading />
      </View>
    );
  }

  if (isError) {
    throw error;
  }

  const handleItemPress = (item: BaseCurrency, index: number | undefined) => {
    if (typeof index === "number") {
      const { baseCurrencies } = currencyContextValue;
      const newBaseCurrencies = [
        ...baseCurrencies.slice(0, index),
        {
          ...baseCurrencies[index],
          isSelected: !item.isSelected,
        },
        ...baseCurrencies.slice(index + 1),
      ];
      updateCurrencyContextValue({ baseCurrencies: newBaseCurrencies });
    }
  };

  return (
    <View style={styles.container}>
      <DraggableFlatList
        data={currencyContextValue.baseCurrencies}
        onDragEnd={({ data }) =>
          updateCurrencyContextValue({ baseCurrencies: [...data] })
        }
        keyExtractor={(item) => item.code}
        renderItem={({
          item,
          drag,
          isActive,
          getIndex,
        }: RenderItemParams<BaseCurrency>) => (
          <ScaleDecorator>
            <Pressable
              onPress={() => handleItemPress(item, getIndex())}
              onLongPress={drag}
              delayLongPress={150}
              android_ripple={null}
              style={[styles.itemContainer, isActive && styles.activeItem]}
            >
              <View style={styles.row}>
                <FontAwesome6
                  name="equals"
                  size={24}
                  color={colorScheme === "light" ? "black" : "white"}
                />
                <View style={styles.currencyWrapper}>
                  <View style={styles.flagWrapper}>
                    <Image
                      style={styles.flag}
                      source={flagImageMap[item.flag]}
                    />
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.text}>{item.code}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.itemRow}>
                {item.isSelected ? (
                  <>
                    <Text style={styles.counterCurrencyText}>{`${data.result[
                      item.code
                    ].toFixed(4)} ${item.code} `}</Text>
                    <Text
                      style={styles.baseCurrencyText}
                    >{`= 1 ${currencyContextValue.counterCurrency.code}`}</Text>
                  </>
                ) : (
                  <>
                    <Text
                      style={styles.baseCurrencyText}
                    >{`1 ${item.code} = `}</Text>
                    <Text style={styles.counterCurrencyText}>{`${ratesMap.get(
                      item.code
                    )} ${currencyContextValue.counterCurrency.code}`}</Text>
                  </>
                )}
              </View>
            </Pressable>
          </ScaleDecorator>
        )}
      />
    </View>
  );
};

const createStyles = (isLight: boolean) => {
  const colors = isLight ? lightColors : darkColors;
  return StyleSheet.create({
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.common.backgroundColor,
    },
    container: {
      flex: 1,
      backgroundColor: colors.RateScreen.backgroundColor,
    },
    itemContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.common.backgroundColor,
      borderRadius: 8,
      borderColor: colors.common.borderColor,
      borderWidth: 1,
      padding: 5,
      marginHorizontal: 10,
      marginVertical: 2,
    },
    activeItem: {
      backgroundColor: colors.common.primaryColor,
      transform: [{ scale: 1.03 }],
    },
    counterCurrencyText: {
      fontSize: 16,
      color: colors.common.color,
    },
    baseCurrencyText: {
      marginTop: 5,
      fontSize: 11,
      color: colors.RateScreen.baseCurrencyTextColor,
    },
    currencyWrapper: {
      alignItems: "center",
      marginLeft: 10,
      marginTop: 5,
    },
    flagWrapper: {
      marginHorizontal: 3,
    },
    flag: {
      borderWidth: 1,
      borderRadius: 3,
      borderColor: colors.common.backgroundColor,
      width: 40,
      height: 30,
    },
    row: { flexDirection: "row", alignItems: "center" },
    itemRow: { flexDirection: "row", alignItems: "center", paddingRight: 5 },
    text: { color: colors.common.color },
  });
};

export default gestureHandlerRootHOC(RateScreen);
