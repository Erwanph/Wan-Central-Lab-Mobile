import React from 'react';
import { SafeAreaView, StyleSheet, View, ScrollView, Platform } from 'react-native';
import OhmsLawDesc from '@/components/OhmsLawDesc';
import OhmsLawSimulator from '@/components/OhmsLawSimulator';
import OhmsLawQuiz from '@/components/OhmsLawQuiz';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <OhmsLawDesc />
        <OhmsLawSimulator />
        <OhmsLawQuiz />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.select({ ios: 20, android: 20 })
  },
  scrollContent: {
    padding: 16,
  },
});

export default App;

