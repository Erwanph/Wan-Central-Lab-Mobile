import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface LoginPageProps {
  onLoginSuccess: (userData: { user: any; sessionToken: string }) => void;
  onRegisterPress: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onRegisterPress }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('https://wan-central-lab-mobile-back-end.vercel.app/auth/login', {
        email,
        password,
      });

      const { sessionToken, user, userId} = response.data;

      if (user && sessionToken && userId) {
        // Extract values from the nested 'user' object
        const { name, email, score } = user;
      
        // Save sessionToken, name, email, userId to AsyncStorage
        await AsyncStorage.multiSet([
          ['sessionToken', sessionToken],
          ['userName', name],
          ['userEmail', email],
          ['userId', userId.toString()],
          ['score', score.toString()]
        ]);
      
        // Call onLoginSuccess callback with user data
        onLoginSuccess({ user, sessionToken });
        router.replace('/(tabs)');
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : 'An unexpected error occurred';
      setError(errorMessage);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={colors.placeholder}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor={colors.placeholder}
          secureTextEntry
          autoCapitalize="none"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity 
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={onRegisterPress}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const colors = {
  primary: '#007BFF',
  background: '#f3f4f6',
  card: '#ffffff',
  border: '#e1e4e8',
  text: '#1a1a1a',
  placeholder: '#6b7280',
  error: '#dc2626',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: spacing.sm,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.xs,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.card,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: spacing.xs,
    marginTop: spacing.xs,
  },
  buttonText: {
    color: colors.card,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  error: {
    color: colors.error,
    marginBottom: spacing.md,
    fontSize: 14,
    textAlign: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  signupText: {
    color: colors.text,
    fontSize: 14,
  },
  signupLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LoginPage;

