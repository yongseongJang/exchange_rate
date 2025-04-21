import { useState, createContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CounterCurrency, BaseCurrency } from "@/types";

export interface CurrencyContextValue {
  counterCurrency: CounterCurrency;
  baseCurrencies: BaseCurrency[];
}

interface CurrencyContext {
  currencyContextValue: CurrencyContextValue;
  updateCurrencyContextValue: (value: Partial<CurrencyContextValue>) => void;
}

export const initialCurrencyContextValue: CurrencyContextValue = {
  counterCurrency: { code: "KRW", flag: "kr" },
  baseCurrencies: [
    { code: "CNY", flag: "cn", isSelected: false },
    { code: "EUR", flag: "eu", isSelected: false },
    { code: "GBP", flag: "gb", isSelected: false },
    { code: "JPY", flag: "jp", isSelected: false },
    { code: "KRW", flag: "kr", isSelected: false },
    { code: "USD", flag: "us", isSelected: false },
  ],
};

export const CurrencyContext = createContext<CurrencyContext>({
  currencyContextValue: initialCurrencyContextValue,
  updateCurrencyContextValue: (value: Partial<CurrencyContextValue>) => {},
});

export const CurrencyContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currencyContextValue, setCurrencyContextValue] =
    useState<CurrencyContextValue>(initialCurrencyContextValue);

  const updateCurrencyContextValue = (value: Partial<CurrencyContextValue>) => {
    setCurrencyContextValue((currencyContextValue) => ({
      ...currencyContextValue,
      ...value,
    }));

    if ("counterCurrency" in value) {
      AsyncStorage.setItem(
        "counterCurrency",
        JSON.stringify(value.counterCurrency)
      );
    } else if ("baseCurrencies" in value) {
      AsyncStorage.setItem(
        "baseCurrencies",
        JSON.stringify(value.baseCurrencies)
      );
    }
  };

  return (
    <CurrencyContext.Provider
      value={{ currencyContextValue, updateCurrencyContextValue }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
