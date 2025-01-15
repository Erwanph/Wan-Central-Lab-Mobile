import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OhmsLawQuiz = () => {
  const [quiz1, setQuiz1] = useState('');
  const [quiz2, setQuiz2] = useState('');
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);

  const calculateQuizScore = async () => {
    if (!quiz1 || !quiz2) {
      alert('Incomplete: Please answer all questions');
      return;
    }
    
    let score = 0;
    if (quiz1 === 'V=IR') score += 50;
    if (quiz2 === 'Decreases') score += 50;
    setCurrentScore(score);
    setQuizSubmitted(true);
    await AsyncStorage.setItem('quizScore', score.toString());
  };

  useEffect(() => {
    AsyncStorage.getItem('quizScore').then((score) => {
      if (score) {
        setCurrentScore(Number(score));
        setQuizSubmitted(true);
      }
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
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
          <Text style={styles.scoreText}>Your score: {currentScore}%</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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

