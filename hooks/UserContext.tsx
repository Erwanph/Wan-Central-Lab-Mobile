// UserContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type User = {
  name: string;
  email: string;
  score: number;
  userId: string;
} | null;

// Update context type to include updateScore
export type UserContextType = {
  user: User;
  setUser: (user: User) => void;
  clearUser: () => void;
  updateScore: (newScore: number) => Promise<void>; // Add this new function
};

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => null,
  clearUser: () => null,
  updateScore: async () => {}, // Fixed return type
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  const handleSetUser = async (newUser: User) => {
    try {
      if (newUser) {
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        await AsyncStorage.setItem('userId', newUser.userId);
      } else {
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('userId');
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

  // Add new updateScore function
const updateScore = async (newScore: number) => {
  try {
    if (user) {
      const updatedUser = {
        ...user,
        score: newScore
      };
      
      // Update both storage and state atomically
      await Promise.all([
        AsyncStorage.setItem('user', JSON.stringify(updatedUser)),
        AsyncStorage.setItem('score', newScore.toString())
      ]);
      
      // Update the context state after storage is updated
      setUser(updatedUser);
    }
  } catch (error) {
    console.error('Error updating score:', error);
    throw error; // Propagate error to handle it in the quiz component
  }
};

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedScore = await AsyncStorage.getItem('score'); // Add this line

        if (storedUser && storedUserId) {
          const parsedUser = JSON.parse(storedUser);
          parsedUser.userId = storedUserId || '';
          
          // Update score if available
          if (storedScore) {
            parsedUser.score = parseInt(storedScore, 10);
          }

          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };

    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser: handleSetUser, 
      clearUser,
      updateScore // Add this to the provider
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
