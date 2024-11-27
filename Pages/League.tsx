import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
  StatusBar,
} from 'react-native';
import CustomNavbar from './CustomNavbar';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs,where,query } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
interface User {
  email: string;
  favClub: string | null;
}
interface Team {
  id: number;
  name: string;
  logo: any;
  background: any;
  positionImage: any;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
}

const teamLogos: { [key in "Eastern Elite" | "Knights" | "Panthers" | "Polar Bears" | "Potatoes"]: any } = {
  "Eastern Elite": require('./teams/easternelite.png'),
  "Knights": require('./teams/knights.png'),
  "Panthers": require('./teams/panthers.png'),
  "Polar Bears": require('./teams/polarbears.png'),
  "Potatoes": require('./teams/potatoes.png'),
};

const LeagueStandings: React.FC<any> = ({ navigation }) => {
  const xTranslation = useRef(new Animated.Value(0)).current; 
  const [teams, setTeams] = useState<Team[]>([]); 
  const [favClub, setFavClub] = useState<string | null>(null); 

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const standingsRef = collection(db, 'standings');  
        const standingsSnapshot = await getDocs(standingsRef);
        const standingsList = standingsSnapshot.docs.map(doc => doc.data());
  
        const updatedTeams = standingsList.map((team, index) => ({
          id: index + 1, 
          name: team.name, 
          played: team.played || 0, 
          wins: team.wins || 0,
          draws: team.draws || 0,
          losses: team.losses || 0,
          points: team.points || 0,
          logo: teamLogos[team.name as keyof typeof teamLogos],  
          background: require('../assets/images/cardbg.png'), 
          positionImage: require('../assets/images/pos.png'), 
        }));
  
        updatedTeams.sort((a, b) => b.points - a.points);
  
        setTeams(updatedTeams);  
        console.log('Fetched Standings:', updatedTeams); 
      } catch (error) {
        console.error('Error fetching standings:', error);
      }
    };

    fetchStandings(); 

    
    Animated.sequence([
      Animated.timing(xTranslation, {
        toValue: 100,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []); 
  useEffect(() => {
    const fetchUserFavClub = async () => {
      try {
        const userDetailsString = await AsyncStorage.getItem('userDetails');
        const userDetails = JSON.parse(userDetailsString || '{}');
    
        if (userDetails.email) {
          const usersCollection = collection(db, 'users');
          const userQuery = query(usersCollection, where('email', '==', userDetails.email));
          const userSnapshot = await getDocs(userQuery);
    
          if (!userSnapshot.empty) {
            const userDoc = userSnapshot.docs[0];
            const userData = userDoc.data() as User; 
            setFavClub(userData.favClub || null); 
            console.log('User\'s Favorite Club:', userData.favClub);
          }
        }
      } catch (error) {
        console.error('Error fetching favorite club:', error);
      }
    };

    fetchUserFavClub();
  }, []);

  return (
    <View style={styles.container}>
      <CustomNavbar navigation={navigation} />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      <View style={styles.topBox}>
        <Animated.Image
          source={require('../assets/images/trophyanim.png')}
          style={[styles.trophy, { transform: [{ translateX: xTranslation }] }]}/>
        <Image
          source={require('../assets/images/backgrounddots.png')}
          style={styles.backgroundDots}
          resizeMode="cover"/>
      </View>

      <Text style={styles.title}>League Standings</Text>

      <ScrollView style={styles.cardContainer} showsVerticalScrollIndicator={false}>
        {teams.map((team, index) => {
          const isFav = favClub === team.name; 
          return (
            <View key={index} style={styles.card}>
              <Image 
                source={team.background} 
                style={[
                  styles.cardBackground, 
                  isFav && { backgroundColor: 'rgba(159, 0, 255, 0.9)',borderRadius:1, } 
                ]}
                resizeMode="cover" 
              />
              <View style={styles.cardContent}>
                <Text style={styles.teamPosition}>{index + 1}</Text>
                <Image source={team.positionImage} style={styles.positionImage} />
                <Image source={team.logo} style={styles.teamLogo} />
                <Text style={styles.teamName}>{team.name}</Text>
                <View style={styles.statsContainer}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>P</Text>
                    <Text style={styles.statValue}>{team.played}</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>W</Text>
                    <Text style={styles.statValue}>{team.wins}</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>D</Text>
                    <Text style={styles.statValue}>{team.draws}</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>L</Text>
                    <Text style={styles.statValue}>{team.losses}</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>PTS</Text>
                    <Text style={styles.statValue}>{team.points}</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0FF',
    paddingTop: 40,
    padding: 20,
  },
  topBox: {
    width: '200%',
    height: 120,
    backgroundColor: '#9f00ff',
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
  title: {
    position: 'absolute',
    fontSize: 32,
    textAlign: 'left',
    top: '6%',
    left: 20,
    padding: 10,
    color: '#fff',
    fontFamily: 'BebasNeue-Regular',
    zIndex: 1000,
  },
  cardContainer: {
    marginTop: 105,
  },
  card: {
    width: '100%',
    height: 120,
    marginBottom: 0,
    borderRadius: 12,
    overflow: 'visible',
  },
  cardBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 1,
    left: 8,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  teamPosition: {
    position: 'absolute',
    fontSize: 40,
    color: '#FFFFFFFF',
    zIndex: 100,
    left: 22,
    fontFamily: 'BebasNeue-Regular',
  },
  positionImage: {
    width: 78,
    height: 50,
    position: 'absolute',
    top: 35,
    left: -7,
  },
  teamLogo: {
    width: 50,
    height: 50,
    marginRight: 21,
    right: -36,
  },
  teamName: {
    flex: 1,
    fontSize: 22,
    color: '#000',
    marginHorizontal: 18,
    fontFamily: 'BebasNeue-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: -14,
  },
  statBox: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#000',
    marginBottom: 2,
    fontWeight: '800',
  },
  statValue: {
    fontSize: 15,
    color: '#000',
  },
  backgroundDots: {
    opacity: 0.15,
    tintColor: '#fff',
    width: 320,
    height: 320,
  },
  trophy: {
    width: 110,
    height: 100,
    position: 'absolute',
    top: 35,
    left: 160,
    opacity:0.5,
  },
});

export default LeagueStandings;
