import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from "react-native-animatable";
import Icon from 'react-native-vector-icons/Ionicons';

export default function ResetarSenha() {
    const navigation = useNavigation();

    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [showNovaSenha, setShowNovaSenha] = useState(false);
    const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

    const handleResetPassword = async () => {
        if (novaSenha !== confirmarSenha) {
            Alert.alert("Erro", "As senhas precisam ser idênticas. Por favor, digite novamente.");
            return;
        }
        if (novaSenha.length < 6) {
            Alert.alert("Atenção", "A nova senha deve ter no mínimo 6 caracteres.");
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/resetar-senha', { token, novaSenha });
            Alert.alert(
                "Sucesso",
                "Sua senha foi redefinida! Você já pode fazer o login com a nova senha.",
                [{ text: "OK", onPress: () => navigation.navigate('SignIn') }]
            );
        } catch (error) {
            Alert.alert("Erro", "Token inválido ou expirado. Por favor, solicite um novo link.");
            navigation.navigate('SignIn');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.message}>Crie sua Nova Senha</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                <Text style={styles.inputTitle}>Token</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Cole o token recebido por e-mail"
                    value={token}
                    onChangeText={setToken}
                    autoCapitalize="none"
                    editable={!loading}
                />

                <Text style={styles.inputTitle}>Nova Senha</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Digite sua nova senha"
                        value={novaSenha}
                        onChangeText={setNovaSenha}
                        secureTextEntry={!showNovaSenha} 
                        editable={!loading}
                    />
                    <TouchableOpacity onPress={() => setShowNovaSenha(!showNovaSenha)}>
                        <Icon name={showNovaSenha ? 'eye' : 'eye-off'} size={24} color="#a1a1a1" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.inputTitle}>Confirmar Senha</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Confirme sua nova senha"
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                        secureTextEntry={!showConfirmarSenha} 
                        editable={!loading}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmarSenha(!showConfirmarSenha)}>
                        <Icon name={showConfirmarSenha ? 'eye' : 'eye-off'} size={24} color="#a1a1a1" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Salvar Nova Senha</Text>}
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1E90FF' },
    containerHeader: { marginTop: '14%', marginBottom: '8%', paddingStart: '5%' },
    message: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
    containerForm: { backgroundColor: '#FFF', flex: 1, borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: '5%' },
    inputTitle: { fontSize: 20, marginTop: 20 },
    input: { borderBottomWidth: 1, height: 40, marginBottom: 12, fontSize: 16, borderColor: '#000' },
    passwordContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#000', marginBottom: 12, height: 40 },
    passwordInput: { flex: 1, fontSize: 16 },
    button: { backgroundColor: '#1E90FF', width: '100%', borderRadius: 4, paddingVertical: 8, marginTop: 24, justifyContent: 'center', alignItems: 'center', height: 50 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});