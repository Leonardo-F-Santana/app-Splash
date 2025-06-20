import React, { useState } from "react";
import { 
    View, Text, StyleSheet, TextInput, TouchableOpacity, 
    Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform 
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { addMorador } from '../../services/database';

export default function Register() {
    const navigation = useNavigation();
    const { user: adminUser } = useAuth(); 
    const [formData, setFormData] = useState({
        nome: '',
        bloco: '',
        apartamento: '',
        email: '',
        login: '',
        senha: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRegister = async () => {
        // Validação dos campos
        if (Object.values(formData).some(value => !value.trim())) {
            Alert.alert("Erro", "Todos os campos são obrigatórios.");
            return;
        }
        
        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            Alert.alert("Erro", "Por favor, insira um email válido.");
            return;
        }
        
        setLoading(true);
        try {
            await addMorador(formData, adminUser.id); 
            Alert.alert("Sucesso!", "Novo morador cadastrado.", [
                { 
                    text: "OK", 
                    onPress: () => {
                        setFormData({
                            nome: '',
                            bloco: '',
                            apartamento: '',
                            email: '',
                            login: '',
                            senha: ''
                        });
                        navigation.goBack();
                    }
                }
            ]);
        } catch (error) {
            console.error("Erro no cadastro:", error);
            Alert.alert(
                "Erro", 
                error.message || "Não foi possível realizar o cadastro. Verifique se o e-mail ou login já existem."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
      <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
      >
          <View style={styles.container}>
              <TouchableOpacity 
                  style={styles.menuIcon} 
                  onPress={() => navigation.openDrawer()}
                  disabled={loading}
              >
                  <Icon name="menu" size={30} color="#FFF" />
              </TouchableOpacity>
              
              <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                  <Text style={styles.message}>Cadastrar Morador</Text>
              </Animatable.View>

              <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                  <ScrollView 
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{ paddingBottom: 50 }} 
                  >
                      <Text style={styles.title}>Nome</Text>
                      <TextInput 
                          placeholder="Digite o nome completo" 
                          style={styles.input} 
                          value={formData.nome} 
                          onChangeText={(text) => handleInputChange('nome', text)}
                          editable={!loading}
                      />
                      
                      <Text style={styles.title}>Bloco</Text>
                      <TextInput 
                          placeholder="Informe o bloco" 
                          style={styles.input} 
                          value={formData.bloco} 
                          onChangeText={(text) => handleInputChange('bloco', text)}
                          editable={!loading}
                      />

                      <Text style={styles.title}>Apartamento</Text>
                      <TextInput 
                          placeholder="Informe o número do apartamento" 
                          style={styles.input} 
                          keyboardType="numeric" 
                          value={formData.apartamento} 
                          onChangeText={(text) => handleInputChange('apartamento', text)}
                          editable={!loading}
                      />

                      <Text style={styles.title}>Email</Text>
                      <TextInput 
                          placeholder="Digite o email" 
                          style={styles.input} 
                          value={formData.email} 
                          onChangeText={(text) => handleInputChange('email', text)}
                          autoCapitalize="none" 
                          keyboardType="email-address"
                          editable={!loading}
                      />

                      <Text style={styles.title}>Login</Text>
                      <TextInput 
                          placeholder="Crie um login de acesso" 
                          style={styles.input} 
                          value={formData.login} 
                          onChangeText={(text) => handleInputChange('login', text)}
                          autoCapitalize="none"
                          editable={!loading}
                      />

                      <Text style={styles.title}>Senha</Text>
                      <View style={styles.passwordContainer}>
                          <TextInput
                              placeholder="Crie uma senha temporária"
                              style={styles.passwordInput}
                              value={formData.senha}
                              onChangeText={(text) => handleInputChange('senha', text)}
                              secureTextEntry={!showPassword}
                              editable={!loading}
                          />
                          <TouchableOpacity 
                              onPress={() => setShowPassword(!showPassword)}
                              disabled={loading}
                          >
                              <Icon 
                                  name={showPassword ? 'eye' : 'eye-off'} 
                                  size={24} 
                                  color={loading ? "#ccc" : "#a1a1a1"} 
                              />
                          </TouchableOpacity>
                      </View>

                      <TouchableOpacity 
                          style={[
                              styles.button, 
                              loading && styles.disabledButton
                          ]} 
                          onPress={handleRegister} 
                          disabled={loading}
                      >
                          {loading ? 
                              <ActivityIndicator color="#FFF" /> 
                              : 
                              <Text style={styles.buttonText}>Cadastrar</Text>
                          }
                      </TouchableOpacity>

                      <TouchableOpacity 
                          style={styles.buttonRegister} 
                          onPress={() => navigation.goBack()}
                          disabled={loading}
                      >
                          <Text style={[
                              styles.registerText,
                              loading && { color: '#ccc' }
                          ]}>
                              Voltar
                          </Text>
                      </TouchableOpacity>
                  </ScrollView>
              </Animatable.View>
          </View>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E90FF',
    },
    containerHeader: {
        marginTop: Platform.OS === 'ios' ? '14%' : '20%', 
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
        paddingHorizontal: '5%',
        paddingTop: 10,
    },
    title: {
        fontSize: 20,
        marginTop: 15,
    },
    input: {
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
    button: {
        backgroundColor: '#1E90FF',
        width: '100%',
        borderRadius: 4,
        paddingVertical: 8,
        marginTop: 28,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
    },
    disabledButton: {
        backgroundColor: '#87CEEB', 
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonRegister: {
        marginTop: 14,
        alignSelf: 'center',
    },
    registerText: {
        color: '#a1a1a1',
    },
    menuIcon: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 40 : 20, 
        left: 20,
        zIndex: 1,
    }
});