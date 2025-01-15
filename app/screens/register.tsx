import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';

interface RegisterPageProps {
  onRegistrationSuccess: () => void;
  onLoginPress: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegistrationSuccess, onLoginPress }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async () => {
    try {
      const response = await axios({
        method: 'POST',
        url: 'https://wan-central-lab-mobile-back-end.vercel.app/auth/register',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          name,
          email,
          password
        }
      });

      // If the request is successful, axios automatically throws for non-2xx status codes
      onRegistrationSuccess();
      
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Handle Axios specific errors
        const errorMessage = err.response?.data?.message || err.message;
        setError(errorMessage);
      } else {
        setError('An unexpected error occurred');
      }
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
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Full Name"
          placeholderTextColor={colors.placeholder}
          autoCapitalize="words"
        />
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
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={onLoginPress}>
            <Text style={styles.loginLink}>Login</Text>
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  loginText: {
    color: colors.text,
    fontSize: 14,
  },
  loginLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default RegisterPage;