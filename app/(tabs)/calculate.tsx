import { useState, useLayoutEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Pressable,
  useColorScheme,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { evaluate } from "mathjs";
import { CounterCurrencySelectorModal, DotLoading } from "@/components";
import { CurrencyContext } from "@/contexts";
import { flagImageMap } from "@/constants";
import type { CounterCurrency, BaseCurrency } from "@/types";
import { useFetchOneQuery } from "@/queries";
import { darkColors, lightColors } from "@/theme";

const rows = [
  ["C", "", "switch", "\u00F7"],
  ["6", "8", "9", "\u00D7"],
  ["3", "5", "6", "-"],
  ["0", "2", "3", "+"],
  [".", "0", "delete", "="],
];

const getIcon = (item: string, color: string) => {
  switch (item) {
    case "+":
      return <FontAwesome5 name="plus" size={10} color={color} />;
    case "-":
      return <FontAwesome5 name="minus" size={10} color={color} />;
    case "\u00D7":
      return <FontAwesome5 name="times" size={10} color={color} />;
    case "\u00F7":
      return <FontAwesome5 name="divide" size={10} color={color} />;
    case "=":
      return <FontAwesome5 name="equals" size={10} color={color} />;
    case "delete":
      return <FontAwesome5 name="arrow-left" size={10} color={color} />;
    case "switch":
      return <FontAwesome5 name="exchange-alt" size={10} color={color} />;
    default:
      return null;
  }
};

export default function CalculateScreen() {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === "light");
  const [isBaseModalVisible, setIsBaseModalVisible] = useState<boolean>(false);
  const [isCounterModalVisible, setIsCounterModalVisible] =
    useState<boolean>(false);
  const [expression, setExpression] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [baseCurrency, setBaseCurrency] = useState<
    Omit<BaseCurrency, "isSelected">
  >({
    code: "USD",
    flag: "us",
  });
  const [counterCurrency, setCounterCurrency] = useState<CounterCurrency>({
    code: "KRW",
    flag: "kr",
  });
  const { currencyContextValue } = useContext(CurrencyContext);

  useLayoutEffect(() => {
    setBaseCurrency(currencyContextValue.baseCurrencies[0]);
    setCounterCurrency(currencyContextValue.counterCurrency);
  }, [
    currencyContextValue.counterCurrency,
    currencyContextValue.baseCurrencies,
  ]);

  const { isLoading, isError, error, data } = useFetchOneQuery(
    baseCurrency.code,
    counterCurrency.code
  );

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

  const handleBtnPress = (value: string) => {
    switch (value) {
      case "switch":
        setBaseCurrency(counterCurrency);
        setCounterCurrency(baseCurrency);
        setExpression("");
        setResult("");
        break;
      case "C":
        setExpression("");
        setResult("");
        break;
      case "delete":
        if (expression.length) {
          if (expression === "0.") {
            setExpression("");
          } else {
            setExpression((expression) =>
              expression.slice(0, expression.length - 1)
            );
            setResult("");
          }
        }
        break;
      case "=":
        if (
          expression &&
          Number.isInteger(Number(expression.charAt(expression.length - 1)))
        ) {
          try {
            let replacedExpression = expression
              .replace(/\u00F7/g, "/")
              .replace(/\u00D7/g, "*");
            const evalResult = evaluate(replacedExpression);
            setExpression(String(evalResult));
            setResult(evalResult.toFixed(4));
          } catch (e) {
            setExpression("");
            setResult("");
          }
        }
        break;
      default:
        if (Number.isInteger(Number(value))) {
          if (expression === "0") {
            setExpression(value);
            setResult("");
          } else {
            setExpression((expression) => expression + value);
            setResult("");
          }
        } else {
          if (expression.length) {
            if (
              ["+", "-", "\u00D7", "\u00F7", "."].includes(
                expression.charAt(expression.length - 1)
              )
            ) {
              if (value === ".") return;

              setExpression(
                (expression) =>
                  expression.slice(0, expression.length - 1) + value
              );
              setResult("");
              return;
            }

            if (value === ".") {
              for (let i = expression.length - 2; i >= 0; i--) {
                if (Number.isInteger(Number(expression.charAt(i)))) {
                  continue;
                } else if (expression.charAt(i) === ".") {
                  return;
                } else {
                  break;
                }
              }
              setExpression((expression) => expression + ".");
              setResult("");
            } else {
              setExpression((expression) => expression + value);
              setResult("");
            }
          } else {
            if (value === ".") {
              setExpression("0.");
              setResult("");
            }
          }
        }
        break;
    }
  };

  const handleBaseCurrencyChange = (currency: CounterCurrency) => {
    setBaseCurrency(currency);
  };

  const handleCounterCurrencyChange = (currency: CounterCurrency) => {
    setCounterCurrency(currency);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={[styles.currencyAmountContainer, { marginBottom: 10 }]}>
          <Currency
            currency={baseCurrency}
            openModal={() => setIsBaseModalVisible(true)}
          />
          <Text style={styles.currencyAmount}>
            {result ? `${result} ${result && baseCurrency.code}` : expression}
          </Text>
        </View>
        <View style={styles.currencyAmountContainer}>
          <Currency
            currency={counterCurrency}
            openModal={() => setIsCounterModalVisible(true)}
          />
          <Text style={styles.currencyAmount}>{`${
            result &&
            (Number(result) * data.result[counterCurrency.code]).toFixed(4)
          } ${result && counterCurrency.code}`}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection: "row" }}>
            {row.map((item, colIndex) => {
              const icon = getIcon(
                item,
                colorScheme === "light" ? "black" : "white"
              );

              return (
                <TouchableOpacity
                  key={colIndex}
                  style={[
                    styles.item,
                    ["+", "-", "\u00D7", "\u00F7", "="].includes(item) &&
                      styles.iconItem,
                  ]}
                  onPress={() => handleBtnPress(item)}
                >
                  {icon || <Text style={styles.text}>{item}</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
      {isBaseModalVisible && (
        <CounterCurrencySelectorModal
          selectedCurrencyCode={baseCurrency.code}
          closeModal={() => setIsBaseModalVisible(false)}
          onCurrencyPress={handleBaseCurrencyChange}
        />
      )}
      {isCounterModalVisible && (
        <CounterCurrencySelectorModal
          selectedCurrencyCode={counterCurrency.code}
          closeModal={() => setIsCounterModalVisible(false)}
          onCurrencyPress={handleCounterCurrencyChange}
        />
      )}
    </View>
  );
}

interface CurrencyProps {
  currency: CounterCurrency | Omit<BaseCurrency, "isSelected">;
  openModal: () => void;
}

const Currency = ({ currency, openModal }: CurrencyProps) => {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === "light");
  return (
    <Pressable style={styles.currencyWrapper} onPress={openModal}>
      <View style={styles.flagWrapper}>
        <Image style={styles.flag} source={flagImageMap[currency.flag]} />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.text}>{currency.code}</Text>
        <AntDesign
          style={{ marginLeft: 5 }}
          name="caretdown"
          size={12}
          color={colorScheme === "light" ? "black" : "white"}
        />
      </View>
    </Pressable>
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
      backgroundColor: colors.CalculateScreen.backgroundColor,
      justifyContent: "space-between",
      height: "100%",
    },
    topSection: {
      marginTop: 10,
      justifyContent: "center",
      backgroundColor: colors.common.backgroundColor,
      borderRadius: 8,
      borderColor: colors.common.borderColor,
      borderWidth: 1,
      marginHorizontal: 5,
      paddingVertical: 5,
    },
    currencyAmountContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 5,
    },
    currencyWrapper: {
      alignItems: "center",
    },
    buttonContainer: {
      marginHorizontal: "auto",
      width: "100%",
      justifyContent: "flex-end",
    },
    item: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      maxWidth: "25%",
      padding: 10,
      borderWidth: 1.5,
      borderRadius: 5,
      borderColor: colors.common.borderColor,
      backgroundColor: colors.common.backgroundColor,
    },
    iconItem: {
      backgroundColor: colors.common.primaryColor,
    },
    mergedItem: {
      flex: 4,
      maxWidth: "50%",
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
    currencyAmount: {
      flex: 1,
      textAlign: "right",
      fontWeight: "bold",
      fontSize: 20,
      alignItems: "center",
      color: colors.common.color,
    },
    text: {
      color: colors.common.color,
    },
  });
};
