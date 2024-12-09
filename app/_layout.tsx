import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import CustomSplashScreen from '../components/CustomSplashScreen';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [showCustomSplash, setShowCustomSplash] = useState(true); // Control custom splash screen

  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => {
        setShowCustomSplash(false); // Hide custom splash after GIF finishes
      }, 5000); // Set timeout based on GIF duration (e.g., 5 seconds)

      return () => clearTimeout(timer); // Clear timer on cleanup
    }
  }, [fontsLoaded]);

  if (showCustomSplash) {
    return <CustomSplashScreen />;
  }

  if (!fontsLoaded) {
    return null; // Prevent rendering if fonts are not loaded
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
