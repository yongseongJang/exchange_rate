import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Constants from "expo-constants";

const apiKey = Constants.expoConfig?.extra?.EXCONVERT_API_KEY;
const apiUrl = Constants.expoConfig?.extra?.EXCONVERT_API_URL;

export const QUERY_KEYS = {
  FETCH_ALL: "FETCH_ALL",
  FETCH_ONE: "FETCH_ONE",
};

export const useFetchAllQuery = (baseCode: string) => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: [QUERY_KEYS.FETCH_ALL, baseCode],
    queryFn: async () => {
      const response = await axios(
        `${apiUrl}/fetchAll?access_key=${apiKey}&from=${baseCode}`
      );

      return response.data;
    },
    retry: false,
  });

  return { isLoading, isError, error, data };
};

export const useFetchOneQuery = (baseCode: string, targetCode: string) => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: [QUERY_KEYS.FETCH_ONE, baseCode, targetCode],
    queryFn: async () => {
      if (baseCode === targetCode)
        return { base: baseCode, ms: 0, result: { [targetCode]: 1 } };
      const response = await axios(
        `${apiUrl}/fetchOne?access_key=${apiKey}&from=${baseCode}&to=${targetCode}`
      );

      return response.data;
    },
    retry: false,
  });

  return { isLoading, isError, error, data };
};
