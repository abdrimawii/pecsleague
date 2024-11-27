import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';  

interface NewsfeedModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (headerText: string, imageUrl: string, subHeader: string) => void;
}

const firebaseConfig = {
  apiKey: "AIzaSyC43l6Zufh0Pb0HiC37pRHI576lVexcUCs",
  authDomain: "pecsleague.firebaseapp.com",
  databaseURL: "https://pecsleague-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pecsleague",
  storageBucket: "pecsleague.appspot.com",
  messagingSenderId: "130499422560",
  appId: "1:130499422560:android:e12727c32d00788c2a5605",
  measurementId: "G-XXXXXXXXXX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const NewsfeedModal: React.FC<NewsfeedModalProps> = ({ visible, onClose, onSave }) => {
  const [headerText, setHeaderText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [subHeader, setSubHeader] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userDetails = await AsyncStorage.getItem('userDetails');
        if (userDetails) {
          const parsedUserDetails = JSON.parse(userDetails);
          setUserFirstName(parsedUserDetails.firstName);
          setUserLastName(parsedUserDetails.lastName);
        }
      } catch (error) {
        console.error('Error retrieving user details:', error);
      }
    };

    getUserInfo();
  }, []);

  const handleSave = async () => {
    try {
      const docRef = await addDoc(collection(db, 'posts'), {
        headerText,
        imageUrl,
        subHeader,
        likesCount: 0, 
        comments: [], 
        createdAt: Timestamp.fromDate(new Date()), 
        postedBy: `${userFirstName} ${userLastName}`, 
      });
      console.log('Post saved successfully with ID:', docRef.id);
      Alert.alert('Success', 'Post saved successfully!');

      setHeaderText('');
      setImageUrl('');
      setSubHeader('');

      
      onSave(headerText, imageUrl, subHeader);

    } catch (error) {
      console.error('Error saving post:', error);
      setSuccessMessage('Failed to save post. Please try again.');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Newsfeed</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter Header Text"
            value={headerText}
            onChangeText={(text) => setHeaderText(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter Image URL"
            value={imageUrl}
            onChangeText={(text) => setImageUrl(text)}
          />

          <Text style={styles.imageUrlRecommendation}>
            Imgur is recommended for image hosting.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter Sub Header"
            value={subHeader}
            onChangeText={(text) => setSubHeader(text)}
          />

          <Text style={styles.uneditableText}>Likes: 0</Text>

          <Text style={styles.uneditableText}>Comments: None</Text>

          {successMessage ? (
            <Text style={styles.successMessage}>{successMessage}</Text>
          ) : null}

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#9f00ff',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  imageUrlRecommendation: {
    color: '#888',
    fontSize: 14,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  uneditableText: {
    color: '#888',
    fontSize: 16,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  successMessage: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  saveButton: {
    backgroundColor: '#9f00ff',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NewsfeedModal;
