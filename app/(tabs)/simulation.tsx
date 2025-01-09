import React, { useState } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Text,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

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

const CircuitDiagram = ({
  circuitType,
  components,
  voltage,
  onAddComponent,
}: {
  circuitType: 'serial' | 'parallel';
  components: Component[];
  voltage: number;
  onAddComponent: (type: 'bulb' | 'resistor', position: number) => void;
}) => {
  return (
    <View style={styles.circuitDiagram}>
      <TouchableOpacity
        style={styles.circuitSpot}
        onPress={() => onAddComponent('resistor', 1)}
      >
        <View
          style={[
            styles.circuitComponent,
            components.some((comp) => comp.position === 1) && styles.componentAdded,
          ]}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.circuitSpot}
        onPress={() => onAddComponent('bulb', 2)}
      >
        <View
          style={[
            styles.circuitComponent,
            components.some((comp) => comp.position === 2) && styles.componentAdded,
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

const SimulationScreen = () => {
  const [circuitType, setCircuitType] = useState<'serial' | 'parallel'>('serial');
  const [voltage, setVoltage] = useState<number>(0);
  const [components, setComponents] = useState<Component[]>([]);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [showPlot, setShowPlot] = useState(false);

  const calculateTotalResistance = (): number => {
    if (components.length !== 2) return 0;

    if (circuitType === 'serial') {
      return components[0].resistance + components[1].resistance;
    } else {
      return 1 / (1 / components[0].resistance + 1 / components[1].resistance);
    }
  };

  const calculateCurrent = (): number => {
    const totalResistance = calculateTotalResistance();
    return totalResistance > 0 ? voltage / totalResistance : 0;
  };

  const handleAddComponent = (type: 'bulb' | 'resistor', position: number) => {
    if (!components.some((comp) => comp.position === position)) {
      const newComponent: Component = {
        id: Date.now(),
        type,
        resistance: 10,
        position,
      };
      setComponents([...components, newComponent]);
    }
  };

  const handleAddToTable = () => {
    const totalResistance = calculateTotalResistance();
    const current = calculateCurrent();

    if (voltage > 0 && components.length === 2 && current > 0) {
      const newDataPoint = {
        resistance1: components[0].resistance,
        resistance2: components[1].resistance,
        totalResistance,
        voltage,
        current,
      };
      setDataPoints([...dataPoints, newDataPoint]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Circuit Type Selection */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Circuit Type</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, circuitType === 'serial' && styles.buttonActive]}
              onPress={() => setCircuitType('serial')}
            >
              <Text style={styles.buttonText}>Serial</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, circuitType === 'parallel' && styles.buttonActive]}
              onPress={() => setCircuitType('parallel')}
            >
              <Text style={styles.buttonText}>Parallel</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Circuit Diagram */}
        <CircuitDiagram
          circuitType={circuitType}
          components={components}
          voltage={voltage}
          onAddComponent={handleAddComponent}
        />

        {/* Controls */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Circuit Controls</Text>
          <View style={styles.inputGroup}>
            <Text>Voltage (V)</Text>
            <TextInput
              style={styles.input}
              value={voltage.toString()}
              onChangeText={(text) => setVoltage(Number(text) || 0)}
              keyboardType="numeric"
            />
          </View>
          {components.map((comp) => (
            <View key={comp.id} style={styles.inputGroup}>
              <Text>
                {comp.type === 'bulb' ? 'Lightbulb' : 'Resistor'} {comp.position} Resistance (Ω)
              </Text>
              <TextInput
                style={styles.input}
                value={comp.resistance.toString()}
                onChangeText={(text) => {
                  const newComponents = [...components];
                  const index = newComponents.findIndex((c) => c.id === comp.id);
                  newComponents[index].resistance = Number(text) || 0;
                  setComponents(newComponents);
                }}
                keyboardType="numeric"
              />
            </View>
          ))}
        </View>

        {/* Data Table */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Data Table</Text>
          {dataPoints.map((data, index) => (
            <View key={index}>
              <Text>
                R1: {data.resistance1}Ω, R2: {data.resistance2}Ω, Total R: {data.totalResistance.toFixed(2)}Ω, Voltage: {data.voltage}V, Current: {data.current.toFixed(2)}A
              </Text>
            </View>
          ))}
          <TouchableOpacity style={styles.button} onPress={handleAddToTable}>
            <Text style={styles.buttonText}>Add to Table</Text>
          </TouchableOpacity>
        </View>

        {/* Chart */}
        {showPlot && dataPoints.length >= 2 && (
          <LineChart
            data={{
              labels: dataPoints.map((d) => d.voltage.toString()),
              datasets: [
                {
                  data: dataPoints.map((d) => d.current),
                },
              ],
            }}
            width={Dimensions.get('window').width - 30}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
            }}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  content: {
    flex: 1,
  },
  card: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#0056b3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  inputGroup: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  circuitDiagram: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  circuitSpot: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circuitComponent: {
    width: 40,
    height: 40,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  componentAdded: {
    backgroundColor: '#007bff',
  },
});

export default SimulationScreen;
