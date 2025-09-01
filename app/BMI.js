import axios from 'axios';
import { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BottomNavBar from './BottomNavBar';

export default function BMI({ navigation }) {
  const [weight, setWeight] = useState(65);
  const [height, setHeight] = useState(165);

  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState(null); // 'weight' or 'height'
  const [inputValue, setInputValue] = useState('');

  const [bmiHistory, setBmiHistory] = useState([]); // history array
  const [historyModalVisible, setHistoryModalVisible] = useState(false);

  const API_URL = "http://10.0.2.2:8080/api/bmi/calculate"; 

  const calculateBMI = () => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = (bmiValue) => {
    const bmiNum = parseFloat(bmiValue);
    if (bmiNum < 18.5) return 'Underweight';
    if (bmiNum >= 18.5 && bmiNum <= 24.9) return 'Normal';
    if (bmiNum >= 25 && bmiNum <= 29.9) return 'Overweight';
    return 'Obese';
  };

  const bmi = calculateBMI();
  const category = getBMICategory(bmi);

  const openModal = (field) => {
    setCurrentField(field);
    setInputValue(field === 'weight' ? weight.toString() : height.toString());
    setModalVisible(true);
  };

  const saveValue = () => {
    const numericValue = Number(inputValue);
    if (!isNaN(numericValue) && numericValue > 0) {
      if (currentField === 'weight') setWeight(numericValue);
      else if (currentField === 'height') setHeight(numericValue);
    }
    setModalVisible(false);
  };

  const saveBMI = async () => {
    try {
      const heightInMeters = height / 100;
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      const bmiCategory = getBMICategory(bmiValue);

      const saved = {
        weight,
        height: heightInMeters,
        bmiValue: parseFloat(bmiValue),
        category: bmiCategory,
      };

      // Update local history immediately
      setBmiHistory([saved, ...bmiHistory]);

      // Send to backend
      await axios.post(API_URL, {
        userId: "user123",
        weight,
        height: heightInMeters,
      });

      Alert.alert("Success", `BMI saved: ${saved.bmiValue.toFixed(1)} (${saved.category})`);
    } catch (error) {
      console.error("Error saving BMI:", error);
      Alert.alert("Error", "Failed to save BMI to backend.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.bmiValue}>{bmi}</Text>
      <Text
        style={[
          styles.bmiCategory,
          bmi >= 18.5 && bmi <= 24.9 && styles.bmiCategoryHighlight,
        ]}
      >
        {category}
      </Text>

      <View style={styles.measurementContainer}>
        {/* Weight */}
        <View style={styles.measurementItem}>
          <Text style={{ fontSize: 24, color: bmi >= 18.5 && bmi <= 24.9 ? '#c187e5' : '#2196F3' }}>⚖️</Text>
          <View style={styles.labelValueContainerLeft}>
            <Text style={styles.measurementLabel}>Weight</Text>
            <Text style={styles.measurementValue}>{weight} kg</Text>
          </View>
          <TouchableOpacity style={styles.updateButton} onPress={() => openModal('weight')}>
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>
        </View>

        {/* Height */}
        <View style={styles.measurementItem}>
          <Text style={{ fontSize: 24, color: bmi >= 18.5 && bmi <= 24.9 ? '#c187e5' : '#2196F3' }}>📏</Text>
          <View style={styles.labelValueContainerLeft}>
            <Text style={styles.measurementLabel}>Height</Text>
            <Text style={styles.measurementValue}>{height} cm</Text>
          </View>
          <TouchableOpacity style={styles.updateButton} onPress={() => openModal('height')}>
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.subHeader}>BMI Categories</Text>
      <View style={styles.categoryContainer}>
        <View style={styles.categoryRow}>
          <Text style={styles.categoryText}>Underweight</Text>
          <Text style={styles.categoryRange}>{'< 18.5'}</Text>
        </View>
        <View style={styles.categoryRow}>
          <Text style={[styles.categoryText, bmi >= 18.5 && bmi <= 24.9 && styles.categoryTextHighlight]}>
            Normal
          </Text>
          <Text style={styles.categoryRange}>18.5 - 24.9</Text>
        </View>
        <View style={styles.categoryRow}>
          <Text style={styles.categoryText}>Overweight</Text>
          <Text style={styles.categoryRange}>25 - 29.9</Text>
        </View>
        <View style={styles.categoryRow}>
          <Text style={styles.categoryText}>Obese</Text>
          <Text style={styles.categoryRange}>{'> 30'}</Text>
        </View>
      </View>

      {/* Save BMI Button */}
      <TouchableOpacity style={styles.saveBMIButton} onPress={saveBMI}>
        <Text style={styles.saveBMIButtonText}>Save BMI</Text>
      </TouchableOpacity>

      {/* History Button */}
      <TouchableOpacity style={styles.saveBMIButton} onPress={() => setHistoryModalVisible(true)}>
        <Text style={styles.saveBMIButtonText}>History</Text>
      </TouchableOpacity>

      {/* History Modal */}
      <Modal visible={historyModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Saved BMI History</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {bmiHistory.length > 0 ? (
                bmiHistory.map((entry, index) => (
                  <View key={index} style={{ marginBottom: 10 }}>
                    <Text>Weight: {entry.weight} kg</Text>
                    <Text>Height: {(entry.height * 100).toFixed(1)} cm</Text>
                    <Text>BMI: {entry.bmiValue.toFixed(1)}</Text>
                    <Text>Category: {entry.category}</Text>
                  </View>
                ))
              ) : (
                <Text>No BMI saved yet.</Text>
              )}
            </ScrollView>
            <TouchableOpacity onPress={() => setHistoryModalVisible(false)} style={{ marginTop: 15 }}>
              <Text style={{ textAlign: 'center', color: 'red' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for updating weight/height */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Update {currentField === 'weight' ? 'Weight' : 'Height'}</Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              value={inputValue}
              onChangeText={setInputValue}
            />
            <TouchableOpacity style={styles.saveButton} onPress={saveValue}>
              <Text style={styles.saveButtonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}>
              <Text style={{ textAlign: 'center', color: 'red' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomNavBar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingBottom: 70 },
  bmiValue: { fontSize: 48, fontWeight: 'bold', marginBottom: 10, color: '#333', textAlign: 'center' },
  bmiCategory: { fontSize: 20, marginBottom: 20, color: '#333', textAlign: 'center' },
  bmiCategoryHighlight: { color: '#c187e5' },
  measurementContainer: { marginBottom: 20 },
  measurementItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 10, padding: 15, marginBottom: 10 },
  labelValueContainerLeft: { marginLeft: 10, justifyContent: 'center' },
  measurementLabel: { fontSize: 16, color: '#333' },
  measurementValue: { fontSize: 16, color: '#333', marginTop: 5 },
  updateButton: { backgroundColor: '#c187e5', borderRadius: 8, paddingVertical: 5, paddingHorizontal: 10, marginLeft: 'auto' },
  updateButtonText: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
  subHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  categoryContainer: { backgroundColor: '#f9f9f9', borderRadius: 10, padding: 15 },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  categoryText: { fontSize: 16, color: '#333' },
  categoryTextHighlight: { color: '#c187e5' },
  categoryRange: { fontSize: 16, color: '#333' },
  saveBMIButton: { backgroundColor: '#c187e5', borderRadius: 8, padding: 12, marginTop: 10, alignItems: 'center' },
  saveBMIButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '80%', backgroundColor: '#fff', borderRadius: 15, padding: 20 },
  modalHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  modalInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16, marginBottom: 15, textAlign: 'center' },
  saveButton: { backgroundColor: '#c187e5', borderRadius: 8, padding: 12, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});