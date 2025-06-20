import React, { useState } from "react";
import { 
    View, Text, StyleSheet, TextInput, TouchableOpacity, 
    Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform 
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../contexts/AuthContext';

export default function SignIn() {
    const navigation = useNavigation();
    const { signIn, isAuthenticating } = useAuth(); // Usando o estado de loading do contexto
    
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = async () => {
        if (!login || !senha) {
            Alert.alert("Atenção", "Por favor, preencha o login e a senha.");
            return;
        }
        try {
            await signIn(login, senha, rememberMe);
        } catch (error) {
            Alert.alert("Erro no login", error.message || "Ocorreu um erro");
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.container}>
                <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                    <Text style={styles.message}>Bem-vindo(a)</Text>
                </Animatable.View>
                <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.title}>Login</Text>
                        <TextInput
                            placeholder="Digite seu login..."
                            style={styles.input}
                            value={login}
                            onChangeText={setLogin}
                            autoCapitalize="none"
                            editable={!isAuthenticating}
                        />
                        <Text style={styles.title}>Senha</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="Sua senha"
                                style={styles.passwordInput}
                                value={senha}
                                onChangeText={setSenha}
                                secureTextEntry={!showPassword}
                                editable={!isAuthenticating}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={isAuthenticating}>
                                <Icon name={showPassword ? 'eye' : 'eye-off'} size={24} color={isAuthenticating ? '#ccc' : '#a1a1a1'} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.rememberContainer} onPress={() => setRememberMe(!rememberMe)} disabled={isAuthenticating}>
                            <Icon 
                                name={rememberMe ? 'checkbox' : 'checkbox-outline'}
                                size={24} 
                                color={rememberMe ? '#1E90FF' : '#a1a1a1'} 
                            />
                            <Text style={styles.rememberText}>Lembrar de mim</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, isAuthenticating && styles.disabledButton]} onPress={handleLogin} disabled={isAuthenticating}>
                            {isAuthenticating ? (
                                <ActivityIndicator size="small" color="#FFF" />
                            ) : (
                                <Text style={styles.buttonText}>Acessar</Text>
                            )}
                        </TouchableOpacity>
                        
                    </ScrollView>
                </Animatable.View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    // ... todos os seus estilos completos, incluindo o disabledButton
    container: { flex: 1, backgroundColor: '#1E90FF' },
    containerHeader: { marginTop: '14%', marginBottom: '8%', paddingStart: '5%' },
    message: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
    containerForm: { backgroundColor: '#FFF', flex: 1, borderTopLeftRadius: 25, borderTopRightRadius: 25, paddingHorizontal: '5%', paddingTop: 10 },
    title: { fontSize: 20, marginTop: 28 },
    input: { borderBottomWidth: 1, borderColor: '#000', height: 40, marginBottom: 12, fontSize: 16 },
    passwordContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#000', marginBottom: 12, height: 40 },
    passwordInput: { flex: 1, fontSize: 16 },
    button: { backgroundColor: '#1E90FF', width: '100%', borderRadius: 4, paddingVertical: 8, marginTop: 28, justifyContent: 'center', alignItems: 'center', height: 50 },
    disabledButton: { backgroundColor: '#87CEEB' },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    buttonRegister: { marginTop: 14, alignSelf: 'center' },
    registerText: { color: '#a1a1a1' },
    rememberContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 14, marginBottom: 14 },
    rememberText: { marginLeft: 8, color: '#a1a1a1', fontSize: 16 },
});