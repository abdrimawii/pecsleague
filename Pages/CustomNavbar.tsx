import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { useRoute } from '@react-navigation/native';

type CustomNavbarProps = {
  navigation: StackNavigationProp<any>;
};

const CustomNavbar: React.FC<CustomNavbarProps> = ({ navigation }) => {
  const [activeScreen, setActiveScreen] = useState<string>('Dashboard');
  const [role, setRole] = useState<string>(''); 
  const route = useRoute(); 

  useEffect(() => {
    
    setActiveScreen(route.name);

    
    const fetchUserRole = async () => {
      try {
        const userDetailsString = await AsyncStorage.getItem('userDetails');
        if (userDetailsString) {
          const userDetails = JSON.parse(userDetailsString);
          setRole(userDetails.role); 
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserRole();
  }, [route.name]); 

  
  const handleNavigation = (screen: string) => {
    setActiveScreen(screen); 
    navigation.navigate(screen); 
  };

  return (
    <View style={styles.navbar}>
      {/* Left Rotated Box */}
      <View style={styles.leftBox} />

      <TouchableOpacity onPress={() => handleNavigation('Dashboard')}>
        <Image
          source={activeScreen === 'Dashboard' ? require('./icons/homeactive.png') : require('./icons/home.png')}
          style={[
            styles.icon,
            activeScreen === 'Dashboard' && styles.activeIcon, 
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleNavigation('League')}>
        <Image
          source={activeScreen === 'League' ? require('./icons/trophyactive.png') : require('./icons/trophy.png')}
          style={[
            styles.icon,
            activeScreen === 'League' && styles.activeIcon,
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleNavigation('Matches')}>
        <Image
          source={activeScreen === 'Matches' ? require('./icons/matchesactive.png') : require('./icons/matches.png')}
          style={[
            styles.icon,
            activeScreen === 'Matches' && styles.activeIcon,
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleNavigation('Profile')}>
        <Image
          source={activeScreen === 'Profile' ? require('./icons/profileactive.png') : require('./icons/profile.png')}
          style={[
            styles.icon,
            activeScreen === 'Profile' && styles.activeIcon,
          ]}
        />
      </TouchableOpacity>

      {role === 'admin' && (
        <TouchableOpacity onPress={() => handleNavigation('Admin')}>
          <Image
            source={activeScreen === 'Admin' ? require('./icons/businessmanactive.png') : require('./icons/businessman.png')}
            style={[
              styles.icon,
              activeScreen === 'Admin' && styles.activeIcon,
            ]}
          />
        </TouchableOpacity>
      )}

      <View style={styles.rightBox} />
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 10,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 25,
    left: 38,
    right: 38,
    height: 55,
    zIndex: 120,
    opacity: 1,
    borderRadius: 5,
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    top: 5,
    opacity: 0.9,
  },
  activeIcon: {
    transform: [{ scale: 1.05 }], 
    opacity: 1,
  },
  leftBox: {
    position: 'absolute',
    left: -17,
    width: 35,
    height: 35,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },
  rightBox: {
    position: 'absolute',
    right: -17,
    width: 35,
    height: 35,
    scaleX: 0.1,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },
});

export default CustomNavbar;
