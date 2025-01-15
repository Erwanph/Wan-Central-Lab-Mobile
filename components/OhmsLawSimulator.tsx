import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import ViewShot, { captureRef } from 'react-native-view-shot';

const OhmsLawSimulator = () => {
  const [circuitType, setCircuitType] = useState<'serial' | 'parallel'>('serial');
  const [voltage, setVoltage] = useState<string>('0');
  const [lampResistance, setLampResistance] = useState<string>('10');
  const [resistorResistance, setResistorResistance] = useState<string>('10');
  const [dataPoints, setDataPoints] = useState<{ voltage: number; current: number }[]>([]);
  const chartRef = useRef<View>(null);

  const calculateTotalResistance = (): number => {
    const r1 = Number(lampResistance);
    const r2 = Number(resistorResistance);
    return circuitType === 'serial' ? r1 + r2 : (r1 * r2) / (r1 + r2);
  };

  const calculateCurrent = (): number => {
    const totalResistance = calculateTotalResistance();
    return totalResistance > 0 ? Number(voltage) / totalResistance : 0;
  };

  const handleAddToTable = () => {
    const current = calculateCurrent();
    if (Number(voltage) > 0 && current > 0) {
      setDataPoints([...dataPoints, { voltage: Number(voltage), current }]);
    }
  };

  const exportData = async () => {
    if (dataPoints.length === 0) {
      alert('No data to export');
      return;
    }

    const csvData = [
      ['Voltage (V)', 'Current (A)'],
      ...dataPoints.map((data) => [data.voltage, data.current.toFixed(2)]),
    ].join('\n');

    try {
      const fileUri = `${FileSystem.documentDirectory}ohms_law_data.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csvData);
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      alert('Failed to export data');
    }
  };

  const exportChart = async () => {
    try {
      if (chartRef.current) {
        const uri = await captureRef(chartRef, {
          format: 'jpg',
          quality: 0.9,
        });
        await Sharing.shareAsync(uri);
      } else {
        alert('Chart is not ready for export');
      }
    } catch (error) {
      alert('Failed to export chart');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.circuitTypeContainer}>
        <TouchableOpacity
          style={[styles.circuitTypeButton, circuitType === 'serial' && styles.circuitTypeButtonActive]}
          onPress={() => setCircuitType('serial')}
        >
          <Text style={styles.circuitTypeText}>Serial</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.circuitTypeButton, circuitType === 'parallel' && styles.circuitTypeButtonActive]}
          onPress={() => setCircuitType('parallel')}
        >
          <Text style={styles.circuitTypeText}>Parallel</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={circuitType === 'serial' ? require('@/assets/images/serial.png') : require('@/assets/images/parallel.png')}
        style={styles.circuitImage}
      />

      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Lamp Resistance (Ω):</Text>
          <TextInput
            style={styles.input}
            value={lampResistance}
            onChangeText={setLampResistance}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Resistor Resistance (Ω):</Text>
          <TextInput
            style={styles.input}
            value={resistorResistance}
            onChangeText={setResistorResistance}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Voltage (V):</Text>
          <TextInput
            style={styles.input}
            value={voltage}
            onChangeText={setVoltage}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultText}>Total Resistance: {calculateTotalResistance().toFixed(2)} Ω</Text>
        <Text style={styles.resultText}>Current: {calculateCurrent().toFixed(2)} A</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddToTable}>
        <Text style={styles.buttonText}>Add to Table</Text>
      </TouchableOpacity>

      {dataPoints.length > 0 && (
        <>
          <ScrollView style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Voltage (V)</Text>
              <Text style={styles.tableHeaderText}>Current (A)</Text>
            </View>
            {dataPoints.map((point, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{point.voltage}</Text>
                <Text style={styles.tableCell}>{point.current.toFixed(2)}</Text>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.exportButton} onPress={exportData}>
            <Text style={styles.buttonText}>Export Data</Text>
          </TouchableOpacity>

          <View ref={chartRef}>
            <LineChart
              data={{
                labels: dataPoints.map((dp) => dp.voltage.toString()),
                datasets: [{ data: dataPoints.map((dp) => dp.current) }],
              }}
              width={Dimensions.get('window').width - 32}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726"
                }
              }}
              bezier
              style={styles.chart}
            />
          </View>

          <TouchableOpacity style={styles.exportButton} onPress={exportChart}>
            <Text style={styles.buttonText}>Export Chart</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  circuitImage: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#2c3e50',
    flex: 1,
  },
  input: {
    width: 100,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  resultsContainer: {
    marginBottom: 16,
  },
  resultText: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  exportButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  tableContainer: {
    maxHeight: 150,
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 8,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    color: '#34495e',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default OhmsLawSimulator;