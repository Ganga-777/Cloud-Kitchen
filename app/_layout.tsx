import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { ErrorBoundary } from "./error-boundary";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="kitchen/[id]" 
        options={{ 
          headerTitle: "",
          headerTransparent: true,
          headerBackTitle: "Back"
        }} 
      />
      <Stack.Screen 
        name="dish/[id]" 
        options={{ 
          headerTitle: "",
          headerTransparent: true,
          headerBackTitle: "Back"
        }} 
      />
      <Stack.Screen 
        name="cart" 
        options={{ 
          headerTitle: "Your Cart",
          presentation: "modal"
        }} 
      />
      <Stack.Screen 
        name="checkout" 
        options={{ 
          headerTitle: "Checkout",
          headerBackTitle: "Cart"
        }} 
      />
      <Stack.Screen 
        name="order/[id]" 
        options={{ 
          headerTitle: "Order Details",
          headerBackTitle: "Orders"
        }} 
      />
      <Stack.Screen 
        name="reviews/kitchen/[id]" 
        options={{ 
          headerTitle: "Reviews",
          headerBackTitle: "Kitchen"
        }} 
      />
      <Stack.Screen 
        name="reviews/dish/[id]" 
        options={{ 
          headerTitle: "Reviews",
          headerBackTitle: "Dish"
        }} 
      />
      <Stack.Screen 
        name="reviews/write" 
        options={{ 
          headerTitle: "Write a Review",
          headerBackTitle: "Back"
        }} 
      />
      <Stack.Screen 
        name="reviews/edit/[id]" 
        options={{ 
          headerTitle: "Edit Review",
          headerBackTitle: "Back"
        }} 
      />
    </Stack>
  );
}