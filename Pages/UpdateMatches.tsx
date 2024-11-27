import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Button, Alert } from 'react-native';
import { getFirestore, collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
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

interface UpdateMatchesProps {
  visible: boolean;
  onClose: () => void;
}

const UpdateMatches = ({ visible, onClose }: UpdateMatchesProps) => {
  const [matches, setMatches] = useState<any[]>([]); 
  const [selectedMatch, setSelectedMatch] = useState<any>(null); 
  const [club1Score, setClub1Score] = useState<string>('');
  const [club2Score, setClub2Score] = useState<string>('');

  const fetchMatches = async () => {
    const matchesCollection = collection(db, "matches");
    const upcomingQuery = query(matchesCollection, where("upcoming", "==", true));  
    const matchesSnapshot = await getDocs(upcomingQuery);
    
    const upcomingMatchesList = matchesSnapshot.docs
      .map((doc) => ({
        ...doc.data(),
        id: doc.id  
      }));
    
    console.log('Fetched upcoming matches:', upcomingMatchesList);
    setMatches(upcomingMatchesList);  
  };

  useEffect(() => {
    if (visible) {
      fetchMatches(); 
    }
  }, [visible]);

  const handleMatchSelect = (match: any) => {
    console.log('Selected match:', match); 
    setSelectedMatch(match);
    setClub1Score('');
    setClub2Score('');
  };

  const handleSaveScore = async () => {
    if (club1Score && club2Score) {
      const scoreHome = parseInt(club1Score);
      const scoreAway = parseInt(club2Score);
  
      if (isNaN(scoreHome) || isNaN(scoreAway)) {
        Alert.alert('Please enter valid numeric scores');
        return;
      }
  
      
      if (selectedMatch && selectedMatch.id) {
        try {
          const matchDocRef = doc(db, 'matches', selectedMatch.id); 
  
          
          await updateDoc(matchDocRef, {
            scoreHomeTeam: scoreHome,  
            scoreAwayTeam: scoreAway,  
            upcoming: false,           
          });
  
          console.log('Scores updated successfully!');
          Alert.alert('Match scores updated');
          setSelectedMatch(null);  
          fetchMatches();           
        } catch (error) {
          console.error('Error updating match scores:', error);
        }
      } else {
        Alert.alert('Selected match data is missing');
      }
    } else {
      Alert.alert('Please enter scores for both teams');
    }
  };

  if (!visible) return null; 

  return (
    <View style={styles.modalBackground}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Update Matches</Text>

        <ScrollView style={styles.scrollContainer}>
          {matches.length === 0 ? (
            <Text style={styles.modalContent}>Loading...</Text>
          ) : (
            matches.map((match, index) => (
              <TouchableOpacity
                key={index}
                style={styles.matchContainer}
                onPress={() => handleMatchSelect(match)} 
              >
                <Text style={styles.matchText}>
                  <Text style={styles.matchLabel}>Matchday:</Text> {match.matchDay}
                </Text>
                <Text style={styles.matchText}>
                  <Text style={styles.matchLabel}>Club 1:</Text> {match.club1}
                </Text>
                <Text style={styles.matchText}>
                  <Text style={styles.matchLabel}>Club 2:</Text> {match.club2}
                </Text>
                <Text style={styles.matchText}>
                  <Text style={styles.matchLabel}>Date:</Text> {new Date(match.matchDateTime).toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {selectedMatch && (
          <View style={styles.scoreContainer}>
            <Text style={styles.modalTitle}>Enter Scores for {selectedMatch.club1} vs {selectedMatch.club2}</Text>

            <TextInput
              style={styles.input}
              placeholder={`Score for ${selectedMatch.club1}`}
              keyboardType="numeric"
              value={club1Score}
              onChangeText={setClub1Score}
            />
            <TextInput
              style={styles.input}
              placeholder={`Score for ${selectedMatch.club2}`}
              keyboardType="numeric"
              value={club2Score}
              onChangeText={setClub2Score}
            />

            <Button title="Save Scores" onPress={handleSaveScore} />
          </View>
        )}

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
  modalContent: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollContainer: {
    width: '100%',
  },
  matchContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  matchText: {
    fontSize: 16,
    marginBottom: 5,
  },
  matchLabel: {
    fontWeight: 'bold',
  },
  scoreContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  closeButton: {
    backgroundColor: '#9f00ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default UpdateMatches;
