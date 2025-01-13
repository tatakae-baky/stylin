import { Stack } from "expo-router";
import "./globals.css";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { SplashScreen } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CartProvider } from './context/_CartContext';
import { SavedProvider } from './context/SavedContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Hide splash screen after resources are loaded
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SavedProvider>
          <CartProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </CartProvider>
        </SavedProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
