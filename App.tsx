import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, StatusBar, Image, Dimensions, TouchableOpacity, View, Animated } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';




import SignupScreen from './Auth/SignUp';
import ForgetPasswordScreen from './Auth/ForgetPassword';
import LoginScreen from './Auth/Login';

async function requestUserPermission() {
  const authorizationStatus = await messaging().requestPermission();

  if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    console.log('Notification permission authorized');
  } else if (authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
    console.log('Notification permission provisional');
  } else {
    console.log('Notification permission denied');
  }
}

import firebase from '@react-native-firebase/app'; 


import News from './Pages/Dashboard';
import League from './Pages/League'; 
import Matches from './Pages/Matches'; 
import Profile from './Pages/Profile'; 
import Admin from './Pages/Admin';


import MatchInformations from './Pages/Sub Pages/MatchInformations';









if (!firebase.apps.length) {
  
  firebase.initializeApp({
    apiKey: "AIzaSyC43l6Zufh0Pb0HiC37pRHI576lVexcUCs",
    authDomain: "pecsleague.firebaseapp.com",
    projectId: "pecsleague",
    storageBucket: "pecsleague.appspot.com",
    messagingSenderId: "130499422560",
    appId: "1:130499422560:android:e12727c32d00788c2a5605",
    measurementId: "G-XXXXXXX",
  });
} else {
  firebase.app();  
}


const { width, height } = Dimensions.get('window');

const Stack = createStackNavigator();

function HomeScreen({ navigation }: { navigation: any }) {
  const headerText = "PLAY, COMPETE, CONNECT."; 
  const [animatedLetters, setAnimatedLetters] = useState<any[]>([]);

  useEffect(() => {
    requestUserPermission();
    const letters = headerText.split('').map((letter, index) => ({
      text: letter,
      animation: new Animated.Value(0), 
    }));
    setAnimatedLetters(letters);

    
    const animations = letters.map((letter, index) => {
      return Animated.sequence([
        Animated.timing(letter.animation, {
          toValue: 1, 
          duration: 800,
          delay: index * 100, 
          useNativeDriver: false,
        }),
        Animated.timing(letter.animation, {
          toValue: 0, 
          duration: 800,
          useNativeDriver: false,
        }),
      ]);
    });

    
    Animated.loop(Animated.stagger(0, animations)).start();
  }, []);
  async function requestUserPermission() {
    const authorizationStatus = await messaging().requestPermission();
  
    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      console.log('Notification permission authorized');
    } else if (authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
      console.log('Notification permission provisional');
    } else {
      console.log('Notification permission denied');
    }
  }
  const getAnimatedStyle = (animation: Animated.Value) => {
    return {
      color: animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['#9f00ff', 'black'], 
      }),
    };
  };
  useEffect(() => {
    
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground Message:', remoteMessage);
      
    });
  
    return unsubscribe; 
  }, []);
  useEffect(() => {
    
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background Message:', remoteMessage);
      
    });
  }, []);

  useEffect(() => {
    
    const unsubscribeOnNotificationOpenedApp = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background state:', remoteMessage);
      
    });
  
    
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification caused app to open from terminated state:', remoteMessage);
          
        }
      });
  
    
    return unsubscribeOnNotificationOpenedApp;
  }, []);
  useEffect(() => {
    
    const getToken = async () => {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      
    };
  
    getToken();
  }, []);
  return (
    <SafeAreaView style={styles.background}>
      <Image
        source={require('./assets/images/backgrounddots.png')}
        style={styles.backgroundDots}
        resizeMode="cover"
      />
      <Image
        source={require('./assets/images/ic_launcher_round.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Image
        source={require('./assets/images/vector.png')}
        style={styles.vector}
        resizeMode="contain"
      />

      <Image
        source={require('./assets/images/black.png')}
        style={styles.girlBlack}
        resizeMode="contain"
      />

      <Image
        source={require('./assets/images/purple.png')}
        style={styles.girlPurple}
        resizeMode="contain"
      />

      <Image
        source={require('./assets/images/girl.png')}
        style={styles.girlMain}
        resizeMode="contain"
      />

      <Image
        source={require('./assets/images/vector1d.png')}
        style={styles.vector1d}
        resizeMode="contain"
      />

      <View style={styles.headerTextContainer}>
        <Text style={styles.headerText}>
          {animatedLetters.map((letter, index) => (
            <Animated.Text key={index} style={[styles.headerTextLetter, getAnimatedStyle(letter.animation)]}>
              {letter.text}
            </Animated.Text>
          ))}
        </Text>
      </View>

      <Text style={styles.subHeaderText}>
        Watch sports live or highlights, read every news from your smartphone.
      </Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonGrey} onPress={() => navigation.navigate('SignUp')} >
          <Text style={styles.buttonTextBlack}>Create Account</Text>
        </TouchableOpacity>
        
        <View style={styles.boxContainer}>
        <View style={styles.boxLeft} />
        <View style={styles.boxRight} />
      <View style={styles.boxContainerGrey}>
        <View style={styles.boxLeftGrey} />
        <View style={styles.boxRightGrey} />
      </View>
      </View>
      
      </View>    
     
    </SafeAreaView>
  );
}

export default function App() {

  
  return (
    <NavigationContainer>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      
      
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: 'transparent',
            shadowOpacity: 0,
            elevation: 0,
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen

          name="Login"
          component={LoginScreen}
          options={{
            headerTitle: '', 
            headerStyle: {
              backgroundColor: '#9f00ff',  
              shadowOpacity: 0,  
              elevation: 0,  
            },
            headerTintColor: '#fff',  
          }}
        />

        <Stack.Screen
          name="SignUp"
          component={SignupScreen}
          options={{
            headerTitle: '', 
            headerStyle: {
              backgroundColor: '#9f00ff',  
              shadowOpacity: 0,  
              elevation: 0,  
            },
            headerTintColor: '#fff',  
          }}
        />

        <Stack.Screen
          name="ForgetPassword"
          component={ForgetPasswordScreen}
          options={{
            headerTitle: '',
          }}
        />

      <Stack.Screen
          name="MatchInformations"
          component={MatchInformations}
          options={{
            headerTitle: '', 
            headerStyle: {
              backgroundColor: '#9f00ff',  
              shadowOpacity: 0,  
              elevation: 0,  
            },
            headerTintColor: '#fff',  
          }}
        />
        <Stack.Screen
          name="Dashboard"
          component={News}
          options={{
          headerShown: false, 
          animation:'fade'
          }}
        />

        <Stack.Screen
          name="League"
          component={League}
          options={{
            headerShown: false, animation:'fade' 
           
          }}
        />

        <Stack.Screen
          name="Matches"
          component={Matches}
          options={{
            headerShown: false,animation:'fade' 
           
          }}
        />

        <Stack.Screen
          name="Admin"
          component={Admin}
          options={{
            headerShown: false, animation:'fade' 
           
          }}

          
/>

<Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            headerShown: false, animation:'fade' 
           
          }}

          
/>
      </Stack.Navigator>


    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  backgroundDots: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: 350,
    height: 350,
    opacity: 0.1,
  },
  logo: {
    position: 'absolute',
    top: 60,
    left: 40,
    width: 85,
    height: 85,
  },
  vector: {
    position: 'absolute',
    top: 20,
    left: 100,
    width: 500,
    height: 500,
  },
  vector1d: {
    position: 'absolute',
    top: 20,
    left: 100,
    width: 500,
    height: 500,
  },
  girlBlack: {
    position: 'absolute',
    top: 10,
    left: -75,
    width: 550,
    height: 550,
  },
  girlPurple: {
    position: 'absolute',
    top: 6,
    left: -75,
    width: 550,
    height: 550,
  },
  girlMain: {
    position: 'absolute',
    top: 0,
    left: -85,
    width: 550,
    height: 550,
  },
  headerTextContainer: {
    marginTop: height * 0.58,
  },
  headerText: {
    fontSize: 70,
    textAlign: 'center',
    color: '#9f00ff',
    fontFamily: 'BebasNeue-Regular',
    letterSpacing: -4,
    lineHeight: 71,
  },
  headerTextLetter: {
    fontSize: 70,
    textAlign: 'center',
    fontFamily: 'BebasNeue-Regular',
  },
  subHeaderText: {
    padding: 5,
    fontSize: 20,
    textAlign: 'center',
    marginTop: -10,
    color: '#000000',
    fontFamily: 'BebasNeue-Regular',
  },
  buttonsContainer: {
    marginTop: -5,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#9f00ff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: width * 0.8, 
  },
  buttonGrey: {
    backgroundColor: '#CFCFCFFF', 
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: width * 0.8, 
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'BebasNeue-Regular',
    textAlign: 'center',
  },
  buttonTextBlack: {
    color: '#000000', 
    fontSize: 18,
    fontFamily: 'BebasNeue-Regular',
    textAlign: 'center',
  },

  boxContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height *0.021,  
    width: width * 0.8,  
    alignItems: 'center',
  },
  boxLeft: {
    width: 35,
    height: 35,  
    backgroundColor: '#9f00ff', 
    transform: [{ rotate: '45deg' }],  
    marginLeft:-16,
  },
  boxRight: {
    width: 35,  
    height: 35,  
    backgroundColor: '#9f00ff', 
    transform: [{ rotate: '45deg' }],  
    marginRight:-16,
  },
  boxContainerGrey: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.9,  
    width: width * 0.8,  
    alignItems: 'center',
  },
  boxLeftGrey: {
    marginTop:140,
    width: 35,
    height: 35,  
    backgroundColor: '#CFCFCFFF', 
    transform: [{ rotate: '45deg' }],  
    marginLeft:-16,
  },
  boxRightGrey: {
    marginTop:140,
    width: 35,  
    height: 35,  
    backgroundColor: '#CFCFCFFF', 
    transform: [{ rotate: '45deg' }],  
    marginRight:-16,
  },

});
