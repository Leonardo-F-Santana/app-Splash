import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const statusConfig = {
    ANALISE: { color: '#FFA500', icon: 'hourglass-outline', text: 'Em Análise' },
    ATIVO: { color: '#2E8B57', icon: 'checkmark-circle-outline', text: 'Aprovado' },
    CANCELADO: { color: '#DC143C', icon: 'close-circle-outline', text: 'Cancelado' },
    FINALIZADO: { color: '#696969', icon: 'flag-outline', text: 'Finalizado' },
};

export default function AgendamentoCard({ agendamento }) {
    const config = statusConfig[agendamento.status] || statusConfig.ANALISE;
    
    const dataFormatada = new Date(agendamento.dataAgendamento).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

    return (
        <View style={styles.card}>
            <View style={styles.dateContainer}>
                <Icon name="calendar-outline" size={24} color="#1E90FF" />
                <Text style={styles.dateText}>{dataFormatada}</Text>
            </View>
            <View style={[styles.statusContainer, { backgroundColor: config.color }]}>
                <Icon name={config.icon} size={18} color="#FFF" />
                <Text style={styles.statusText}>{config.text}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 3, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 15,
    },
    statusText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: 5,
    },
});