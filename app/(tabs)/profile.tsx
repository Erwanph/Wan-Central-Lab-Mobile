import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@/hooks/UserContext';

const ProfilePage: React.FC = () => {
  const { user, setUser } = useUser();
  const [newName, setNewName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [score, setScore] = useState(user?.score?.toString() || '0');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await AsyncStorage.getItem('sessionToken');
      if (!token) {
        Alert.alert('Error', 'You are not logged in.');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/users/:id', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch profile data');

        const responseBody = await response.json();
        setNewName(responseBody.name);
        setEmail(responseBody.email);
        setScore(responseBody.score.toString());
        setUser({
          name: responseBody.name,
          email: responseBody.email,
          score: responseBody.score,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('Error', 'Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setUser]);

  const handleUpdateProfile = async () => {
    const token = await AsyncStorage.getItem('sessionToken');
    if (!token) return;

    try {
      setLoading(true);
      if (user?.name === newName) {
        Alert.alert('Error', 'No changes made.');
        return;
      }

      const response = await fetch('http://localhost:8080/users/:id', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const responseBody = await response.json();
      setUser({
        name: responseBody.name,
        email: responseBody.email,
        score: responseBody.score,
      });
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
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('user');
    window.location.href = '/';
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
