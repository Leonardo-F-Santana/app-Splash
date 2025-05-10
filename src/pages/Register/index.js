import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";

import * as Animatable from "react-native-animatable";
import { useNavigation } from '@react-navigation/native';

export default function Register() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={styles.message}>Bem vindo(a)</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Email</Text>
        <TextInput
        placeholder="Digite seu email..."
        style={styles.input}
        />
        <Text style={styles.title}>Senha</Text>
        <TextInput
        placeholder="Sua senha"
        secureTextEntry={true}
        style={styles.input}
        />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonRegister}
        onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.registerText}>Já possui uma conta? Faça o Login</Text>
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
  
})