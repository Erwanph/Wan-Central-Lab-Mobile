import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useUser } from '@/hooks/UserContext';

const OhmsLawQuiz = () => {
  const [quiz1, setQuiz1] = useState('');
  const [quiz2, setQuiz2] = useState('');
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [userId, setUserId] = useState('');
  const {updateScore} = useUser();

  const calculateQuizScore = async () => {
    if (!quiz1 || !quiz2) {
      alert('Incomplete: Please answer all questions');
      return;
    }
    
    let scoreWorked = 0;
    if (quiz1 === 'V=IR') scoreWorked += 50;
    if (quiz2 === 'Decreases') scoreWorked += 50;
    
    try {
      // First update the backend
      await axios.patch(`https://wan-central-lab-mobile-back-end.vercel.app/users/${userId}/score`, {
        score: scoreWorked
      });
  
      // Then update both AsyncStorage and context in a coordinated way
      await Promise.all([
        AsyncStorage.setItem('score', scoreWorked.toString()),
        updateScore(scoreWorked)
      ]);
  
      // Finally update local state
      setCurrentScore(scoreWorked);
      setQuizSubmitted(true);
  
      console.log('Score updated successfully');
    } catch (error) {
      console.error('Error incrementing score:', error);
      Alert.alert('Error', 'Failed to update the score.');
    }
  };
  
  const handleReset = async () => {
    try {
      // Reset the score to 0 using the updateScore API
      await axios.patch(`https://wan-central-lab-mobile-back-end.vercel.app/users/${userId}/score`, {
        score: 0
      });

      // Reset the local state
      setCurrentScore(0);
      setQuizSubmitted(false);
      setQuiz1('');
      setQuiz2('');
      await AsyncStorage.removeItem('score');
    } catch (error) {
      console.error('Error resetting score:', error);
      Alert.alert('Error', 'Failed to reset the score.');
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId !== null) {
        setUserId(storedUserId);  // Only set state if userId is not null
      } else {
        console.log('User ID not found in AsyncStorage');
      }
    };
    // Load previous quiz score if available
    AsyncStorage.getItem('score').then((score) => {
      if (score) {
        setCurrentScore(Number(score));
        setQuizSubmitted(true);
      }
    });

    fetchUserId();
  }, []);

  return (
    <View style={styles.container}>
      {!quizSubmitted ? (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Quiz</Text>
          <Text style={styles.question}>What is the formula for Ohm's Law?</Text>
          <RadioButton.Group onValueChange={setQuiz1} value={quiz1}>
            <RadioButton.Item label="V = IR" value="V=IR" />
            <RadioButton.Item label="I = V/R" value="I=V/R" />
            <RadioButton.Item label="R = V/I" value="R=V/I" />
          </RadioButton.Group>

          <Text style={styles.question}>
            What happens to current in a parallel circuit when resistance increases?
          </Text>
          <RadioButton.Group onValueChange={setQuiz2} value={quiz2}>
            <RadioButton.Item label="Increases" value="Increases" />
            <RadioButton.Item label="Decreases" value="Decreases" />
            <RadioButton.Item label="Stays the same" value="Stays the same" />
          </RadioButton.Group>

          <TouchableOpacity style={styles.primaryButton} onPress={calculateQuizScore}>
            <Text style={styles.buttonText}>Submit Quiz</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Quiz Results</Text>
          <Text style={styles.scoreText}>Your score: {currentScore}</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={handleReset}>
            <Text style={styles.buttonText}>Reset Quiz</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 3,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
    marginTop: 8,
  },
  question: {
    fontSize: 16,
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 24,
    color: '#2c3e50',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default OhmsLawQuiz;
