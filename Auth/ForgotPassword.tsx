import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, AuthError } from 'firebase/auth';

// Initialize Firebase
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
const auth = getAuth(app);

const ForgotPassword = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    try {
      // Query Firestore for users with the given email
      const userRef = collection(db, 'users');
      const q = query(userRef, where('email', '==', email));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert('Error', 'No user found with this email');
        return;
      }

      // Assuming the password is stored in Firestore and needs to be transferred
      querySnapshot.forEach(async (docSnapshot) => {
        const userDocRef = doc(db, 'users', docSnapshot.id);  // Get reference to the user document
        const userData = docSnapshot.data();

        // Try to sign in with email and password if the user exists in Firebase Auth
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, userData.password);
          console.log('User signed in:', userCredential.user);
          Alert.alert('Success', 'User signed in successfully.');
        } catch (authError) {
          // Type the error properly using AuthError
          const error = authError as AuthError;

          // If the user doesn't exist in Firebase Auth, create a new user
          if (error.code === 'auth/user-not-found') {
            try {
              // Create new user in Firebase Authentication
              const newUserCredential = await createUserWithEmailAndPassword(auth, email, userData.password);
              console.log('New user created:', newUserCredential.user);

              // Now, update Firestore to reflect Firebase Auth user (excluding password)
              await updateDoc(userDocRef, {
                email: email,  // Update email
                // No password update in Firestore, this should be handled by Firebase Auth
              });

              Alert.alert('Success', 'User created in Firebase Authentication.');
            } catch (createError) {
              console.error('Error creating user:', createError);
              Alert.alert('Error', 'Failed to create user in Firebase Authentication.');
            }
          } else {
            // Handle other authentication errors
            console.error('Error during authentication:', error);
            Alert.alert('Error', `Authentication failed: ${error.message}`);
          }
        }
      });

      navigation.goBack();  // Navigate back to login screen
    } catch (error) {
      console.error('Error resetting password:', error);
      Alert.alert('Error', 'Failed to reset password. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.description}>Enter your email to receive a password reset link.</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontFamily: 'BebasNeue-Regular',
    marginBottom: 20,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#F7F7F7',
    paddingLeft: 15,
    fontSize: 16,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'BebasNeue-Regular',
  },
  backText: {
    marginTop: 20,
    fontSize: 16,
    color: '#000',
    textDecorationLine: 'underline',
  },
});

export default ForgotPassword;
