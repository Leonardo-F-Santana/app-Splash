import React, { createContext, useState, useEffect, useContext } from 'react';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import api from '../services/api';
import * as Notifications from 'expo-notifications'; 
import * as Device from 'expo-device';
import Constants from 'expo-constants';

async function getPushNotificationToken() {
    let token;
    if (!Device.isDevice) {
        console.log('Notificações Push só funcionam em aparelhos físicos.');
        return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        Alert.alert('Falha!', 'Não foi possível obter permissão para notificações push.');
        return null;
    }
    
    try {
        token = (await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig.originalFullName,
        })).data;
        console.log("Expo Push Token:", token);
    } catch(e) {
        console.error("Erro ao obter o Expo Push Token:", e);
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }
    return token;
}

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData() {
            const storagedAccessToken = await AsyncStorage.getItem('@SplashApp:accessToken');
            const storagedUser = await AsyncStorage.getItem('@SplashApp:user');
            
            if (storagedAccessToken && storagedUser) {
                api.defaults.headers.common['Authorization'] = `Bearer ${storagedAccessToken}`;
                setAccessToken(storagedAccessToken);
                setUser(JSON.parse(storagedUser));
            }
            setIsLoading(false);
        }
        loadStorageData();
    }, []);

    const registerPushToken = async () => {
        try {
            const token = await getPushNotificationToken();
            if (token) {
                console.log("Enviando push token para o backend:", token);
                await api.put('/usuarios/me/push-token', { token: token });
            }
        } catch (error) {
            console.error("Falha ao registrar push token:", error.response?.data || error.message);
        }
    };
    
    useEffect(() => {
        if (user) {
            registerPushToken();
        }
    }, [user]);


    const signIn = async (login, senha, rememberMe) => {
        try {
            const response = await api.post('/auth/login', { login, senha });
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
            
            api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            const userResponse = await api.get('/usuarios/me');
            const userData = userResponse.data;

            setAccessToken(newAccessToken);
            setUser(userData);

            await AsyncStorage.setItem('@SplashApp:refreshToken', newRefreshToken);
            if (rememberMe) {
                await AsyncStorage.setItem('@SplashApp:accessToken', newAccessToken);
                await AsyncStorage.setItem('@SplashApp:user', JSON.stringify(userData));
            }
        } catch (error) {
            signOut(); 
            console.error("Erro no signIn:", error.response?.data || error.message);
            throw new Error("Usuário ou senha inválidos.");
        }
    };

    const refreshToken = async () => {
        try {
            const storagedRefreshToken = await AsyncStorage.getItem('@SplashApp:refreshToken');
            if (!storagedRefreshToken) {
                signOut();
                return null;
            }

            const response = await axios.post(`${api.defaults.baseURL}/auth/refresh-token`, {
                refreshToken: storagedRefreshToken 
            });

            const { accessToken: newAccessToken } = response.data;
            
            setAccessToken(newAccessToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

            const storagedUser = await AsyncStorage.getItem('@SplashApp:user');
            if (storagedUser) {
                await AsyncStorage.setItem('@SplashApp:accessToken', newAccessToken);
            }
            
            return newAccessToken;
        } catch (error) {
            console.error("Refresh token falhou. Deslogando...");
            signOut(); 
            return null;
        }
    };

    const signOut = async () => {
        await AsyncStorage.multiRemove(['@SplashApp:accessToken', '@SplashApp:refreshToken', '@SplashApp:user']);
        delete api.defaults.headers.common['Authorization'];
        setAccessToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ signed: !!accessToken, user, isLoading, signIn, signOut, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    return context;
}