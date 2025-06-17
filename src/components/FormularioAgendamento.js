
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import api from '../services/api';

LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai.', 'Jun.', 'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'],
  today: "Hoje"
};
LocaleConfig.defaultLocale = 'pt-br';

export default function FormularioAgendamento({ titulo, espaco }) {
    const [selectedDate, setSelectedDate] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [datasOcupadas, setDatasOcupadas] = useState([]);
    
    const fetchDatasOcupadas = async () => {
        try {
            console.log(`Buscando datas para o espaço: ${espaco}`); 
            const response = await api.get(`/agendamentos/datas-ocupadas?espaco=${espaco}`);
            setDatasOcupadas(response.data);
            console.log("Datas ocupadas recebidas:", response.data); 
        } catch (error) {
            console.error("Erro ao buscar datas ocupadas:", error);
            Alert.alert("Erro", "Não foi possível carregar as datas do calendário.");
        }
    };

    useEffect(() => {
        fetchDatasOcupadas();
    }, [espaco]);

    const markedDates = useMemo(() => {
    
    const hojeString = new Date().toISOString().split('T')[0];
    
    const marks = {};
    
    datasOcupadas.forEach(data => {
        marks[data] = { disabled: true, disableTouchEvent: true, marked: true, dotColor: 'red' };
    });

    marks[hojeString] = { ...marks[hojeString], disabled: true, disableTouchEvent: true };

    if (selectedDate) {
        marks[selectedDate] = { ...marks[selectedDate], selected: true, selectedColor: '#1E90FF', disableTouchEvent: false };
    }

    return marks;
    }, [datasOcupadas, selectedDate]);
    
    const handleSubmit = async () => {
        if (!selectedDate) {
            Alert.alert("Atenção", "Por favor, selecione uma data para o agendamento.");
            return;
        }

        setLoading(true);
        try {
            const dadosAgendamento = {
                espaco: espaco,
                dataAgendamento: selectedDate,
            };
            await api.post('/agendamentos', dadosAgendamento);
            
            Alert.alert("Sucesso", "Sua solicitação foi enviada para análise!");
            
            setSelectedDate(''); 

            await fetchDatasOcupadas();

        } catch (error) {
            const mensagemErro = error.response?.data?.message || "Não foi possível realizar o agendamento.";
            Alert.alert("Erro", mensagemErro);
        } finally {
            setLoading(false);
        }
    };

    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    const dataMinima = amanha.toISOString().split('T')[0];

    return (
        <View style={styles.formContainer}>
            <Text style={styles.title}>{titulo}</Text>
            
            <Calendar
                style={styles.calendar}
                theme={{
                    arrowColor: '#1E90FF',
                    todayTextColor: '#1E90FF',
                    selectedDayBackgroundColor: '#1E90FF',
                }}
                minDate={dataMinima}
                onDayPress={(day) => setSelectedDate(day.dateString)} 
                markedDates={markedDates} 
            />

            <TouchableOpacity 
                style={styles.button} 
                onPress={handleSubmit}
                disabled={loading || !selectedDate} 
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Enviando...' : 'Solicitar Agendamento'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    formContainer: { width: '100%' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#1E90FF', textAlign: 'center' },
    calendar: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, },
    button: { backgroundColor: '#1E90FF', borderRadius: 50, paddingVertical: 12, width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 30 },
    buttonText: { fontSize: 18, color: '#FFF', fontWeight: 'bold' }
});