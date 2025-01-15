import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@/hooks/UserContext';
import { useRouter } from 'expo-router';

const ProfilePage: React.FC = () => {
  const { user, setUser } = useUser();
  const [newName, setNewName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [score, setScore] = useState(user?.score?.toString() || '0');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfileFromStorage = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem('userName');
        const storedUserEmail = await AsyncStorage.getItem('userEmail');
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedSessionToken = await AsyncStorage.getItem('sessionToken');
  
        if (storedUserName && storedUserEmail && storedUserId && storedSessionToken) {
          setNewName(storedUserName);
          setEmail(storedUserEmail);
          setScore('0'); // Default score, update as per your app's logic
          setUser({
            name: storedUserName,
            email: storedUserEmail,
            score: 0, // or fetch score dynamically
            userId: storedUserId,
          });
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
    if (!token) return;
  
    try {
      setLoading(true);
      
      // If no changes are made to the name, show an alert
      if (user?.name === newName) {
        Alert.alert('Error', 'No changes made.');
        return;
      }
  
      // Ensure user fields are always valid by providing defaults if necessary
      const updatedUser = {
        name: newName,
        email: user?.email || '',  // Provide default empty string for email
        score: user?.score ?? 0,    // Use 0 as default for score if it's undefined
        userId: user?.userId || '', // Ensure userId is always a string
      };
  
      // Update profile in AsyncStorage
      await AsyncStorage.setItem('userName', updatedUser.name);
      await AsyncStorage.setItem('userEmail', updatedUser.email);  // Update email in AsyncStorage
      await AsyncStorage.setItem('userScore', updatedUser.score.toString());  // Save score as a string
      await AsyncStorage.setItem('userId', updatedUser.userId);  // Update userId in AsyncStorage
  
      // Update user context with the new values
      setUser(updatedUser);
  
      // Show success message
      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
  
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

const handleLogout = async () => {
  const router = useRouter(); // Get the navigation object

  try {
    // Remove all the user-related data from AsyncStorage
    await AsyncStorage.removeItem('sessionToken');
    await AsyncStorage.removeItem('userName');
    await AsyncStorage.removeItem('userEmail');
    await AsyncStorage.removeItem('userId');
    
    // Reset user context
    setUser(null);
    
    // Navigate to the Login screen
    router.replace("/screens/login") // Make sure 'Login' is the name of your login screen in the navigation stack

    Alert.alert('Logged out', 'You have been logged out.');
  } catch (error) {
    console.error('Error logging out:', error);
    Alert.alert('Error', 'Failed to logout.');
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
          <TextInput value={email} editable={false} style={[styles.input, styles.disabledInput]} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Latest Score</Text>
          <TextInput value={score} editable={false} style={[styles.input, styles.disabledInput]} />
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
        {isEditing && (
          <TouchableOpacity onPress={handleUpdateProfile} style={styles.submitButton}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
  },
  inputGroup: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  disabledInput: {
    backgroundColor: '#e9ecef',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ProfilePage;
