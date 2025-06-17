import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { setRefreshFunction } from './src/services/api';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,  
    shouldPlaySound: true, 
    shouldSetBadge: false,  
  }),
});

const AppContent = () => {
    const { refreshToken } = useAuth();
    
    useEffect(() => {
        setRefreshFunction(refreshToken);
    }, [refreshToken]);

    return <Routes />;
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar backgroundColor="#1E90FF" barStyle='light-content'/>
        <AppContent />
      </NavigationContainer>
    </AuthProvider>
  );
}