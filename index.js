/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import firebase from '@react-native-firebase/app'; // Import Firebase app
import firestore from '@react-native-firebase/firestore';

// Check if Firebase has already been initialized
if (!firebase.apps.length) {
  // Manually initialize Firebase with options from google-services.json
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
  firebase.app();  // Use the already initialized instance
}

AppRegistry.registerComponent(appName, () => App);
