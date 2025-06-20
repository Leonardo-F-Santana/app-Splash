import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
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

  useEffect(() => {
    initDB()
      .then(() => {
        console.log("Banco de dados inicializado!");
        return addAdminUser();
      })
      .then(() => {
        console.log("Seed do usuário admin (se necessário) concluída.");
      })
      .catch(err => {
        console.log("Erro na inicialização do banco de dados:", err);
      });
  }, []); 

  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar backgroundColor="#1E90FF" barStyle='light-content'/>
        <Routes />
      </NavigationContainer>
    </AuthProvider>
  );
}