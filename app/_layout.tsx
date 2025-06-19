import { useEffect } from "react";
import { ThemeProvider, DefaultTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { SQLiteProvider } from "expo-sqlite";

import { LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import {
  Fredoka_300Light,
  Fredoka_400Regular,
} from "@expo-google-fonts/fredoka";
import {
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_900Black,
} from "@expo-google-fonts/nunito";

import { DB_NAME } from "@/constants";
import { DatabaseProvider } from "@/providers/data-base";
import { UserProvider } from "@/providers/user";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    LuckiestGuy_400Regular,
    Fredoka_300Light,
    Fredoka_400Regular,
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_900Black,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SQLiteProvider
      databaseName={DB_NAME}
      options={{
        libSQLOptions: {
          url: process.env.EXPO_PUBLIC_TURSO_DB_URL!,
          authToken: process.env.EXPO_PUBLIC_TURSO_DB_AUTH_TOKEN!,
        },
      }}
    >
      <DatabaseProvider>
        <UserProvider>
          <GestureHandlerRootView>
            <ThemeProvider value={DefaultTheme}>
              <QueryClientProvider client={queryClient}>
                <Stack>
                  <Stack.Screen
                    name="index"
                    options={{ headerShown: false, animation: "fade" }}
                  />
                </Stack>
              </QueryClientProvider>
              <StatusBar style="auto" />
            </ThemeProvider>
          </GestureHandlerRootView>
        </UserProvider>
      </DatabaseProvider>
    </SQLiteProvider>
  );
}
