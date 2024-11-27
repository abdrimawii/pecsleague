import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Image, ImageSourcePropType } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp,getApps } from 'firebase/app';

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

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];  

const db = getFirestore(app);

const teamImages: { [key: string]: ImageSourcePropType } = {
  potatoes: require('../teams/potatoes.png'),
  knights: require('../teams/knights.png'),
  polarbears: require('../teams/polarbears.png'),
  easternelite: require('../teams/easternelite.png'),
  panthers: require('../teams/panthers.png'),
};

const normalizeTeamName = (teamName: string): string => {
  return teamName.replace(/\s+/g, '').toLowerCase();
};

const MatchInformations: React.FC<any> = ({ route }) => {
  const [matchDetails, setMatchDetails] = useState<any>(null);
  const { matchId } = route.params || {}; 

  useEffect(() => {
    console.log('Match ID:', matchId);  
    if (!matchId) {
      console.error('No matchId passed!');
      return;
    }

    const fetchMatchDetails = async () => {
      try {
        const matchRef = doc(db, 'matches', matchId);
        const matchDoc = await getDoc(matchRef);
        if (matchDoc.exists()) {
          setMatchDetails(matchDoc.data());
        } else {
          console.log('No such match!');
        }
      } catch (error) {
        console.error('Error fetching match details:', error);
      }
    };

    fetchMatchDetails();
  }, [matchId]);

  if (!matchDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading match details...</Text>
      </View>
    );
  }

  const matchDate = new Date(matchDetails.matchDateTime);
  
  const dateStr = matchDate.toLocaleDateString();  
  const timeStr = matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });  
  const club1Logo = teamImages[normalizeTeamName(matchDetails.club1)];
  const club2Logo = teamImages[normalizeTeamName(matchDetails.club2)];
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      <Text style={styles.title}>Match Information</Text>
    
      <View style={styles.topBox}>
        <View style={styles.logosContainer}>
          {club1Logo && <Image source={club1Logo} style={styles.teamLogo} resizeMode="contain" />}
          <Text style={styles.clubText}>{matchDetails.club1}</Text>
        </View>

        <Text style={styles.vsText}>vs</Text>

        <View style={styles.logosContainer}>
          {club2Logo && <Image source={club2Logo} style={styles.teamLogo} resizeMode="contain" />}
          <Text style={styles.clubText}>{matchDetails.club2}</Text>
        </View>
      </View>

      <View style={styles.matchDetailsContainer}>
        <View style={styles.detailsRow}>
          <Text style={styles.matchDetailText}>Matchday {matchDetails.matchDay}</Text>
          <Text style={styles.stadiumText}>{matchDetails.stadiumName}</Text>
        </View>

        <View style={styles.detailsRow}>
          <Text style={styles.dateText}>{dateStr}</Text>
          <Text style={styles.timeText}>{timeStr}</Text>
        </View>
        <Image
        source={require('../footballfield.png')}
        style={styles.logo}  
        resizeMode="cover"
      />
            </View>

          </View>
        );
      };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F3F3F3FF',
  },
  title: {
    fontSize: 30,
    color: '#FFFFFFFF',
    fontFamily: 'BebasNeue-Regular',
    alignContent: 'center',
    top: -40,
    zIndex: 20,
  },
  topBox: {
    width: '100%',
    backgroundColor: '#9f00ff',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 30,
    paddingVertical: 20,
    top: -50,
    height: 250,
    borderBottomLeftRadius: 20,   
    borderBottomRightRadius: 20,  
  },
  logosContainer: {
    alignItems: 'center',  
    marginHorizontal: 20,  
  },
  teamLogo: {
    width: 70,
    height: 70,
  },
  clubText: {
    fontSize: 20,
    color: '#FFFFFF',
    marginTop: 5,
    fontFamily: 'BebasNeue-Regular',
  },
  vsText: {
    fontSize: 30,
    color: '#FFFFFF',
    fontFamily: 'Manrope-Regular',
    alignSelf: 'center',
    marginHorizontal: 20,  
  },
  matchDetailsContainer: {
    marginTop: -120,  
    width: '100%',
    paddingHorizontal: 20,
  },
  detailsRow: {
    flexDirection: 'row',  
    justifyContent: 'space-between',  
    marginBottom: 10,  
  },
  matchDetailText: {
    fontSize: 18,
    color: '#FFFFFFFF',
    fontFamily: 'Manrope-Regular',
  },
  stadiumText: {
    marginTop:2,
    fontSize: 18,
    color: '#FFFFFFFF',
    fontFamily: 'Manrope-Regular',
  },
  dateText: {
    marginTop:-180,
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Manrope-Regular',
  },
  timeText: {
    marginTop:-178,
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Manrope-Regular',
  },
  logo: {
    width: '100%',
    height: 300,  
    marginTop: 110,
    left:0,
    
  },
});

export default MatchInformations;
