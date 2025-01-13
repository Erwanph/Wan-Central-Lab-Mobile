import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@/hooks/UserContext';

export default function ProfileScreen() {
  const { user, setUser } = useUser();
  const [newName, setNewName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [score, setScore] = useState(user?.score?.toString() || '0');

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = await AsyncStorage.getItem('sessionToken');
    if (!token) {
      setErrorMessage('You are not logged in.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('https://wan-central-lab.vercel.app/api/proxy?api=getProfile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const responseBody = await response.json();
      const userData = {
        name: responseBody.data.name,
        email: responseBody.data.email,
        score: parseInt(responseBody.data.score, 10)
      };
      
      setNewName(userData.name);
      setScore(userData.score.toString());
      setEmail(userData.email);
      setUser(userData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setErrorMessage('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    const token = await AsyncStorage.getItem('sessionToken');
    if (!token) return;

    try {
      setLoading(true);
      setSuccessMessage('');
      setErrorMessage('');
      
      if (user?.name === newName) {
        setErrorMessage('No field change');
        return;
      }

      const response = await fetch('https://wan-central-lab.vercel.app/api/proxy?api=updateProfile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ new_name: newName }),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const responseBody = await response.json();
      const updatedUser = {
        name: responseBody.data.name,
        email: responseBody.data.email,
        score: parseInt(responseBody.data.score, 10)
      };
      
      setUser(updatedUser);
      setScore(updatedUser.score.toString());
      setSuccessMessage('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={newName}
            onChangeText={setNewName}
            editable={isEditing}
            style={[
              styles.input,
              !isEditing && styles.disabledInput
            ]}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            editable={false}
            style={[styles.input, styles.disabledInput]}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Latest Score</Text>
          <TextInput
            value={score}
            editable={false}
            style={[styles.input, styles.disabledInput]}
          />
        </View>

        {!isEditing ? (
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleUpdateProfile}
              style={[styles.button, styles.submitButton]}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Submitting...' : 'Submit'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setIsEditing(false);
                setNewName(user?.name || '');
              }}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#f3f4f6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
  },
  disabledInput: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#10b981',
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },
  successText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 16,
  },
});