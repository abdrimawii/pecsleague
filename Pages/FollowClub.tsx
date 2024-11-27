import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: 'AIzaSyC43l6Zufh0Pb0HiC37pRHI576lVexcUCs',
  authDomain: 'pecsleague.firebaseapp.com',
  databaseURL: 'https://pecsleague-default-rtdb.europe-west1.firebasedatabase.app',
  storageBucket: 'pecsleague.appspot.com',
  messagingSenderId: '130499422560',
  appId: '1:130499422560:android:e12727c32d00788c2a5605',
  measurementId: 'G-XXXXXXXXXX',
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface FollowClubProps {
  visible: boolean;
  onClose: () => void;
}

const FollowClub: React.FC<FollowClubProps> = ({ visible, onClose }) => {
  const [selectedClub, setSelectedClub] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const clubs = ['Eastern Elite', 'Knights', 'Panthers', 'Polar Bears', 'Potatoes'];

  
  useEffect(() => {
    const fetchUserId = async () => {
      setLoading(true);
      try {
        const userDetailsString = await AsyncStorage.getItem('userDetails');
        const userDetails = JSON.parse(userDetailsString || '{}');
        const { email } = userDetails;

        if (!email) throw new Error('Email not found in storage');

        const usersCollection = collection(db, 'users');
        const userQuery = query(usersCollection, where('email', '==', email));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0]; 
          setUserId(userDoc.id);
        } else {
          throw new Error('No user found with this email');
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      } finally {
        setLoading(false);
      }
    };

    if (visible) fetchUserId();
  }, [visible]);

  const handleClubSelect = (club: string) => {
    setSelectedClub(club);
  };

  const handleSave = async () => {
    if (!selectedClub) {
      Alert.alert('Error', 'Please select a club to follow.');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User not found.');
      return;
    }

    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { favClub: selectedClub });

      Alert.alert('Success', `You are now following ${selectedClub}!`);
      onClose(); 
    } catch (error) {
      console.error('Error updating favorite club:', error);
      Alert.alert('Error', 'Failed to follow the selected club. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Modal visible={visible} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="#9f00ff" />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.header}>Follow Your Favorite Club</Text>

          <FlatList
            data={clubs}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.clubCard,
                  selectedClub === item && styles.selectedCard,
                ]}
                onPress={() => handleClubSelect(item)}
              >
                <Text
                  style={[
                    styles.clubName,
                    selectedClub === item && styles.selectedText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  clubCard: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCard: {
    backgroundColor: '#9f00ff',
    borderColor: '#9f00ff',
  },
  clubName: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#9f00ff',
    padding: 12,
    borderRadius: 5,
    marginRight: 10,
  },
  saveButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
  },
});

export default FollowClub;
