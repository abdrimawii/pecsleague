import React, { useEffect, useState } from 'react';
import { View, Modal, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';


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

interface Team {
  id: string;
  name: string;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  played: number;
}

type LeagueUpdateProps = {
  visible: boolean;
  onClose: () => void;
};

const LeagueUpdate: React.FC<LeagueUpdateProps> = ({ visible, onClose }) => {
  const [standings, setStandings] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [updatedInfo, setUpdatedInfo] = useState({
    wins: '',
    losses: '',
    draws: '',
    points: '',
    played: '',
  });

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const standingsRef = collection(db, 'standings');
        const snapshot = await getDocs(standingsRef);
        const standingsData: Team[] = [];
        snapshot.forEach((doc) => {
          standingsData.push({ id: doc.id, ...doc.data() } as Team);
        });
        setStandings(standingsData);
      } catch (error) {
        console.error("Error fetching standings:", error);
      }
    };

    if (visible) {
      fetchStandings();
    }
  }, [visible]);

  const handleSelectTeam = (team: Team) => {
    setSelectedTeam(team);
    setUpdatedInfo({
      wins: team.wins.toString(),
      losses: team.losses.toString(),
      draws: team.draws.toString(),
      points: team.points.toString(),
      played: team.played.toString(),
    });
  };

  const handleUpdate = async () => {
    if (!selectedTeam) return;

    const teamRef = doc(db, 'standings', selectedTeam.id);

    try {
      await updateDoc(teamRef, {
        wins: updatedInfo.wins || selectedTeam.wins,
        losses: updatedInfo.losses || selectedTeam.losses,
        draws: updatedInfo.draws || selectedTeam.draws,
        points: updatedInfo.points || selectedTeam.points,
        played: updatedInfo.played || selectedTeam.played,
      });

      setUpdatedInfo({ wins: '', losses: '', draws: '', points: '', played: '' });
      setSelectedTeam(null);
      onClose();
    } catch (error) {
      console.error("Error updating standings:", error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalBackground}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Update League</Text>

          <FlatList
            data={standings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.teamItem}
                onPress={() => handleSelectTeam(item)}
              >
                <Text style={styles.teamName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          {selectedTeam && (
            <ScrollView style={styles.editSection} contentContainerStyle={{ flexGrow: 1 }}>
              <Text style={styles.modalDescription}>Editing: {selectedTeam.name}</Text>

              <Text style={styles.label}>Wins:</Text>
              <TextInput
                style={styles.input}
                placeholder="Wins"
                value={updatedInfo.wins}
                onChangeText={(text) => setUpdatedInfo({ ...updatedInfo, wins: text })}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Losses:</Text>
              <TextInput
                style={styles.input}
                placeholder="Losses"
                value={updatedInfo.losses}
                onChangeText={(text) => setUpdatedInfo({ ...updatedInfo, losses: text })}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Draws:</Text>
              <TextInput
                style={styles.input}
                placeholder="Draws"
                value={updatedInfo.draws}
                onChangeText={(text) => setUpdatedInfo({ ...updatedInfo, draws: text })}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Points:</Text>
              <TextInput
                style={styles.input}
                placeholder="Points"
                value={updatedInfo.points}
                onChangeText={(text) => setUpdatedInfo({ ...updatedInfo, points: text })}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Played:</Text>
              <TextInput
                style={styles.input}
                placeholder="Played"
                value={updatedInfo.played}
                onChangeText={(text) => setUpdatedInfo({ ...updatedInfo, played: text })}
                keyboardType="numeric"
              />

              <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  teamItem: {
    padding: 10,
    backgroundColor: '#f4f4f4',
    marginBottom: 5,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    alignSelf: 'flex-start',
    width: '100%',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#9f00ff',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  editSection: {
    marginTop: 20,
    width: '100%',
    maxHeight: '50%',
  },
});

export default LeagueUpdate;
