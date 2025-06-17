import React, { useState } from "react";
import { 
    View, Text, StyleSheet, TextInput, TouchableOpacity, 
    Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform 
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation } from '@react-navigation/native';
import api from "../../services/api"; 
import Icon from 'react-native-vector-icons/Ionicons';

export default function Register() {
    const navigation = useNavigation();
    const [nome, setNome] = useState('');
    const [bloco, setBloco] = useState('');
    const [apartamento, setApartamento] = useState('');
    const [email, setEmail] = useState('');
    const [login, setLogin] = useState(''); 
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async () => {
        if (!nome || !bloco || !apartamento || !email || !login || !senha) {
            Alert.alert("Erro", "Todos os campos são obrigatórios.");
            return;
        }

        setLoading(true);
        try {
            const dadosMorador = { nome, bloco, apartamento, email, login, senha };

            console.log("Enviando para a API:", JSON.stringify(dadosMorador, null, 2));

            await api.post('/moradores', dadosMorador);

            Alert.alert("Sucesso!", "Novo morador cadastrado.", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);

        } catch (error) {
            console.error("Erro no cadastro:", error.response?.data || error.message);
            Alert.alert("Erro", "Não foi possível realizar o cadastro.");
        } finally {
            setLoading(false);
        }
    };

    return (
      <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
          <View style={styles.container}>
              <TouchableOpacity style={styles.menuIcon} onPress={() => navigation.openDrawer()}>
                  <Icon name="menu" size={30} color="#FFF" />
              </TouchableOpacity>
              <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                  <Text style={styles.message}>Cadastrar Morador</Text>
              </Animatable.View>

              <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                      <Text style={styles.title}>Nome</Text>
                      <TextInput placeholder="Digite o nome completo" style={styles.input} value={nome} onChangeText={setNome} />
                      
                      <Text style={styles.title}>Bloco</Text>
                      <TextInput placeholder="Informe o bloco" style={styles.input} value={bloco} onChangeText={setBloco} />

                      <Text style={styles.title}>Apartamento</Text>
                      <TextInput placeholder="Informe o número do apartamento" style={styles.input} keyboardType="numeric" value={apartamento} onChangeText={setApartamento} />

                      <Text style={styles.title}>Email</Text>
                      <TextInput placeholder="Digite o email" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address"/>

                      <Text style={styles.title}>Login</Text>
                      <TextInput placeholder="Crie um login de acesso" style={styles.input} value={login} onChangeText={setLogin} autoCapitalize="none"/>

                      <Text style={styles.title}>Senha</Text>
                      <View style={styles.passwordContainer}>
                          <TextInput
                              placeholder="Crie uma senha temporária"
                              style={styles.passwordInput}
                              value={senha}
                              onChangeText={setSenha}
                              secureTextEntry={!showPassword}
                          />
                          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                              <Icon name={showPassword ? 'eye' : 'eye-off'} size={24} color="#a1a1a1" />
                          </TouchableOpacity>
                      </View>

                      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                          {loading ? <ActivityIndicator color="#FFF"/> : <Text style={styles.buttonText}>Cadastrar</Text>}
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.buttonRegister} onPress={() => navigation.goBack()}>
                          <Text style={styles.registerText}>Voltar</Text>
                      </TouchableOpacity>
                      <View style={{ height: 100 }} /> 
                  </ScrollView>
              </Animatable.View>
          </View>
      </KeyboardAvoidingView>
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
        paddingHorizontal: '5%',
        paddingTop: 10,
    },
    title:{
        fontSize: 20,
        marginTop: 15,
    },
    input:{
        borderBottomWidth: 1,
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
        borderRadius: 4,
        paddingVertical: 8,
        marginTop: 28,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
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
    menuIcon: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    }
});
