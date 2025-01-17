import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';

const OhmsLawSimulator = () => {
  const [circuitType, setCircuitType] = useState<'serial' | 'parallel'>('serial');
  const [voltage, setVoltage] = useState<string>('0');
  const [lampResistance, setLampResistance] = useState<string>('0');
  const [resistorResistance, setResistorResistance] = useState<string>('0');
  const [dataPoints, setDataPoints] = useState<{
    voltage: number;
    current: number;
    lampR: number;
    resistorR: number;
    totalR: number;
  }[]>([]);
  const [resistancesSet, setResistancesSet] = useState(false);
  const chartRef = useRef(null);

  const calculateTotalResistance = (): number => {
    const r1 = Number(lampResistance);
    const r2 = Number(resistorResistance);
    return circuitType === 'serial' ? r1 + r2 : (r1 * r2) / (r1 + r2);
  };

  const calculateCurrent = (): number => {
    const totalResistance = calculateTotalResistance();
    return totalResistance > 0 ? Number(voltage) / totalResistance : 0;
  };

  const handleCircuitTypeChange = (type: 'serial' | 'parallel') => {
    setCircuitType(type);
    resetAll();
  };

  const resetAll = () => {
    setDataPoints([]);
    setResistancesSet(false);
    setVoltage('0');
    setLampResistance('0');
    setResistorResistance('0');
  };

  const handleAddToTable = () => {
    if (Number(voltage) <= 0 || Number(lampResistance) <= 0 || Number(resistorResistance) <= 0) {
      alert('Voltage and Resistances must be greater than 0');
      return;
    }
  
    // Set resistancesSet setelah input pertama
    if (!resistancesSet) {
      setResistancesSet(true);
    } else {
      const lastPoint = dataPoints[dataPoints.length - 1];
      if (Number(voltage) === lastPoint.voltage) {
        alert('You must change the Voltage');
        return;
      }
    }
  
    const current = calculateCurrent();
    const totalR = calculateTotalResistance();
  
    setDataPoints([
      ...dataPoints,
      {
        voltage: Number(voltage),
        current,
        lampR: Number(lampResistance),
        resistorR: Number(resistorResistance),
        totalR,
      },
    ]);
  };

  const exportData = async () => {
    if (dataPoints.length === 0) {
      alert('No data to export');
      return;
    }
  
    const csvData = [
      ['RL (Ω)', 'RR (Ω)', 'Total R (Ω)', 'Voltage (V)', 'Current (A)'],
      ...dataPoints.map((data) => [
        data.lampR,
        data.resistorR,
        data.totalR.toFixed(2),
        data.voltage,
        data.current.toFixed(2),
      ]),
    ].join('\n');
  
    try {
      if (Platform.OS === 'web') {
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'ohms_law_data.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const fileUri = `${FileSystem.documentDirectory}ohms_law_data.csv`;
        await FileSystem.writeAsStringAsync(fileUri, csvData);
        await Sharing.shareAsync(fileUri);
      }
    } catch (error) {
      alert('Failed to export data');
    }
  };

  const exportChart = async () => {
    try {
      if (!chartRef.current) {
        alert('Chart is not ready for export');
        return;
      }

      const uri = await captureRef(chartRef.current, {
        format: 'png',
        quality: 1,
      });

      if (Platform.OS === 'web') {
        const link = document.createElement('a');
        link.href = uri;
        link.download = 'ohms_law_chart.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export chart');
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.circuitTypeContainer}>
          <TouchableOpacity
            style={[styles.circuitTypeButton, circuitType === 'serial' && styles.circuitTypeButtonActive]}
            onPress={() => handleCircuitTypeChange('serial')}
          >
            <Text style={styles.circuitTypeText}>Serial</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.circuitTypeButton, circuitType === 'parallel' && styles.circuitTypeButtonActive]}
            onPress={() => handleCircuitTypeChange('parallel')}
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
            <Image 
              source={require('@/assets/images/lightbulb.png')}
              style={styles.inputIcon}
            />
            <Text style={styles.inputLabel}>Lamp Resistance (Ω):</Text>
            <TextInput
              style={[styles.input, resistancesSet && styles.disabledInput]}
              value={lampResistance}
              onChangeText={setLampResistance}
              keyboardType="numeric"
              editable={!resistancesSet}
            />
          </View>
          <View style={styles.inputRow}>
            <Image 
              source={require('@/assets/images/resistor.png')}
              style={styles.inputIcon}
            />
            <Text style={styles.inputLabel}>Resistor Resistance (Ω):</Text>
            <TextInput
              style={[styles.input, resistancesSet && styles.disabledInput]}
              value={resistorResistance}
              onChangeText={setResistorResistance}
              keyboardType="numeric"
              editable={!resistancesSet}
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

        <View style={styles.formulaContainer}>
          <Text style={styles.formulaTitle}>Calculations:</Text>
          {circuitType === 'serial' ? (
            <Text style={styles.formulaText}>Series: Rtotal = R1 + R2 = {calculateTotalResistance().toFixed(2)} Ω</Text>
          ) : (
            <Text style={styles.formulaText}>Parallel: 1/Rtotal = 1/R1 + 1/R2 = {calculateTotalResistance().toFixed(2)} Ω</Text>
          )}
          <Text style={styles.formulaText}>Current = {calculateCurrent().toFixed(2)} A</Text>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddToTable}>
          <Text style={styles.buttonText}>Add to Table</Text>
        </TouchableOpacity>

        {dataPoints.length > 0 && (
          <>
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>RL (Ω)</Text>
                <Text style={styles.tableHeaderText}>RR (Ω)</Text>
                <Text style={styles.tableHeaderText}>RT (Ω)</Text>
                <Text style={styles.tableHeaderText}>V (V)</Text>
                <Text style={styles.tableHeaderText}>I (A)</Text>
              </View>
              <View style={styles.tableContent}>
                {dataPoints.map((point, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{point.lampR}</Text>
                    <Text style={styles.tableCell}>{point.resistorR}</Text>
                    <Text style={styles.tableCell}>{point.totalR.toFixed(2)}</Text>
                    <Text style={styles.tableCell}>{point.voltage}</Text>
                    <Text style={styles.tableCell}>{point.current.toFixed(2)}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.resetButton} onPress={resetAll}>
                <Text style={styles.buttonText}>Reset All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.exportButton} onPress={exportData}>
                <Text style={styles.buttonText}>Export Data</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.chartWrapper}>
              <View style={styles.chartContainer}>
                <View ref={chartRef} collapsable={false}>
                  <LineChart
                    data={{
                      labels: dataPoints.map((dp) => dp.voltage.toString()),
                      datasets: [{ data: dataPoints.map((dp) => dp.current) }],
                    }}
                    width={Dimensions.get('window').width - 80}
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
                        r: '6',
                        strokeWidth: '2',
                        stroke: '#ffa726'
                      }
                    }}
                    bezier
                    style={styles.chart}
                    yAxisLabel=""
                    yAxisSuffix=" A"
                    xAxisLabel="V"
                  />
                </View>
              </View>
            </View>
            
            <TouchableOpacity style={styles.exportButton} onPress={exportChart}>
              <Text style={styles.buttonText}>Export Chart</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 4,
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
  inputIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
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
  disabledInput: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
  },
  formulaContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  formulaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  formulaText: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 4,
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
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    flex:1,
    marginLeft: 8,
    marginTop: 16,
  },
  resetButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    flex:1,
    marginLeft: 8,
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  tableContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  tableContent: {
    maxHeight: 200,
  },
  chartWrapper: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  tooltipText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default OhmsLawSimulator;

