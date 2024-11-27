// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, child, get,set,push } from 'firebase/database';

const db = {
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
const database = getDatabase(app);

export { database, ref, get, child,set,push };
