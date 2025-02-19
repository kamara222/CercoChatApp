import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SettingsScreen from '../screens/SettingsScreen';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false, // Masquer le titre en haut de la page
          tabBarShowLabel: false, // Masquer le titre en bas de la page
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Accueil') {
              iconName = 'home-outline';
            } else if (route.name === 'Profil') {
              iconName = 'person-outline';
            } else if (route.name === 'SettingsScreen') {
              iconName = 'settings-outline';
            }

            return <Icon name={iconName} size={size} color={color} style={{ top: '100%' }} />;
          },
          tabBarActiveTintColor: COLORS.blue,
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarStyle: {
            display: 'flex',
            height: '10%',
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            marginTop: -50

          },
          tabBarLabelStyle: {
            fontSize: 14,
            bottom: '5%',
            fontFamily: 'Poppins-Regular',
          },
        })}
      >
        <Tab.Screen name="Accueil" component={HomeScreen} />
        <Tab.Screen name="Profil" component={ProfileScreen} />
        <Tab.Screen name="SettingsScreen" component={SettingsScreen} />
      </Tab.Navigator>
    </View>
  );
};

export default BottomTabNavigator;