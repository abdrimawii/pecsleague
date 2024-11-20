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
import BouncyCheckbox from 'react-native-bouncy-checkbox';


import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import {  query, where, getDocs } from 'firebase/firestore';

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


export default function SignupScreen({ navigation }: { navigation: any }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

//tishko@outlok.com
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    if (!isValidPassword(password)) {
      Alert.alert(
        'Error',
        'Password must be at least 8 characters long and include at least one capital letter.'
      );
      return;
    }

    if (!agreeToTerms) {
      Alert.alert('Error', 'You must agree to the terms and privacy policy to continue.');
      return;
    }

    try {
      const usersCollection = collection(db, 'users');
      const emailQuery = query(usersCollection, where('email', '==', email));
      const querySnapshot = await getDocs(emailQuery);
  
      if (!querySnapshot.empty) {
        Alert.alert('Error', 'An account with this email already exists.');
        return;
      }
  
      await addDoc(usersCollection, {
        firstName,
        lastName,
        email,
        password,
        role: 'user', // Default role
      });
  
      Alert.alert('Sign Up Successful', 'Your account has been created.');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error adding document: ', error);
      Alert.alert('Error', 'Could not create your account. Please try again later.');
    }
  };

  return (
    <SafeAreaView style={styles.background}>

      <View style={styles.topBox} />
      <Image source={require('../assets/images/backgrounddots.png')} style={styles.backgroundDots} resizeMode="contain" />

      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

      <Image source={require('../assets/images/ic_launcher.png')} style={styles.logo} resizeMode="contain" />

      <View style={styles.textContainer}>
        <Text style={styles.joinText}>JOIN</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.createAccountText}>Create your Pécs League account</Text>
        <Text style={styles.subheaderAccountText}>
          Get news, game updates, highlights, and more info on your favorite teams.
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="words"
          
        />
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
        <Text style={styles.passwordInfo}>
          Password must be at least 8 characters long and include 1 capital letter.
        </Text>
      </View>

      <View style={styles.checkboxContainer}>
  <BouncyCheckbox
    size={25}
    fillColor="#000000"
    iconStyle={{ borderColor: '#000000', borderWidth: 2 }}
    isChecked={agreeToTerms}
    onPress={(isChecked: boolean) => setAgreeToTerms(isChecked)}
  />
  <Text style={styles.checkboxText}>
    I agree to the{' '}
    <Text style={styles.underline}>Terms</Text> and{' '}
    <Text style={styles.underline}>Privacy Policy</Text>
  </Text>
</View>

      <View style={styles.buttonWrapper}>
        <View style={styles.boxLeftWrapper}>
          <View style={styles.boxLeft} />
        </View>
        <View style={styles.boxRightWrapper}>
          <View style={styles.boxRight} />
        </View>

        <TouchableOpacity style={styles.buttonContainer} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.agreement}>
      By agreeing to the above terms, you are consenting that your personal
      information will be collected, stored, and processed in the
       European Union on behalf of Pécs League Properties, Inc.        </Text>

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
    backgroundColor: 'white',
  },
  topBox: {
    width: '200%',
    height: 190,
    backgroundColor: '#9f00ff',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  logo: {
    position: 'absolute',
    top: '-2%',
    width: 100,
    height: 100,
    left: 35,
  },
  textContainer: {
    marginTop: 0,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinText: {
    position: 'absolute',
    fontSize: 155,
    textAlign: 'right',
    color: '#FFFFFFFF',
    fontFamily: 'BebasNeue-Regular',
    top: -100,
    opacity: 0.12,
    right: -60,
  },
  createAccountText: {
    position: 'absolute',
    fontSize: 27,
    textAlign: 'center',
    color: '#FFFFFFFF',
    fontFamily: 'BebasNeue-Regular',
    top: 10,
    left: -30,
  },
  subheaderAccountText: {
    position: 'absolute',
    fontSize: 15,
    textAlign: 'left',
    color: '#FFFFFFFF',
    fontFamily: 'Manrope-Regular',
    top: 50,
    opacity: 0.75,
    left: -30,
    lineHeight: 18,
  },
  inputContainer: {
    marginTop: 125,
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
  passwordInfo: {
    fontSize: 12,
    color: 'gray',
    fontFamily: 'Manrope-Regular',
    marginBottom: 15,
    marginLeft: 5,
  },
  checkboxContainer: {
    width: '100%',
    paddingHorizontal: 5,
    zIndex:3,
    flexDirection: 'row', 
  },
  checkboxText: {
    textDecorationLine: 'none',
    fontSize: 14,
    color: '#000',
    fontFamily: 'Manrope-Regular',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  buttonWrapper: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
    zIndex: 5, 

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
  boxLeftWrapper: {
    position: 'absolute',
    top: -15,
    left: 15,
    transform: [{ rotate: '45deg' }],
  },
  boxRightWrapper: {
    position: 'absolute',
    top: -15,
    right: 15,
    transform: [{ rotate: '45deg' }],
  },
  boxLeft: {
    width: 35,
    height: 35,
    backgroundColor: '#000000',
    top: 24,
    left: 9,
  },
  boxRight: {
    width: 35,
    height: 35,
    backgroundColor: '#000000',
    top: 9,
    left: 23,
  },
  agreement:{
    marginTop:15,
    fontSize: 12.5,
    color: 'gray',
    fontFamily: 'Manrope-Regular',
    marginBottom: 0,
    marginLeft: 0,
    opacity:0.8,
  },
  backgroundDots: {
    position: 'absolute',
    width: 500,
    height: 500,
    left: 0,
    transform: [{ rotate: '270deg' }],
    opacity:0.03,
    top:450,
  }
});
