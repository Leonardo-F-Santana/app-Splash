import { Platform } from 'react-native';
import { setRandomFallback } from 'bcryptjs';

if (Platform.OS !== 'web') {
  setRandomFallback((len) => {
    const array = new Uint8Array(len);
    return crypto.getRandomValues(array);
  });
}

import 'react-native-get-random-values';
import React, { useEffect, useState } from 'react';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes';

import { AuthProvider } from './src/contexts/AuthContext';
import { initDB, addAdminUser } from './src/services/database';

import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initDB();
        console.log("Banco de dados inicializado!");
        
        await addAdminUser();
        console.log("Seed do usuário admin (se necessário) concluída.");
        
        setDbReady(true);
      } catch (error) {
        console.error("Erro na inicialização do aplicativo:", error);
        setDbReady(true);
      }
    };

    initializeApp();
  }, []); 

  if (!dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar backgroundColor="#1E90FF" barStyle='light-content'/>
        <Routes />
      </NavigationContainer>
    </AuthProvider>
  );
}