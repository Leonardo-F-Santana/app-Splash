import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation } from '@react-navigation/native';

// Importando nosso serviço de API que acabamos de criar
import api from '../../services/api';

export default function SignIn() {
    const navigation = useNavigation();
    
    // Estados para guardar o que o usuário digita
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');

    // Função que será chamada ao clicar no botão "Acessar"
    const handleLogin = async () => {
        if (!login || !senha) {
            Alert.alert("Atenção", "Por favor, preencha o login e a senha.");
            return;
        }

        try {
            // Chamada POST para o nosso endpoint de login no backend
            const response = await api.post('/auth/login', {
                login: login,
                senha: senha
            });
            
            // Se a chamada for bem-sucedida, o token estará em response.data
            const { token } = response.data;

            // Por enquanto, vamos apenas mostrar no console para confirmar que recebemos
            console.log("Login bem-sucedido! Token:", token); 
            Alert.alert("Sucesso!", "Login realizado com sucesso.");

            // Próximos passos que faremos depois:
            // 1. Salvar o token no AsyncStorage
            // 2. Guardar os dados do usuário em um Contexto Global de Autenticação
            // 3. Navegar para a tela principal

            navigation.navigate('HomeDrawer');

        } catch (error) {
            // Se a API retornar um erro (ex: 403 por senha errada)
            console.error("Falha no login:", error.response?.data || error.message);
            Alert.alert("Erro no login", "Usuário ou senha inválidos. Tente novamente.");
        }
    };

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.message}>Bem vindo(a)</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                <Text style={styles.title}>Login</Text>
                <TextInput
                    placeholder="Digite seu login..."
                    style={styles.input}
                    value={login}
                    onChangeText={setLogin} // Conecta o input ao estado 'login'
                    autoCapitalize="none"
                />
                
                <Text style={styles.title}>Senha</Text>
                <TextInput
                    placeholder="Sua senha"
                    secureTextEntry={true}
                    style={styles.input}
                    value={senha}
                    onChangeText={setSenha} // Conecta o input ao estado 'senha'
                />
                
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Acessar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonRegister}
                    onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerText}>Não possui uma conta? Cadastre-se</Text>
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
    input:{
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 12,
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
    }
});