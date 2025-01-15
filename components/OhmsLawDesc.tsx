import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';

const OhmsLawDesc = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Ohm's Law</Text>
        <Image
          source={require('@/assets/images/georgohm.jpg')}
          style={styles.headerImage}
        />
        <Text style={styles.description}>
          Ohm's Law is a fundamental principle in electrical physics that explains the relationship between voltage (V), electric current (I), and resistance (R) in an electrical circuit. Discovered by Georg Simon Ohm in 1827, this law states that the electric current flowing through a material is directly proportional to the voltage applied and inversely proportional to the material's resistance. Simply put, the greater the resistance, the lower the current flow, and vice versa. Ohm's Law is essential for understanding and designing various electronic devices and electrical systems.
        </Text>
        <View style={styles.formulaContainer}>
          <Text style={styles.subtitle}>Formulas:</Text>
          <Text style={styles.formula}>• V = IR (Ohm's Law)</Text>
          <Text style={styles.formula}>• Series: Rtotal = R1 + R2</Text>
          <Text style={styles.formula}>• Parallel:1/Rtotal = 1/R1 + 1/R2</Text>
        </View>
      </View>
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
    marginBottom:2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2c3e50',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#34495e',
    marginBottom: 16,
  },
  headerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
    marginTop: 8,
  },
  formulaContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginTop: 2,
  },
  formula: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 4,
    fontFamily: 'monospace',
  }
});

export default OhmsLawDesc;
