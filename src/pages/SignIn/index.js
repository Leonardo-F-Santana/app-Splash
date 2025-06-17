import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Modal, ActivityIndicator } from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import { useAuth } from '../../contexts/AuthContext';

export default function SignIn() {
    const navigation = useNavigation();
    const { signIn } = useAuth(); 

    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    

    const handleLogin = async () => {
        if (!login || !senha) {
            Alert.alert("Atenção", "Por favor, preencha o login e a senha.");
            return;
        }

        setLoading(true);

        try {
            await signIn(login, senha, rememberMe);
        } catch (error) {
            Alert.alert("Erro no login", error.message);
        } finally {
        setLoading(false); 
    }
    };

    return (
        <View style={styles.container}>
            <Modal
                transparent={true}
                animationType="fade"
                visible={loading}
                onRequestClose={() => {}} 
            >
                <View style={styles.modalBackground}>
                    <View style={styles.activityIndicatorWrapper}>
                        <ActivityIndicator animating={loading} size="large" color="#FFFFFF" />
                        <Text style={styles.loadingText}>Acessando...</Text>
                    </View>
                </View>
            </Modal>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.message}>Bem vindo(a)</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                <Text style={styles.title}>Login</Text>
                <TextInput
                    placeholder="Digite seu login..."
                    style={styles.input}
                    value={login}
                    onChangeText={setLogin} 
                    autoCapitalize="none"
                />
                
                <Text style={styles.title}>Senha</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        placeholder="Sua senha"
                        style={styles.passwordInput}
                        value={senha}
                        onChangeText={setSenha}
                        editable={!loading}
                        secureTextEntry={!showPassword} 
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Icon 
                            name={showPassword ? 'eye' : 'eye-off'} 
                            size={24} 
                            color="#a1a1a1" 
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    style={styles.rememberContainer} 
                    onPress={() => setRememberMe(!rememberMe)} 
                >
                    <Icon 
                        name={rememberMe ? 'checkbox' : 'checkbox-outline'}
                        size={24} 
                        color={rememberMe ? '#1E90FF' : '#a1a1a1'} 
                    />
                    <Text style={styles.rememberText}>Lembrar de mim</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Acessar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonRegister}
                    onPress={() => navigation.navigate('EsqueciSenha')}>
                    <Text style={styles.registerText}>Esqueceu sua senha?</Text>
                </TouchableOpacity>

            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#1E90FF',
    },
    containerHeader:{
        marginTop: '14%',
        marginBottom: '8%',
        paddingStart: '5%',
    },
    message:{
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF'
    },
    containerForm:{
        backgroundColor: '#FFF',
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%'
    },
    title:{
        fontSize: 20,
        marginTop: 28,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#000',
        height: 40,
        marginBottom: 12,
        fontSize: 16,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#000',
        marginBottom: 12,
        height: 40,
    },
    passwordInput: {
        flex: 1,
        fontSize: 16,
    },
    button:{
        backgroundColor: '#1E90FF',
        width: '100%',
        borderRadius:4,
        paddingVertical: 8,
        marginTop: 14,
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
    },
    buttonText:{
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonRegister:{
        marginTop: 14,
        alignSelf: 'center',
    },
    registerText:{
        color: '#a1a1a1',
    },
    rememberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 14,
        marginBottom: 14,
    },
    rememberText: {
        marginLeft: 8,
        color: '#a1a1a1',
        fontSize: 16,
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#1E90FF',
        height: 120,
        width: 120,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingText: {
        color: '#FFFFFF',
        marginTop: 5,
    },
});