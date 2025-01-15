import React, { createContext, useState, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the User type with userId
export type User = {
  name: string;
  email: string;
  score: number;
  userId: string;  // Add userId to the type
} | null;

// Define the context type
export type UserContextType = {
  user: User;
  setUser: (user: User) => void;
  clearUser: () => void;
};

// Create and export the context with a default value
export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => null,
  clearUser: () => null,
});

// Export the provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  const handleSetUser = async (newUser: User) => {
    try {
      if (newUser) {
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        await AsyncStorage.setItem('userId', newUser.userId); // Store userId separately
      } else {
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('userId'); // Remove userId as well
      }
      setUser(newUser);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const clearUser = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('userId');
      setUser(null);
    } catch (error) {
      console.error('Error clearing user:', error);
    }
  };

  // Retrieve user data from AsyncStorage on initial load
  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedUserId = await AsyncStorage.getItem('userId');

        if (storedUser && storedUserId) {
          const parsedUser = JSON.parse(storedUser);
          // Handle fallback for userId in case it's undefined or null
          parsedUser.userId = storedUserId || '';

          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };

    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser: handleSetUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Export the hook
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
