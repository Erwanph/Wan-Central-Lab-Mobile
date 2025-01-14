import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  SafeAreaView,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface Component {
  id: number;
  type: 'bulb' | 'resistor';
  resistance: number;
  position: number;
}

interface DataPoint {
  resistance1: number;
  resistance2: number;
  totalResistance: number;
  voltage: number;
  current: number;
}

const OhmsLawApp = () => {
  const [circuitType, setCircuitType] = useState<'serial' | 'parallel'>('serial');
  const [voltage, setVoltage] = useState<string>('0');
  const [components, setComponents] = useState<Component[]>([]);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [showPlot, setShowPlot] = useState(false);
  const [quiz1, setQuiz1] = useState('');
  const [quiz2, setQuiz2] = useState('');
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);

  const calculateTotalResistance = (): number => {
    if (components.length !== 2) return 0;

    if (circuitType === 'serial') {
      return components[0].resistance + components[1].resistance;
    } else {
      return 1 / (1 / components[0].resistance + 1 / components[1].resistance);
    }
  };

  const calculateCurrent = (): number => {
    if (
      components.length !== 2 ||
      Number(voltage) === 0 ||
      components.some((comp) => comp.resistance === 0)
    ) {
      return 0;
    }

    const totalResistance = calculateTotalResistance();
    return Number(voltage) / totalResistance;
  };

  const handleAddComponent = (type: 'bulb' | 'resistor') => {
    if (components.length < 2) {
      const newComponent: Component = {
        id: Date.now(),
        type,
        resistance: 10,
        position: components.length + 1,
      };
      setComponents([...components, newComponent]);
    } else {
      Alert.alert('Maximum Components', 'You can only add up to 2 components');
    }
  };

  const handleRemoveComponent = (id: number) => {
    setComponents(components.filter(comp => comp.id !== id));
  };

  const handleAddToTable = () => {
    const totalResistance = calculateTotalResistance();
    const calculatedCurrent = calculateCurrent();

    if (
      Number(voltage) > 0 &&
      components.length === 2 &&
      components.every((comp) => comp.resistance > 0) &&
      calculatedCurrent !== 0
    ) {
      const isDuplicate = dataPoints.some(
        (data) =>
          data.resistance1 === components[0].resistance &&
          data.resistance2 === components[1].resistance &&
          data.voltage === Number(voltage)
      );

      if (!isDuplicate) {
        setDataPoints([
          ...dataPoints,
          {
            resistance1: components[0].resistance,
            resistance2: components[1].resistance,
            totalResistance,
            voltage: Number(voltage),
            current: calculatedCurrent,
          },
        ]);
        setShowPlot(true);
      }
    }
  };

  const exportData = async () => {
    if (dataPoints.length === 0) {
      Alert.alert('No Data', 'Please add some data points first');
      return;
    }

    const csvData = [
      ['R1 (Ω)', 'R2 (Ω)', 'Total R (Ω)', 'Voltage (V)', 'Current (A)'],
      ...dataPoints.map((data) => [
        data.resistance1,
        data.resistance2,
        data.totalResistance.toFixed(2),
        data.voltage,
        data.current.toFixed(2),
      ]),
    ].join('\n');

    try {
      const fileUri = `${FileSystem.documentDirectory}ohms_law_data.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csvData);
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const calculateQuizScore = async () => {
    if (!quiz1 || !quiz2) {
      Alert.alert('Incomplete', 'Please answer all questions');
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Description Section */}
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

        {/* Circuit Controls */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Circuit Type</Text>
          <View style={styles.circuitTypeContainer}>
            <TouchableOpacity
              style={[
                styles.circuitTypeButton,
                circuitType === 'serial' && styles.circuitTypeButtonActive,
              ]}
              onPress={() => setCircuitType('serial')}
            >
              <Text style={[
                styles.circuitTypeText,
                circuitType === 'serial' && styles.circuitTypeTextActive
              ]}>Serial</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.circuitTypeButton,
                circuitType === 'parallel' && styles.circuitTypeButtonActive,
              ]}
              onPress={() => setCircuitType('parallel')}
            >
              <Text style={[
                styles.circuitTypeText,
                circuitType === 'parallel' && styles.circuitTypeTextActive
              ]}>Parallel</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>Components</Text>
          <View style={styles.componentSelector}>
            <TouchableOpacity 
              style={styles.componentButton} 
              onPress={() => handleAddComponent('bulb')}
            >
              <Image
                source={require('@/assets/images/lightbulb-off.png')}
                style={styles.componentButtonImage}
              />
              <Text style={styles.componentButtonText}>Add Bulb</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.componentButton}
              onPress={() => handleAddComponent('resistor')}
            >
              <Image
                source={require('@/assets/images/resistor.png')}
                style={styles.componentButtonImage}
              />
              <Text style={styles.componentButtonText}>Add Resistor</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.componentList}>
            {components.map((comp) => (
              <View key={comp.id} style={styles.componentItem}>
                <Image
                  source={
                    comp.type === 'bulb'
                      ? require('@/assets/images/lightbulb-off.png')
                      : require('@/assets/images/resistor.png')
                  }
                  style={styles.componentImage}
                />
                <TextInput
                  style={styles.componentInput}
                  value={comp.resistance.toString()}
                  onChangeText={(value) => {
                    const newComponents = [...components];
                    const index = newComponents.findIndex((c) => c.id === comp.id);
                    newComponents[index].resistance = Math.max(0, Number(value));
                    setComponents(newComponents);
                  }}
                  keyboardType="numeric"
                  placeholder="Resistance (Ω)"
                />
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => handleRemoveComponent(comp.id)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <Text style={styles.subtitle}>Voltage (V)</Text>
          <TextInput
            style={styles.input}
            value={voltage}
            onChangeText={setVoltage}
            keyboardType="numeric"
            placeholder="Enter voltage"
          />
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Measurements</Text>
          {components.length === 2 && (
            <>
              <Text style={styles.measurementText}>
                Total Resistance: {calculateTotalResistance().toFixed(2)} Ω
              </Text>
              <Text style={styles.measurementText}>
                Current: {calculateCurrent().toFixed(2)} A
              </Text>
            </>
          )}
          
          <TouchableOpacity style={styles.primaryButton} onPress={handleAddToTable}>
            <Text style={styles.buttonText}>Add to Table</Text>
          </TouchableOpacity>
          
          {dataPoints.length > 0 && (
            <>
              <ScrollView horizontal style={styles.tableContainer}>
                <View>
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderText}>R1 (Ω)</Text>
                    <Text style={styles.tableHeaderText}>R2 (Ω)</Text>
                    <Text style={styles.tableHeaderText}>Total R (Ω)</Text>
                    <Text style={styles.tableHeaderText}>V (V)</Text>
                    <Text style={styles.tableHeaderText}>I (A)</Text>
                  </View>
                  {dataPoints.map((point, index) => (
                    <View key={index} style={styles.tableRow}>
                      <Text style={styles.tableCell}>{point.resistance1}</Text>
                      <Text style={styles.tableCell}>{point.resistance2}</Text>
                      <Text style={styles.tableCell}>{point.totalResistance.toFixed(2)}</Text>
                      <Text style={styles.tableCell}>{point.voltage}</Text>
                      <Text style={styles.tableCell}>{point.current.toFixed(2)}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
              
              <TouchableOpacity style={styles.secondaryButton} onPress={exportData}>
                <Text style={styles.buttonText}>Export Data</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Chart */}
        {showPlot && dataPoints.length >= 2 && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>V-I Characteristic</Text>
            <LineChart
              data={{
                labels: dataPoints.map((dp) => dp.voltage.toString()),
                datasets: [
                  {
                    data: dataPoints.map((dp) => dp.current),
                  },
                ],
              }}
              width={Dimensions.get('window').width - 40}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              bezier
              style={styles.chart}
            />
          </View>
        )}

        {/* Quiz Section */}
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
    </SafeAreaView>
  );
};

// [Previous code remains the same until the styles definition]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
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
  circuitTypeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
  },
  circuitTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  circuitTypeButtonActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  circuitTypeText: {
    fontSize: 16,
    color: '#666',
  },
  circuitTypeTextActive: {
    color: '#2c3e50',
    fontWeight: '600',
  },
  componentSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  componentButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '45%',
  },
  componentButtonImage: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  componentButtonText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  componentList: {
    marginTop: 8,
  },
  componentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  componentImage: {
    width: 30,
    height: 30,
    marginRight: 12,
  },
  componentInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  measurementText: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  secondaryButton: {
    backgroundColor: '#2ecc71',
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
  tableContainer: {
    marginVertical: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  tableHeaderText: {
    width: 100,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 12,
  },
  tableCell: {
    width: 100,
    textAlign: 'center',
    color: '#34495e',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  question: {
    fontSize: 16,
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 24,
    color: '#2c3e50',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  formulaContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  formula: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 4,
    fontFamily: 'monospace',
  }
});


export default OhmsLawApp;