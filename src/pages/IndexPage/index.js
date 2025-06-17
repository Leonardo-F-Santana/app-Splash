import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import { useAuth } from '../../contexts/AuthContext';

export default function IndexPage() {
    const navigation = useNavigation();
    
    const { user } = useAuth();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.menuIcon}
                onPress={() => navigation.openDrawer()}
            >
                <Icon name="menu" size={30} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.containerLogo}>
                <Animatable.Image
                    animation="flipInY"
                    source={require('../../assets/logo.png')}
                    style={{ width: '100%' }}
                    resizeMode='contain'
                />
            </View>

            <Animatable.View delay={600} animation="fadeInUp" style={styles.containerForm}>
                <Text style={styles.title}>Bem Vindo(a), {user?.nome || 'Usuário'}!</Text>
                
                <Text style={styles.title_container}>
                    Agora ficou fácil reservar o espaço para sua confraternização! {"\n"}
                    Com nosso aplicativo, moradores podem agendar o <Text style={{ fontWeight: 'bold' }}>salão de festas por R$ 90,00</Text> ou a <Text style={{ fontWeight: 'bold' }}>churrasqueira por R$ 50,00</Text> com rapidez e praticidade. {"\n\n"}
                    <Text style={{ fontWeight: 'bold', color: '#1E90FF' }}> No menu acima, você pode solicitar o Agendamento para reservar o espaço desejado Transferindo o valor para a chave Pix: 123456789-12.</Text> {"\n"}
                </Text>
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E90FF',
    },
    containerLogo: {
        flex: 2,
        backgroundColor: '#1E90FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerForm: {
        flex: 1,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',
        paddingBottom: 30, 
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 28,
        marginBottom: 12,
    },
    title_container: {
        fontSize: 16,
        textAlign: 'center',
        flexWrap: 'wrap',
        paddingHorizontal: 10,
    },
    text: {
        color: '#a1a1a1',
    },
    button: {
        position: 'absolute',
        backgroundColor: '#1E90FF',
        borderRadius: 50,
        paddingVertical: 8,
        width: '60%',
        alignSelf: 'center',
        bottom: '15%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 18,
        color: '#FFF',
        fontWeight: 'bold',
    },
    menuIcon: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
    },
});