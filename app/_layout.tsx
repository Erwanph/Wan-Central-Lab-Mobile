import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/hooks/useColorScheme';
import CustomSplashScreen from '../components/CustomSplashScreen';
import LoginPage from './screens/login';
import RegisterPage from './screens/register';

export default function RootLayout() {
  const segments = useSegments();
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [showCustomSplash, setShowCustomSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status on mount and segment changes
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await AsyncStorage.getItem('sessionToken');
      setIsLoggedIn(!!token);
      setIsLoading(false);
    };

    checkAuthStatus();
  }, [segments]); // Re-check when navigation changes

  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => {
        setShowCustomSplash(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  if (showCustomSplash || isLoading) {
    return <CustomSplashScreen />;
  }

  if (!fontsLoaded) {
    return null;
  }

  if (!isLoggedIn) {
    if (showLogin) {
      return (
        <LoginPage 
          onLoginSuccess={(userData) => setIsLoggedIn(true)}
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
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}