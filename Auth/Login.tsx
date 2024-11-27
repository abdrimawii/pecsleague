import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { initializeApp } from 'firebase/app'; 
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'; 
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

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
  
    try {
     const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        Alert.alert('Login Failed', 'Invalid email or password');
        return;
      }
  
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
  
      if (userData.password !== password) {
        Alert.alert('Login Failed', 'Invalid email or password');
        return;
      }
  
      const userToSave = {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: userData.password, 
        role: userData.role,
      };
  
      
      await AsyncStorage.setItem('userDetails', JSON.stringify(userToSave));

      console.log('User details saved to AsyncStorage:', userToSave);
  
      navigation.navigate('Dashboard', { userEmail: userData.email });
  
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };
  

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.topBox} />

      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

      <Image source={require('../assets/images/ic_launcher.png')} style={styles.logo} resizeMode="contain" />

      <Text style={styles.joinText}>SIGNIN</Text>

      <Text style={styles.createAccountText}>Sign into your Pécs League account</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity onPress={() => Alert.alert('Forgot Password pressed')}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.loginButtonWrapper}>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.infoText}>
        If you’ve signed into the app before, use the same credentials here. Otherwise...
      </Text>

      <Text style={styles.orText}>OR</Text>

      <View style={styles.signUpButtonWrapper}>
      <TouchableOpacity style={styles.SignUpbuttonContainer} onPress={() => navigation.goBack()}>
      <Text style={styles.buttonTextSignup}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.boxLeftWrapperSignUp}>
        <View style={styles.boxLeftSignUp} />
      </View>
      <View style={styles.boxRightWrapperSignUp}>
        <View style={styles.boxRightSignUp} />
      </View>

      <View style={styles.boxLeftWrapper}>
        <View style={styles.boxLeft} />
      </View>
      <View style={styles.boxRightWrapper}>
        <View style={styles.boxRight} />
      </View>
      <Image source={require('../assets/images/backgrounddots.png')} style={styles.backgroundDots} resizeMode="contain" />

    </SafeAreaView>
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
  topBox: {
    width: '200%',
    height: 170,
    backgroundColor: '#9f00ff',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  backgroundDots: {
    position: 'absolute',
    width: 400,
    height: 400,
    left: -5,
    transform: [{ rotate: '270deg' }],
    opacity:0.12,
    top:500,
  },
  logo: {
    position: 'absolute',
    top: '-2%',
    width: 100,
    height: 100,
    left: 35,
  },
  joinText: {
    position: 'absolute',
    fontSize: 145,
    textAlign: 'right',
    color: '#FFFFFF',
    fontFamily: 'BebasNeue-Regular',
    top: -10,
    opacity: 0.12,
    right: -10,
  },
  createAccountText: {
    position: 'absolute',
    fontSize: 27,
    color: '#FFFFFF',
    fontFamily: 'BebasNeue-Regular',
    top: 120,
    left: 30,
  },
  inputContainer: {
    marginTop: 30,
    width: '112%',
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#F7F7F7',
    marginBottom: 15,
    paddingLeft: 15,
    fontSize: 16,
    fontFamily: 'Manrope-Regular',
  },
  forgotPassword: {
    textAlign: 'right',
    fontSize: 14,
    color: '#000000',
    textDecorationLine: 'underline',
    marginBottom: 20,
    opacity: 0.8,
    fontFamily: 'Manrope-Regular',
  },
  loginButtonWrapper: {
    marginTop: 15,
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  signUpButtonWrapper: {
    marginTop: 15,
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  boxLeftWrapper: {
    position: 'absolute',
    top: '53%',
    left: 26,
    transform: [{ rotate: '45deg' }],
  },
  boxRightWrapper: {
    position: 'absolute',
    top: '53%',
    right: 25,
    transform: [{ rotate: '45deg' }],
  },
  boxLeftWrapperSignUp: {
    position: 'absolute',
    top: '75%',
    left: 26,
    transform: [{ rotate: '45deg' }],
  },
  boxRightWrapperSignUp: {
    position: 'absolute',
    top: '75%',
    right: 25,
    transform: [{ rotate: '45deg' }],
  },
  boxLeft: {
    width: 35,
    height: 35,
    backgroundColor: '#000000',
  },
  boxRight: {
    width: 35,
    height: 35,
    backgroundColor: '#000000',
  },
  boxLeftSignUp: {
    width: 35,
    height: 35,
    backgroundColor: '#CFCFCFFF',
    top: 11,
    left: 8,
  },
  boxRightSignUp: {
    width: 35,
    height: 35,
    backgroundColor: '#CFCFCFFF',
    top: 8,
    right: -19,
    left: 10,
  },
  buttonContainer: {
    backgroundColor: '#000000',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'BebasNeue-Regular',
  },
  infoText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
    fontFamily: 'Manrope-Regular',
    marginVertical: 10,
  },
  orText: {
    textAlign: 'center',
    fontSize: 22,
    color: '#333',
    fontFamily: 'Manrope-Regular',
    marginVertical: 10,
  },
  SignUpbuttonContainer: {
    backgroundColor: '#CFCFCFFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '90%',
    zIndex:5,
  },
  buttonTextSignup:{
    color:'#000',
    fontFamily:'BebasNeue-Regular',
    fontSize:18,
  }
});
