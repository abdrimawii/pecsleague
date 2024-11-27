import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

interface MatchesModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (matchDetails: any) => void;
}

const MatchesModal: React.FC<MatchesModalProps> = ({ visible, onClose, onSave }) => {
  const [club1, setClub1] = useState<string>('none');
  const [club2, setClub2] = useState<string>('none');
  const [matchDate, setMatchDate] = useState<Date | null>(null);
  const [matchTime, setMatchTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [stadiumName, setStadiumName] = useState<string>('');
  const [matchDay, setMatchDay] = useState<string>(''); 

  const clubs = ['Eastern Elite', 'Knights', 'Panthers', 'Polar Bears', 'Potatoes'];

  const db = getFirestore();

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setMatchDate(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setMatchTime(selectedTime);
    }
  };

  const handleSave = async () => {
    if (club1 === 'none' || club2 === 'none') {
      Alert.alert('Error', 'Please select both Home and Away clubs');
      return;
    }

    if (!club1 || !club2 || !matchDate || !matchTime || !stadiumName || !matchDay) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    if (club1 === club2) {
      Alert.alert('Error', 'Home and Away clubs cannot be the same');
      return;
    }

    
    const matchDayNumber = parseInt(matchDay);
    if (isNaN(matchDayNumber) || matchDayNumber < 0 || matchDayNumber > 99) {
      Alert.alert('Error', 'Match day must be a number between 0 and 99');
      return;
    }

    const fullMatchDateTime = new Date(matchDate);
    fullMatchDateTime.setHours(matchTime?.getHours() || 0);
    fullMatchDateTime.setMinutes(matchTime?.getMinutes() || 0);

    const matchDetails = {
      club1,
      club2,
      matchDateTime: fullMatchDateTime.toISOString(),
      stadiumName,
      matchDay: matchDayNumber,
      upcoming: true,
    };

    try {
      const matchesRef = collection(db, 'matches');
      await addDoc(matchesRef, matchDetails);

      Alert.alert('Success', 'Match details posted successfully');
      onSave(matchDetails);
      onClose();
    } catch (error) {
      console.error('Error posting match details:', error);
      Alert.alert('Error', 'Failed to post match details. Please try again.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>Match Details</Text>

          <Text>Select Club Home</Text>
          <Picker
            selectedValue={club1}
            style={styles.picker}
            onValueChange={(itemValue) => setClub1(itemValue)}>
            <Picker.Item label="None" value="none" />
            {clubs.map((club, index) => (
              <Picker.Item key={index} label={club} value={club} />
            ))}
          </Picker>

          <Text>Select Club Away</Text>
          <Picker
            selectedValue={club2}
            style={styles.picker}
            onValueChange={(itemValue) => setClub2(itemValue)}>
            <Picker.Item label="None" value="none" />
            {clubs.map((club, index) => (
              <Picker.Item key={index} label={club} value={club} />
            ))}
          </Picker>

          <Text>Match Date</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}>
            <Text style={styles.datePickerButtonText}>
              {matchDate ? matchDate.toLocaleDateString() : 'Select Date'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={matchDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
          )}

          <Text>Match Time</Text>
          <TouchableOpacity
            style={styles.timePickerButton}
            onPress={() => setShowTimePicker(true)}>
            <Text style={styles.timePickerButtonText}>
              {matchTime ? matchTime.toLocaleTimeString() : 'Select Time'}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={matchTime || new Date()}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimeChange}
            />
          )}

          <Text>Match Day (0-99)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter match day (0-99)"
            keyboardType="numeric"
            value={matchDay}
            onChangeText={setMatchDay}
          />

          <Text>Stadium Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter stadium name"
            value={stadiumName}
            onChangeText={setStadiumName}
          />

          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Post Match</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 20,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  datePickerButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    width: '100%',
  },
  datePickerButtonText: {
    color: '#000',
    fontSize: 16,
  },
  timePickerButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    width: '100%',
  },
  timePickerButtonText: {
    color: '#000',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#9f00ff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MatchesModal;
