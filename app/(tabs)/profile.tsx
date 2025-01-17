import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@/hooks/UserContext';
import { useRouter } from 'expo-router';
import axios from 'axios';

interface User {
  name: string;
  email: string;
  score: number;
  userId: string;
}

const ProfilePage: React.FC = () => {
  const { user, setUser } = useUser();
  const [newName, setNewName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [score, setScore] = useState(user?.score || 0);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const fetchScore = async () => {
    try {
      const storedScore = await AsyncStorage.getItem('score');
      const parsedScore = storedScore ? parseInt(storedScore, 10) : 0;
      setScore(parsedScore);
      
      // Update user context with new score
      if (user) {
        const updatedUser = {
          ...user,
          score: parsedScore
        };
        setUser(updatedUser);
      }
      
      Alert.alert('Success', 'Score updated successfully');
    } catch (error) {
      console.error('Error fetching score:', error);
      Alert.alert('Error', 'Failed to update score');
    }
  };

  useEffect(() => {
    const fetchProfileFromStorage = async () => {
      try {
        const [storedUserName, storedUserEmail, storedUserId, storedSessionToken, storedScore] = 
          await Promise.all([
            AsyncStorage.getItem('userName'),
            AsyncStorage.getItem('userEmail'),
            AsyncStorage.getItem('userId'),
            AsyncStorage.getItem('sessionToken'),
            AsyncStorage.getItem('score')
          ]);
  
        const parsedScore = storedScore ? parseInt(storedScore, 10) : 0;
  
        if (storedUserName && storedUserEmail && storedUserId && storedSessionToken) {
          const updatedUser = {
            name: storedUserName,
            email: storedUserEmail,
            score: parsedScore,
            userId: storedUserId,
          };
          
          setNewName(storedUserName);
          setEmail(storedUserEmail);
          setScore(parsedScore);
          setUser(updatedUser);
        } else {
          Alert.alert('Error', 'No user data found.');
        }
      } catch (error) {
        console.error('Error fetching user profile from AsyncStorage:', error);
        Alert.alert('Error', 'Failed to load profile data.');
      }
    };
  
    fetchProfileFromStorage();
  }, [setUser]);

  const handleUpdateProfile = async () => {
    const token = await AsyncStorage.getItem('sessionToken');
    const userId = await AsyncStorage.getItem('userId');
    
    if (!token || !userId) {
      Alert.alert('Error', 'Authentication information is missing.');
      return;
    }

    try {
      setLoading(true);
      
      if (user?.name === newName) {
        Alert.alert('Error', 'No changes made.');
        return;
      }
      
      const response = await axios.patch(
        `https://wan-central-lab-mobile-back-end.vercel.app/users/${userId}`,
        { name: newName },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data) {
        const updatedUser: User = {
          name: newName,
          email: user?.email || '',
          score: typeof score === 'number' ? score : 0,
          userId: user?.userId || '',
        };

        await AsyncStorage.setItem('userName', newName);
        setUser(updatedUser);

        Alert.alert('Success', 'Profile updated successfully');
        setIsEditing(false);
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error?.message || 'Failed to update profile. Please try again.';
        Alert.alert('Error', errorMessage);
      } else {
        console.error('Unexpected error:', error);
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName) {
        setNewName(storedName);
      } else if (user?.name) {
        setNewName(user.name);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error restoring name:', error);
      if (user?.name) {
        setNewName(user.name);
      }
      setIsEditing(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('sessionToken');
  
      if (token) {
        try {
          await axios.post(
            'https://wan-central-lab-mobile-back-end.vercel.app/auth/logout',
            {},
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          console.error('Logout API error:', error);
        }
      }
      await AsyncStorage.multiRemove([
        'sessionToken',
        'userName',
        'userEmail',
        'userId',
        'score',
      ]);

      setUser(null);
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        bounces={false}
      >
        <Text style={styles.title}>Profile</Text>
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              editable={isEditing}
              style={[styles.input, !isEditing && styles.disabledInput]}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput 
              value={email} 
              editable={false} 
              style={[styles.input, styles.disabledInput]} 
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Latest Score</Text>
            <TextInput 
              value={score.toString()} 
              editable={false} 
              style={[styles.input, styles.disabledInput]} 
            />
          </View>

          {!isEditing ? (
            <View>
              <View style={styles.buttonGroup}>
                <TouchableOpacity 
                  onPress={() => setIsEditing(true)} 
                  style={[styles.button, styles.editButton]}
                >
                  <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={fetchScore} 
                  style={[styles.button, styles.updateScoreButton]}
                >
                  <Text style={styles.buttonText}>Update Score</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity 
                onPress={handleLogout} 
                style={[styles.button, styles.logoutButton, { marginTop: 12 }]}
              >
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.editButtonGroup}>
              <TouchableOpacity 
                onPress={handleCancel}
                style={[styles.button, styles.cancelButton]}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleUpdateProfile}
                style={[styles.button, styles.submitButton]}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Updating...' : 'Submit'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 60 : 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#1a1a1a',
  },
  disabledInput: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  editButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  editButton: {
    backgroundColor: '#007BFF',
  },
  updateScoreButton: {
    backgroundColor: '#17a2b8',
  },
  submitButton: {
    backgroundColor: '#28a745',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfilePage;