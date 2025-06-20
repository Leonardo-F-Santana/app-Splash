import React from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';

import { useAuth } from '../contexts/AuthContext';

import Welcome from '../pages/Welcome';
import SignIn from '../pages/SignIn';
import Register from '../pages/Register';
import IndexPage from '../pages/IndexPage';
import Agendamento from '../pages/Agendamento';
import AgendamentoChurrasqueira from '../pages/AgendamentoChurrasqueira';
import Adm from '../pages/Adm';
import MeusAgendamentos from '../pages/MeusAgendamentos';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
    const { signOut } = useAuth();
    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
                <Icon name="log-out-outline" size={22} color="#FFF" />
                <Text style={styles.logoutButtonText}>Sair</Text>
            </TouchableOpacity>
        </DrawerContentScrollView>
    );
}

function HomeDrawer() {
    const { user } = useAuth();
    
    // Verificação robusta do tipo de usuário
    const isAdmin = user?.tipo === 'ADMIN';
    const isMorador = user?.tipo === 'MORADOR';

    return (
        <Drawer.Navigator 
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    backgroundColor: '#1E90FF',
                    width: 240,
                },
                drawerActiveTintColor: '#FFF',
                drawerInactiveTintColor: '#c0c0c0',
            }}
        >

            <Drawer.Screen name="IndexPage" component={IndexPage} options={{ title: 'Página Inicial' }}/>
            
            {isAdmin && (
                <>
                    <Drawer.Screen name="Adm" component={Adm} options={{ title: 'Painel de Admin' }}/>
                    <Drawer.Screen name="Register" component={Register} options={{ title: 'Cadastrar Morador' }} />
                </>
            )}
            
            {isMorador && (
                <>
                    <Drawer.Screen name="MeusAgendamentos" component={MeusAgendamentos} options={{ title: 'Meus Agendamentos' }}/>
                    <Drawer.Screen name="Agendamento" component={Agendamento} options={{ title: 'Reservar Salão' }}/>
                    <Drawer.Screen name="AgendamentoChurrasqueira" component={AgendamentoChurrasqueira} options={{ title: 'Reservar Churrasqueira' }}/>
                </>
            )}
            
            {!isAdmin && !isMorador && (
                <Drawer.Screen 
                    name="Debug" 
                    component={() => (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>Usuário sem tipo definido: {user?.tipo || 'null'}</Text>
                        </View>
                    )} 
                    options={{ title: 'DEBUG - Tipo Inválido' }} 
                />
            )}
        </Drawer.Navigator>
    );
}

function AuthRoutes() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="SignIn" component={SignIn} />
        </Stack.Navigator>
    );
}

export default function Routes() {
    const { signed, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#1E90FF" />
            </View>
        );
    }

    return signed ? <HomeDrawer /> : <AuthRoutes />;
}

const styles = StyleSheet.create({
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginTop: 20,
    },
    logoutButtonText: {
        color: '#FFF',
        fontSize: 16,
        marginLeft: 15,
        fontWeight: 'bold',
    }
});