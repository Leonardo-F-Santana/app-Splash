import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from "react-native-animatable";
import { useAuth } from '../../contexts/AuthContext';

export default function EsqueciSenha() {
    const navigation = useNavigation();
    const { signOut } = useAuth();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendEmail = async () => {
        if (!email) {
            Alert.alert("Atenção", "Por favor, digite seu e-mail.");
            return;
        }

        signOut();

        setLoading(true);
        try {
            await api.post('/auth/esqueci-senha', { email });
            Alert.alert(
                "Verifique seu E-mail",
                "Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.",
                [{ text: "OK", onPress: () => navigation.navigate('SignIn') }]
            );
        } catch (error) {
            Alert.alert(
                "Verifique seu E-mail",
                "Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.",
                [{ text: "OK", onPress: () => navigation.navigate('SignIn') }]
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.message}>Recuperar Senha</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                <Text style={styles.title}>Não se preocupe!</Text>
                <Text style={styles.text}>Digite seu e-mail de cadastro e enviaremos um link para você criar uma nova senha.</Text>
                
                <Text style={styles.inputTitle}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
                />
                <TouchableOpacity style={styles.button} onPress={handleSendEmail} disabled={loading}>
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Enviar Link</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ResetarSenha')}>
                    <Text style={styles.backButtonText}>Já tem um token? Clique aqui</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>Voltar para o Login</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E90FF',
    },
    containerHeader: {
        marginTop: '14%',
        marginBottom: '8%',
        paddingStart: '5%',
    },
    message: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF'
    },
    containerForm: {
        backgroundColor: '#FFF',
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: '5%'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
    },
    text: {
        color: 'gray',
        marginTop: 10,
        marginBottom: 30,
    },
    inputTitle: {
        fontSize: 20,
        marginTop: 20,
    },
    input: {
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 12,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#1E90FF',
        width: '100%',
        borderRadius: 4,
        paddingVertical: 8,
        marginTop: 14,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        marginTop: 14,
        alignSelf: 'center',
    },
    backButtonText: {
        color: '#a1a1a1',
    }
});