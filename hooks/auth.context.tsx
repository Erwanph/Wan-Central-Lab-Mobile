import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    login: (token: string, userData: any) => Promise<void>;  // Add this line
    logout: () => Promise<void>;
  };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  
    useEffect(() => {
      checkAuthStatus();
    }, []);
  
    const checkAuthStatus = async () => {
      const token = await AsyncStorage.getItem('sessionToken');
      setIsLoggedIn(!!token);
    };
  
    const login = async (token: string, userData: any) => {
      await AsyncStorage.multiSet([
        ['sessionToken', token],
        ['userName', userData.name],
        ['userEmail', userData.email],
        ['userId', userData.id.toString()],
      ]);
      setIsLoggedIn(true);
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    };
  
    const logout = async () => {
      await AsyncStorage.multiRemove([
        'sessionToken',
        'userName',
        'userEmail',
        'userId',
      ]);
      setIsLoggedIn(false);
      if (typeof window !== 'undefined') {
        window.location.href = '/screens/login';
      }
    };
  
    return (
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  }