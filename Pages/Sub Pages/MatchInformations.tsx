import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Image, TouchableOpacity, ScrollView } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { playersDatabase } from './dataplayers';

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

const teamImages: { [key: string]: any } = {
  potatoes: require('../teams/potatoes.png'),
  knights: require('../teams/knights.png'),
  polarbears: require('../teams/polarbears.png'),
  easternelite: require('../teams/easternelite.png'),
  panthers: require('../teams/panthers.png'),
};

const playerIcon = require('../playericon.png');  

type TeamName = 'potatoes' | 'knights' | 'polarbears' | 'easternelite' | 'panthers';

interface Player {
  name: string;
  position: string;
}

const normalizeTeamName = (teamName: string): TeamName => {
  return teamName.replace(/\s+/g, '').toLowerCase() as TeamName;
};

const MatchInformations: React.FC<any> = ({ route }) => {
  const [matchDetails, setMatchDetails] = useState<any>(null);
  const [selectedTeam, setSelectedTeam] = useState<string>('club1');
  const { matchId } = route.params || {};

  useEffect(() => {
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
  const vsText = matchDetails.upcoming
    ? 'vs'
    : `${matchDetails.scoreHomeTeam} : ${matchDetails.scoreAwayTeam}`;
  const matchDate = new Date(matchDetails.matchDateTime);
  const dateStr = matchDate.toLocaleDateString();
  const timeStr = matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const club1Name = matchDetails.club1;
  const club2Name = matchDetails.club2;

  const club1Logo = teamImages[normalizeTeamName(club1Name)];
  const club2Logo = teamImages[normalizeTeamName(club2Name)];

  const selectedPlayers = playersDatabase[normalizeTeamName(matchDetails[selectedTeam]) as TeamName];

  
  const forwards = selectedPlayers.filter(player => 
    player.position === 'LW' || player.position === 'ST' || player.position === 'RW');
  
  
  const leftWing = forwards.find(player => player.position === 'LW');
  const rightWing = forwards.find(player => player.position === 'RW');
  const striker = forwards.find(player => player.position === 'ST');
  
  
  const orderedForwards = [leftWing, striker, rightWing];  const midfielders = selectedPlayers.filter(player => player.position === 'CM');
  const defenders = selectedPlayers.filter(player => player.position === 'LB' || player.position === 'CB' || player.position === 'RB');
  const goalkeeper = selectedPlayers.filter(player => player.position === 'GK');

  
  const starters = [...forwards.slice(0, 3), ...midfielders.slice(0, 3), ...defenders.slice(0, 4), ...goalkeeper.slice(0, 1)];
  const substitutes = selectedPlayers.slice(11);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      <Text style={styles.title}>Match Information</Text>
      <View style={styles.topBox}>
        <View style={styles.logosContainer}>
          <TouchableOpacity onPress={() => setSelectedTeam('club1')}>
            <View style={[styles.logoWrapper, selectedTeam === 'club1' && styles.selectedLogo]}>
              <Image source={club1Logo} style={styles.teamLogo} resizeMode="contain" />
            </View>
          </TouchableOpacity>
          <Text style={styles.clubText}>{club1Name}</Text>
        </View>

        <Text style={styles.vsText}>{vsText}</Text>

        <View style={styles.logosContainer}>
          <TouchableOpacity onPress={() => setSelectedTeam('club2')}>
            <View style={[styles.logoWrapper, selectedTeam === 'club2' && styles.selectedLogo]}>
              <Image source={club2Logo} style={styles.teamLogo} resizeMode="contain" />
            </View>
          </TouchableOpacity>
          <Text style={styles.clubText}>{club2Name}</Text>
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
        
        <View style={styles.fieldContainer}>
          <Image source={require('../field.png')} style={styles.fieldImage} />
          
          <View style={styles.formation}>
            {/* Forward row: LW, ST, RW */}
            <View style={styles.row}>
          {orderedForwards.map((player, index) => player && (
            <View key={index} style={styles.playerWrapper}>
              <Image source={playerIcon} style={styles.playerIcon} />
              <Text 
  style={styles.playerText} 
  numberOfLines={1} 
  ellipsizeMode="tail"
>
  {player.name}
</Text>
              <Text style={styles.playerPosition}>{player.position}</Text>
            </View>
          ))}
            </View>

            {/* Midfield row: CM, CM, CM */}
            <View style={styles.row}>
              {midfielders.slice(0, 3).map((player, index) => (
                <View key={index} style={styles.playerWrapper}>
                <Image source={playerIcon} style={styles.playerIcon} />
                <Text 
                  style={styles.playerText} 
                  numberOfLines={1} 
                  ellipsizeMode="tail"
                >
                  {player.name}
                </Text>
                <Text style={styles.playerPosition}>{player.position}</Text>
              </View>
              ))}
            </View>

            {/* Defense row: LB, CB, CB, RB */}
            <View style={styles.row}>
              {defenders.slice(0, 4).map((player, index) => (
                <View key={index} style={styles.playerWrapper}>
                  <Image source={playerIcon} style={styles.playerIcon} />
                  <Text style={styles.playerText}>{player.name}</Text>
                  <Text style={styles.playerPosition}>{player.position}</Text>
                </View>
              ))}
            </View>

            {/* Goalkeeper row: GK */}
            <View style={[styles.goalkeeperWrapper]}>
            {goalkeeper.slice(0, 1).map((player, index) => (
              <View key={index} style={styles.playerWrapper}>
                <Image source={playerIcon} style={styles.playerIcon} />
                <Text style={styles.playerText}>{player.name}</Text>
                <Text style={styles.playerPosition}>{player.position}</Text>
              </View>
            ))}
            </View>
          </View>
        </View>

        <View style={styles.substitutesContainer}>
          <Text style={styles.substitutesText}>Substitutes</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={styles.substitutePlayersWrapper}>
              {substitutes.map((player, index) => (
                <View key={index} style={styles.substitutePlayerWrapper}>
                  <Image source={playerIcon} style={styles.playerIcon} />
                  <Text style={styles.substitutePlayer}>{player.name}</Text>
                  <Text style={styles.substitutePlayerPosition}>{player.position}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
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
    color: '#FFFFFF',
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
  logoWrapper: {
    borderRadius: 35,
    padding: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedLogo: {
    borderColor: 'white',
  },
  teamLogo: {
    width: 80,
    height: 80,
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
    marginTop: -115,  
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
    color: '#FFFFFF',
    fontFamily: 'Manrope-Regular',
  },
  stadiumText: {
    marginTop: 2,
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Manrope-Regular',
  },
  dateText: {
    marginTop: -194,
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Manrope-Regular',
  },
  timeText: {
    marginTop: -198,
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Manrope-Regular',
  },
  fieldContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 30,
    position: 'relative',
  },
  fieldImage: {
    width: '115%',
    height: 315,
    position: 'absolute',
    top: 46,
    transform: [{ rotate: '90deg' }],
    borderRadius: 40,  // Add this to round the corners
},
  formation:{
    position: 'absolute',
    top: 20,
    left: '33%',
    transform: [{ translateX: -90 }],  
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  playerWrapper: {
    flexDirection: 'column', 
    alignItems: 'center',
    marginHorizontal: 4, 
  },
  playerIcon: {
    width: 50, 
    height: 50, 
    marginBottom: 5, 
    tintColor:'black'
  },
  playerText: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Manrope-Regular',
    textAlign: 'center',
    width: 70,  
    overflow: 'hidden',  
    flexShrink: 1,  
},
  playerPosition: {
    color: '#555',
    fontSize: 12,
    fontFamily: 'Manrope-Regular',
    textAlign: 'center',
  },
  substitutesContainer: {
    marginTop: 410,
    alignItems: 'flex-start',
  },
  substitutesText: {
    fontSize: 18,
    fontFamily: 'Manrope-Regular',
    color: '#000',
    textAlign: 'center',
  },
  substitutePlayersWrapper: {
    flexDirection: 'row', 
    justifyContent: 'space-evenly',
    paddingVertical: 5, 
    
  },
  substitutePlayerWrapper: {
    marginRight: 15,
  },
  substitutePlayer: {
    fontSize: 14,
    fontFamily: 'Manrope-Regular',
    color: '#333',
  },
  substitutePlayerPosition: {
    fontSize: 12,
    fontFamily: 'Manrope-Regular',
    color: '#555',
  },
  goalkeeperWrapper: {
    position: 'absolute',
    bottom: -75, 
    left: '36%',  
  },
});

export default MatchInformations;
