import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import CustomSplashScreen from '../components/CustomSplashScreen';
import LoginPage from './screens/login';
import RegisterPage from './screens/register';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [showCustomSplash, setShowCustomSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true); // To toggle between login and register

  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => {
        setShowCustomSplash(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  if (showCustomSplash) {
    return <CustomSplashScreen />;
  }

  if (!fontsLoaded) {
    return null;
  }

  if (!isLoggedIn) {
    if (showLogin) {
      return (
        <LoginPage 
          onLoginSuccess={() => setIsLoggedIn(true)}
          onRegisterPress={() => setShowLogin(false)}
        />
      );
    } else {
      return (
        <RegisterPage
          onRegistrationSuccess={() => setShowLogin(true)}
          onLoginPress={() => setShowLogin(true)}
        />
      );
    }
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="screens/login" options={{ headerShown: false }} />
        <Stack.Screen name="screens/register" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
  
}