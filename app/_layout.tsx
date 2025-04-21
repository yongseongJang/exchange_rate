import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { Host } from "react-native-portalize";
import { CurrencyContextProvider } from "@/contexts";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default function RootLayout() {
  return (
    <ReactQueryProvider>
      <CurrencyContextProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Host>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            ></Stack>
          </Host>
        </GestureHandlerRootView>
      </CurrencyContextProvider>
    </ReactQueryProvider>
  );
}
