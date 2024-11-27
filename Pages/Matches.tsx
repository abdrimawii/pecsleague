import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Animated, TouchableOpacity, Image, ImageBackground } from 'react-native';
import CustomNavbar from './CustomNavbar';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { ScrollView } from 'react-native-gesture-handler';


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
type TeamName = 'potatoes' | 'knights' | 'polarbears' | 'easternelite' | 'panthers';


const teamImages: Record<TeamName, any> = {
  potatoes: require('./teams/potatoes.png'),
  knights: require('./teams/knights.png'),
  polarbears: require('./teams/polarbears.png'), 
  easternelite: require('./teams/easternelite.png'),
  panthers: require('./teams/panthers.png'),
};


const normalizeTeamName = (teamName: string): TeamName => {
  
  return teamName.replace(/\s+/g, '').toLowerCase() as TeamName;
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Matches: React.FC<any> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [matches, setMatches] = useState<any[]>([]); 
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const underlineAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false); 
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'matches')); 
      const matchesData = querySnapshot.docs.map(doc => ({
        id: doc.id, 
        ...doc.data() 
      }));
      console.log('Fetched Matches Data:', matchesData);
      setMatches(matchesData); 
    } catch (error) {
      console.error('Error fetching matches data:', error);
    }
  };

  useEffect(() => {
    fetchData(); 
    
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000, 
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 1000, 
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000, 
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [rotateAnim, scaleAnim, bounceAnim]);

  useEffect(() => {
    Animated.timing(underlineAnim, {
      toValue: activeTab === 'Upcoming' ? 0 : 1,
      duration: 450,
      useNativeDriver: false,
    }).start();
  }, [activeTab]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const translateY = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  const underlinePosition = underlineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 128],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

      <View style={styles.topBox}>
        <Animated.Image
          source={require('../assets/images/vectorball.png')}
          style={[
            styles.vector,
            {
              transform: [
                { rotate }, 
                { scale: scaleAnim }, 
                { translateY }, 
              ],
            },
          ]}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/images/backgrounddots.png')}
          style={styles.backgroundDots}
          resizeMode="cover"
        />
      </View>

      <Text style={styles.title}>Matches</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('Upcoming')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'Upcoming' ? styles.activeTabText : { opacity: 0.6 },
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('Past')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'Past' ? styles.activeTabText : { opacity: 0.6 },
            ]}
          >
            Past Matches
          </Text>
        </TouchableOpacity>

        <Animated.View style={[styles.underline, { left: underlinePosition }]} />
      </View>

      <Text style={styles.subtitle}>
        {activeTab === 'Upcoming' ? 'Here are the next scheduled matches.' : 'View previous match results.'}
      </Text>
      <ScrollView contentContainerStyle={[styles.scrollContainer, { flexGrow: 3 }]}>
  {matches
  .filter((match) => (activeTab === 'Upcoming' ? match.upcoming : !match.upcoming)) 
  .map((match, index) => {
    console.log('Match ID:', match.id);  
    return (
      <TouchableOpacity
        key={index}
        style={styles.card}
        onPress={() => navigation.navigate('MatchInformations', { matchId: match.id })}  
      >
        <ImageBackground
          source={require('../assets/images/matchesbackground.png')}
          style={styles.cardBackground}
          imageStyle={styles.cardImage}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardLeft}>
              <View style={styles.logoContainer}>
                <Animated.Image
                  source={teamImages[normalizeTeamName(match.club1)]} 
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.clubText}>{match.club1}</Text>
            </View>

            <View style={styles.cardRight}>
              <Text style={styles.clubText}>{match.club2}</Text>
              <View style={styles.logoContainer}>
                <Animated.Image
                  source={teamImages[normalizeTeamName(match.club2)]} 
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.time}>
                {new Date(match.matchDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>

          <View style={styles.matchDayInfo}>
            <Text style={styles.matchDay}>Matchday {match.matchDay}</Text>
            <Text style={styles.stadium}>{match.stadiumName}</Text>
            <Text style={styles.date}>{new Date(match.matchDateTime).toLocaleDateString()}</Text>
          </View>

          {!match.upcoming && match.scoreAwayTeam !== undefined && match.scoreHomeTeam !== undefined && (
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>
                {match.scoreHomeTeam !== null && match.scoreAwayTeam !== null
                  ? `${match.scoreHomeTeam} - ${match.scoreAwayTeam}`
                  : 'No score available'}
              </Text>
            </View>
          )}

          <Animated.Image
            source={require('../assets/images/arrow.png')}
            style={styles.arrowImage}
            resizeMode="contain"
          />
        </ImageBackground>
      </TouchableOpacity>
    );
  })}
</ScrollView>
      <CustomNavbar navigation={navigation} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3F3FF',
  },
  scrollContainer: {
    flexGrow: 3,
    paddingBottom: 500,  
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
  },
  subtitle: {
    marginTop: 20,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    fontFamily: 'Manrope-Regular',
    opacity:0.6,
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
  vector: {
    position: 'absolute',
    top: '0%',
    width: '120%',
    height: '120%',
    opacity: 0.2,
    left: '-25%',
  },
  tabContainer: {
    marginTop: 140,
    flexDirection: 'row',
    justifyContent: 'flex-start', 
    paddingHorizontal: 20, 
  },
  tab: {
    marginRight: 40, 
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 22,
    color: '#555',
    fontFamily: 'BebasNeue-Regular',
  },
  activeTabText: {
    color: '#9f00ff',
    fontFamily: 'BebasNeue-Regular',
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    height: 2.25,
    width: 100, 
    backgroundColor: '#9f00ff',
    borderRadius: 5,
  },
  card: {
    top:'-7%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    marginTop: 75,
    width: '90%',
    height: '15%',
    borderWidth: 1,
    borderColor: '#E7E4E4FF',
    backgroundColor: '#EDEDED',
    alignSelf: 'center', 
    borderRadius: 8, 
    position: 'relative', 
    marginBottom:65,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    position: 'relative', 
  },
  logoContainer: {
    width: 45,
    height: 45,
    marginRight: 10,
  },
  logo: {
    width: '125%',
    height: '125%',
  },
  clubText: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 24,
    color: '#333',
  },
  time: {
    position: 'absolute',
    top: -35,
    right: 5,
    fontSize: 16,
    color: '#000',
    fontFamily: 'Manrope-Regular',
  },
  topBoxInfo: {
    position: 'absolute',
    top: -30, 
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  leagueMatch: {
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    color: '#000',
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 4,
    marginBottom: 5,
  },
  cardBackground: {
    flex: 1,
  },
  cardImage: {
    height:185,
    width:'109%',
    left:-15,
    top:-45,
    resizeMode: 'cover',
  },
  matchDayInfo: {
    position: 'absolute',
    bottom: 10, 
    left: 15,
    width: '90%',
    paddingHorizontal: 10,
  },
  matchDay: {
    position: 'absolute',
    fontFamily: 'Manrope-Regular',
    fontSize: 16,
    color: '#fff',
    marginTop:68,
    left:200,
 
  },
  stadium: {
    position: 'absolute',
    fontFamily: 'Manrope-Regular',
    fontSize: 17,
    color: '#fff',
    marginTop:66,
    left:-6,
  },
  date: {
    position: 'absolute',
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    color: '#000',
    marginTop:-67,
    left:-9,
  },
  arrowImage: {
    position: 'absolute',
    bottom: -93,  
    right: -15,   
    width: 45,   
    height: 45,  
  },
  backgroundDots:{
    opacity:0.15,
    tintColor:'#fff',
    width:300,
    height:300,
    right:50,
  },
  scoreContainer: {
    position: 'absolute',
    bottom: 40, 
    left: 15,   
    width: '90%',
    alignItems: 'center',
  },
  scoreText: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 35,
    color: '#000',
  },
});

export default Matches;
