import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { useUser } from '@/hooks/UserContext';

const ProfilePage: React.FC = () => {
  const { user, setUser } = useUser();
  const [newName, setNewName] = useState('');
  const [email, setEmail] = useState('');
  const [score, setScore] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('sessionToken');
      if (!token) {
        Alert.alert('Error', 'You are not logged in.');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:6565/api/v1/profile/', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch profile data');

        const responseBody = await response.json();
        setNewName(responseBody.data.name);
        setEmail(responseBody.data.email);
        setScore(responseBody.data.score.toString());

        // Include 'score' in setUser
        setUser({
          name: responseBody.data.name,
          email: responseBody.data.email,
          score: responseBody.data.score,
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
    const token = localStorage.getItem('sessionToken');
    if (!token) return;

    try {
      setLoading(true);
      if (user?.name === newName) {
        Alert.alert('Error', 'No changes made.');
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

      // Include 'score' in setUser
      setUser({
        name: responseBody.data.name,
        email: responseBody.data.email,
        score: responseBody.data.score,
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        {/* Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={newName}
            onChangeText={setNewName}
            editable={isEditing}
            style={[styles.input, !isEditing && styles.disabledInput]}
          />
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            editable={false}
            style={[styles.input, styles.disabledInput]}
          />
        </View>

        {/* Score */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Latest Score</Text>
          <TextInput
            value={score}
            editable={false}
            style={[styles.input, styles.disabledInput]}
          />
        </View>

        {/* Buttons */}
        {!isEditing ? (
          <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonGroup}>
            <TouchableOpacity onPress={handleUpdateProfile} style={styles.submitButton}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsEditing(false);
                setNewName(user?.name ?? '');
              }}
              style={styles.cancelButton}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
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
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
  },
  disabledInput: {
    backgroundColor: '#f2f2f2',
    color: '#999',
  },
  editButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginLeft: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfilePage;
