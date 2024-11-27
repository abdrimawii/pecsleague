import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { initializeApp,getApps } from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyC43l6Zufh0Pb0HiC37pRHI576lVexcUCs",
  authDomain: "pecsleague.firebaseapp.com",
  databaseURL: "https://pecsleague-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pecsleague",
  storageBucket: "pecsleague.appspot.com",
  messagingSenderId: "130499422560",
  appId: "1:130499422560:android:e12727c32d00788c2a5605",
  measurementId: "G-XXXXXXXXXX",
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];  
const db = getFirestore(app);

interface ProfileSettingsProps {
  visible: boolean;
  onClose: () => void;
}

const ProfileEditorSettings: React.FC<ProfileSettingsProps> = ({ visible, onClose }) => {
  const [userDetails, setUserDetails] = useState<any>(null); 
  const [loading, setLoading] = useState(true); 
  const [updatedDetails, setUpdatedDetails] = useState<any>({}); 

  
  useEffect(() => {
    const fetchUserDetails = async () => {
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
          setUserDetails({ ...userDoc.data(), id: userDoc.id });
          setUpdatedDetails({
            firstName: userDoc.data().firstName,
            lastName: userDoc.data().lastName,
            password: userDoc.data().password,
          });
        } else {
          throw new Error('No user found with this email');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (visible) fetchUserDetails();
  }, [visible]);

  
  const handleChange = (field: string, value: string) => {
    setUpdatedDetails((prev: any) => ({ ...prev, [field]: value }));
  };

  
  const handleSave = async () => {
    if (!userDetails?.id) return;

    try {
      const userDocRef = doc(db, 'users', userDetails.id);
      await updateDoc(userDocRef, updatedDetails);
      Alert.alert('Profile updated successfully');
      onClose(); 
    } catch (error) {
      console.error('Error updating user:', error);
      Alert.alert('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <Modal visible={visible} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#9f00ff" />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.header}>Edit Profile Settings</Text>

          <Text style={styles.label}>Email (not editable)</Text>
          <Text style={styles.emailText}>{userDetails.email}</Text>

          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={updatedDetails.firstName}
            onChangeText={(text) => handleChange('firstName', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={updatedDetails.lastName}
            onChangeText={(text) => handleChange('lastName', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={updatedDetails.password}
            secureTextEntry
            onChangeText={(text) => handleChange('password', text)}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.saveButton]} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.cancelButton]} onPress={onClose}>
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
  modalContent: {
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
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  emailText: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#9f00ff',
    padding: 10,
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
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
  },
});

export default ProfileEditorSettings;
