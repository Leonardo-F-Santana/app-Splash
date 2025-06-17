import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function AdminAgendamentoCard({ agendamento, onAprovar, onReprovar }) {
    const dataFormatada = new Date(agendamento.dataAgendamento).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    const espacoFormatado = agendamento.espaco === 'SALAO' ? 'Salão de Festas' : 'Churrasqueira';

    return (
        <View style={styles.card}>
            <Text style={styles.moradorNome}>{agendamento.nomeMorador}</Text>
            <Text style={styles.moradorDados}>{agendamento.dadosMorador}</Text>
            <View style={styles.divider} />
            <Text style={styles.espacoText}>{`Espaço: ${espacoFormatado}`}</Text>
            <Text style={styles.dataText}>{`Data: ${dataFormatada}`}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.reprovarButton]} onPress={onReprovar}>
                    <Icon name="close-circle" size={20} color="#FFF" />
                    <Text style={styles.buttonText}>Reprovar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.aprovarButton]} onPress={onAprovar}>
                    <Icon name="checkmark-circle" size={20} color="#FFF" />
                    <Text style={styles.buttonText}>Aprovar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: '#FFF', borderRadius: 8, padding: 16, marginBottom: 16, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.23, shadowRadius: 2.62 },
    moradorNome: { fontSize: 18, fontWeight: 'bold' },
    moradorDados: { fontSize: 14, color: '#666', marginBottom: 8 },
    divider: { height: 1, backgroundColor: '#EEE', marginVertical: 8 },
    espacoText: { fontSize: 16, fontWeight: '500' },
    dataText: { fontSize: 16, color: '#333' },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
    button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 5, flex: 1 },
    aprovarButton: { backgroundColor: '#2E8B57', marginLeft: 8 },
    reprovarButton: { backgroundColor: '#DC143C', marginRight: 8 },
    buttonText: { color: '#FFF', fontWeight: 'bold', marginLeft: 8 },
});