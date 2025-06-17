import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import FormularioAgendamento from '../../components/FormularioAgendamento'; 

export default function Agendamento() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.menuIcon} onPress={() => navigation.openDrawer()}>
                <Icon name="menu" size={30} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.containerLogo}>
                <Animatable.Image
                    animation="fadeIn"
                    source={require('../../assets/logo.png')}
                    style={{ width: '100%' }}
                    resizeMode='contain'
                />
            </View>
            <Animatable.View delay={300} animation="fadeInUp" style={styles.containerForm}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <FormularioAgendamento 
                        titulo="Agendamento do Salão"
                        espaco="SALAO"
                    />
                </ScrollView>
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    containerForm: {
        flex: 2.5,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: '5%',
    },
    scrollContainer: {
        paddingBottom: 30,
    },
    menuIcon: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
    },
});