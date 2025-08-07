import { Suspense, useEffect } from "react";
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
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import * as SQLite from "expo-sqlite";

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
import { StatusMessage } from "@/components/message-display";

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

  async function migrateAndSeed(db: SQLite.SQLiteDatabase) {
    // 1) Pull remote → local (best-effort)
    try {
      console.log("migrateAndSeed - Pulling remote changes...");
      await db.syncLibSQL();
      console.log("migrateAndSeed - Pull completed successfully.");
    } catch (e) {
      console.warn("migrateAndSeed - Initial pull failed:", e);
    }

    // 2) Migrate using PRAGMA user_version
    const { user_version } = await db.getFirstAsync<{ user_version: number }>(
      "PRAGMA user_version"
    );
    const targetVersion = 1;

    console.log("migrateAndSeed - Current user_version:", user_version);
    console.log("migrateAndSeed - Target user_version:", targetVersion);

    await db.withExclusiveTransactionAsync(async (txn) => {
      await txn.execAsync(`PRAGMA journal_mode = 'wal';`);

      if (user_version < 1) {
        console.log("migrateAndSeed - Running migrations...");
        await txn.execAsync(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          created_at INTEGER DEFAULT (strftime('%s','now') * 1000),
          updated_at INTEGER DEFAULT (strftime('%s','now') * 1000),
          user_name TEXT NOT NULL,
          password TEXT NOT NULL,
          CONSTRAINT user_user_name_idx UNIQUE (user_name)
        );
        CREATE TABLE IF NOT EXISTS scores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          created_at INTEGER DEFAULT (strftime('%s','now') * 1000),
          value INTEGER NOT NULL,
          user_id INTEGER REFERENCES users(id)
        );
      `);
        await txn.execAsync(`PRAGMA user_version = ${targetVersion};`);
        console.log("migrateAndSeed - Migrations completed.");
      }
    });

    // 3) Seed if empty (columns align with DDL)
    const { cnt } = await db.getFirstAsync<{ cnt: number }>(
      "SELECT COUNT(*) AS cnt FROM users"
    );
    if ((cnt ?? 0) === 0) {
      console.log("migrateAndSeed - Seeding initial data...");
      const ins = await db.runAsync(
        "INSERT INTO users(user_name, password) VALUES (?, ?)",
        "Guest",
        "guest"
      );
      console.log(
        "migrateAndSeed - Inserted user with ID:",
        ins.lastInsertRowId
      );
      await db.runAsync(
        "INSERT INTO scores(user_id, value) VALUES (?, ?)",
        ins.lastInsertRowId,
        100
      );
      console.log("migrateAndSeed - Initial data seeded.");
    }

    // 4) Push local → remote
    try {
      console.log("migrateAndSeed - Pushing local changes to remote...");
      await db.syncLibSQL();
      console.log("migrateAndSeed - Push completed successfully.");
    } catch (e) {
      console.warn("migrateAndSeed - Post-migration push failed:", e);
    }
  }

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Suspense fallback={<StatusMessage message="Connect DB..." />}>
      <SQLiteProvider
        databaseName={DB_NAME}
        useSuspense
        options={{
          libSQLOptions: {
            url: process.env.EXPO_PUBLIC_TURSO_DB_URL!,
            authToken: process.env.EXPO_PUBLIC_TURSO_DB_AUTH_TOKEN!,
          },
        }}
        onInit={migrateAndSeed}
      >
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
      </SQLiteProvider>
    </Suspense>
  );
}
