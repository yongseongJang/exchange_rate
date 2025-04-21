import { useState } from "react";
import { currencies } from "@/constants";
import type { CounterCurrency, BaseCurrency } from "@/types";

const useSearchCurrency = (): [
  searchWord: string,
  searchedCurrencies: CounterCurrency[] | BaseCurrency[],
  handleSearchWordChange: (word: string) => void
] => {
  const [searchWord, setSearchWord] = useState<string>("");
  const [searchedCurrencies, setSearchedCurrencies] = useState<
    CounterCurrency[] | BaseCurrency[]
  >(currencies);

  const handleSearchWordChange = (word: string) => {
    setSearchWord(word);
    if (word) {
      const filteredCurrencies = currencies.filter((currency) =>
        currency.code.startsWith(word.toUpperCase())
      );
      setSearchedCurrencies(filteredCurrencies);
    } else {
      setSearchedCurrencies(currencies);
    }
  };

  return [searchWord, searchedCurrencies, handleSearchWordChange];
};

export default useSearchCurrency;
