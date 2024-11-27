import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Image, TouchableOpacity, Modal, Pressable } from 'react-native';
import CustomNavbar from './CustomNavbar';
import ProfileEditorSettings from './ProfileSettings'; 
import FollowClub from './FollowClub'; 
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
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


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const Profile: React.FC<any> = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [profileSettingsModalVisible, setProfileSettingsModalVisible] = useState(false); 
  const [followClubModalVisible, setFollowClubModalVisible] = useState(false); 
  const [followedClub, setFollowedClub] = useState<string | null>(null);

  
  const handleProfileSettingsPress = () => {
    setProfileSettingsModalVisible(true); 
  };

  
  const handleFollowClubPress = () => {
    setFollowClubModalVisible(true); 
  };

  const handleCardPress = (message: string) => {
    setModalMessage(message);
    setModalVisible(true);
  };
  useEffect(() => {
    const fetchFollowedClub = async () => {
      try {
        
        const userDetailsString = await AsyncStorage.getItem('userDetails');
        const userDetails = JSON.parse(userDetailsString || '{}');
  
        if (!userDetails.email) throw new Error('User email not found');
  
        
        const usersCollection = collection(db, 'users');
        const userQuery = query(usersCollection, where('email', '==', userDetails.email));
        const userSnapshot = await getDocs(userQuery);
  
        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userData = userDoc.data();
  
          
          console.log('Favorite Club:', userData.favClub);
  
          setFollowedClub(userData.favClub || null);
        }
      } catch (error) {
        console.error('Error fetching followed club:', error);
      }
    };
  
    fetchFollowedClub();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

      <View style={styles.topBox}>
        <Image
          source={require('../assets/images/vectorwhite.png')}
          style={styles.vector}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/images/backgrounddots.png')}
          style={styles.backgroundDots}
          resizeMode="cover"
        />
      </View>

      <Image
        source={require('../assets/images/ic_launcher_round.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Your Profile</Text>
      <Text style={styles.subtitle}>Manage your personal information and settings here.</Text>

      <TouchableOpacity style={styles.card} onPress={handleProfileSettingsPress}>
        <View style={styles.cardContent}>
          <Text style={styles.cardHeader}>Profile Settings</Text>
          <Text style={styles.cardSubHeader}>Update your information, preferences, and settings</Text>
        </View>
      </TouchableOpacity>
      {profileSettingsModalVisible && (
        <ProfileEditorSettings
          visible={profileSettingsModalVisible}
          onClose={() => setProfileSettingsModalVisible(false)} 
        />
      )}
      <TouchableOpacity style={styles.card} onPress={handleFollowClubPress}>
        <View style={styles.cardContent}>
          <Text style={styles.cardHeader}>My Team</Text>
          <Text style={styles.cardSubHeader}>
            {followedClub
              ? `${followedClub}`
              : 'Follow your favorite team, stay updated with the latest news and scores'}
          </Text>
        </View>
      </TouchableOpacity>
      {followClubModalVisible && (
        <FollowClub
          visible={followClubModalVisible}
          onClose={() => setFollowClubModalVisible(false)} 
        />
      )}

      <Text style={styles.other}>Other Options</Text>

      <TouchableOpacity
        style={styles.cardOptions}
        onPress={() => handleCardPress('Please contact customer service at: aa.rimawi@gmail.com')}
      >
        <View style={styles.cardContent}>
          <Text style={styles.cardHeaderOptions}>Customer Support</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cardOptions}
        onPress={() => handleCardPress('Your data is securely processed and managed.')}
      >
        <View style={styles.cardContent}>
          <Text style={styles.cardHeaderOptions}>Privacy</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cardOptions}
        onPress={() =>
          handleCardPress(
            'Please enable notifications in your settings to allow our app to keep you updated with news and updates.',
          )
        }
      >
        <View style={styles.cardContent}>
          <Text style={styles.cardHeaderOptions}>Notifications</Text>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Custom Navbar */}
      <CustomNavbar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'center',
    backgroundColor: '#F3F3F3FF',
  },
  topBox: {
    width: '100%',
    height: 280, 
    backgroundColor: '#9f00ff',
    position: 'relative', 
    justifyContent: 'center', 
    alignItems: 'center', 
    overflow: 'hidden', 
  },
  vector: {
    position: 'absolute', 
    top: '10%', 
    width: '150%', 
    height: '150%', 
    opacity: 0.12, 
    left: '10%', 
  },
  logo: {
    position: 'absolute',
    top: '7%', 
    width: 100, 
    height: 100, 
    left: '6.5%', 
    zIndex: 1,
  },
  title: {
    fontSize: 30, 
    color: '#ffffff', 
    fontFamily: 'BebasNeue-Regular',
    top:'-12%',
    left:'-28%',
  },
  subtitle: {
    position:'absolute',
    fontSize: 16, 
    color: '#ffffff', 
    textAlign: 'left', 
    opacity: 0.8,
    top:'21.8%',
    padding:15,
    left:15,
    fontFamily: 'Manrope-Regular',
  },
  card: {
    top:'-2%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginTop: 10,
    width: '90%', 
    borderWidth: 1,
    borderColor: '#DBDBDBFF', 
  },
  cardContent: {
    flex: 1, 
  },
  cardHeader: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 25,
    color: '#000',
  },
  cardSubHeader: {
    fontSize: 14,
    color: '#000',
    marginTop: 5,
    fontFamily: 'Manrope-Regular',
    opacity:0.6,
  },
  plus: {
    fontSize: 48,
    color: '#000000',
    marginLeft: 10,
    fontFamily: 'Manrope-Regular',
  },
  other: {
    fontSize: 25, 
    color: '#000000FF', 
    fontFamily: 'BebasNeue-Regular',
    top:'0%',
    left:'-28%',
  },
  cardOptions: {
    top:'0.5%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginTop: 0,
    width: '90%', 
  },
  cardHeaderOptions: {
    fontFamily: 'Manrope-Regular',
    fontSize: 18,
    color: '#000',
    opacity:0.6,
    fontWeight:'medium',
  },
  backgroundDots: {
    opacity:0.15,
    tintColor:'#fff',
    width:300,
    height:300,
    right:80,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  closeButton: {
    backgroundColor: '#9f00ff',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  switch: {
    top:-25,
  }
});

export default Profile;
