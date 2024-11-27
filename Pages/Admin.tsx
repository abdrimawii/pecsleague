import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import CustomNavbar from './CustomNavbar';
import NewsfeedModal from './Modals/NewsfeedModal';
import MatchesModal from './Modals/MatchesModal'; 
import UpdateMatches from './UpdateMatches'; 
import LeagueUpdate from './LeagueUpdate'; 
import NotificationsModal from './NotificationsModal'; // Ensure the path is correct

export default function AdminScreen({ navigation }: { navigation: any }) {
  const [newsfeedModalVisible, setNewsfeedModalVisible] = useState(false);
  const [matchesModalVisible, setMatchesModalVisible] = useState(false); 
  const [updateMatchesModalVisible, setUpdateMatchesModalVisible] = useState(false); 
  const [leagueUpdateModalVisible, setLeagueUpdateModalVisible] = useState(false); 
  const [notificationsModalVisible, setNotificationsModalVisible] = useState(false); // New state for NotificationsModal

  const handleSaveNewsfeed = (headerText: string, imageUrl: string, subHeader: string) => {
    console.log('Saved Newsfeed:', { headerText, imageUrl, subHeader });
    setNewsfeedModalVisible(false);
  };

  const handleSaveMatch = (matchDetails: any) => {
    console.log('Saved Match:', matchDetails);
    setMatchesModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.topBox} />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

      <Image source={require('../assets/images/ic_launcher.png')} style={styles.logo} resizeMode="contain" />

      <Text style={styles.adminText}>ADMIN</Text>
      <Text style={styles.adminHeaderText}>Post, manage matches, and update the latest!</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setUpdateMatchesModalVisible(true)}>
          <Text style={styles.buttonText}>Update Matches</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => setMatchesModalVisible(true)}>
          <Text style={styles.buttonText}>Matches</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => setLeagueUpdateModalVisible(true)}>
          <Text style={styles.buttonText}>League</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => setNewsfeedModalVisible(true)}>
          <Text style={styles.buttonText}>Newsfeed</Text>
        </TouchableOpacity>

        {/* New button for Notifications */}
        <TouchableOpacity style={styles.button} onPress={() => setNotificationsModalVisible(true)}>
          <Text style={styles.buttonText}>Notifications</Text>
        </TouchableOpacity>
      </View>

      <NewsfeedModal
        visible={newsfeedModalVisible}
        onClose={() => setNewsfeedModalVisible(false)}
        onSave={handleSaveNewsfeed}
      />

      <MatchesModal
        visible={matchesModalVisible}
        onClose={() => setMatchesModalVisible(false)}
        onSave={handleSaveMatch}
      />

      <UpdateMatches
        visible={updateMatchesModalVisible}
        onClose={() => setUpdateMatchesModalVisible(false)} 
      />

      <LeagueUpdate
        visible={leagueUpdateModalVisible}
        onClose={() => setLeagueUpdateModalVisible(false)} 
      />

      {/* Add NotificationsModal */}
      <NotificationsModal
        visible={notificationsModalVisible}
        onClose={() => setNotificationsModalVisible(false)}
      />

      <CustomNavbar navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F3F3F3FF',
  },
  topBox: {
    width: '200%',
    height: 250,
    backgroundColor: '#9f00ff',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  logo: {
    position: 'absolute',
    top: '5%',
    width: 100,
    height: 100,
    left: 35,
  },
  adminText: {
    position: 'absolute',
    fontSize: 145,
    textAlign: 'right',
    color: '#FFFFFF',
    fontFamily: 'BebasNeue-Regular',
    top: 0,
    opacity: 0.12,
    right: -10,
  },
  adminHeaderText: {
    position: 'absolute',
    fontSize: 27,
    color: '#FFFFFF',
    fontFamily: 'BebasNeue-Regular',
    top: 160,
    left: 30,
  },
  buttonContainer: {
    marginTop: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#9f00ff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 25,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 22,
    fontFamily: 'BebasNeue-Regular',
  },
});
