import { ThemeProvider, DefaultTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
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

import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { DB_NAME } from "@/constants";

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
      onInit={async (db: SQLiteDatabase) => {
        try {
          // Always sync libSQL first to prevent conflicts between local and remote databases
          db.syncLibSQL();
        } catch (e) {
          console.log("Error onInit syncing libSQL:", e);
        }

        // Define the target database version.
        const DATABASE_VERSION = 1;

        // PRAGMA is a special command in SQLite used to query or modify database settings. For example, PRAGMA user_version retrieves or sets a custom schema version number, helping you track migrations.
        // Retrieve the current database version using PRAGMA.
        let result = await db.getFirstAsync<{
          user_version: number;
        } | null>("PRAGMA user_version");
        let currentDbVersion = result?.user_version ?? 0;

        // If the current version is already equal or newer, no migration is needed.
        if (currentDbVersion >= DATABASE_VERSION) {
          console.log("No migration needed, DB version:", currentDbVersion);
          return;
        }

        // For a new or uninitialized database (version 0), apply the initial migration.
        if (currentDbVersion === 0) {
          // Note: libSQL does not support WAL (Write-Ahead Logging) mode.
          // await db.execAsync(`PRAGMA journal_mode = 'wal';`);

          // Create the 'notes' table with three columns:
          // - id: an integer primary key that cannot be null.
          // - title: a text column.
          // - content: a text column.
          // - modifiedDate: a text column.
          await db.execAsync(
            `CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY NOT NULL, title TEXT, content TEXT, modifiedDate TEXT);`
          );
          console.log(
            "Initial migration applied, DB version:",
            DATABASE_VERSION
          );
          // Update the current version after applying the initial migration.
          currentDbVersion = 1;
        } else {
          console.log("DB version:", currentDbVersion);
        }

        // Future migrations for later versions can be added here.
        // Example:
        // if (currentDbVersion === 1) {
        //   // Add migration steps for upgrading from version 1 to a higher version.
        // }

        // Set the database version to the target version after migration.
        await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
      }}
    >
      <GestureHandlerRootView>
        <ThemeProvider value={DefaultTheme}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </GestureHandlerRootView>
    </SQLiteProvider>
  );
}
