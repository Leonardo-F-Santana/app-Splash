import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useIsFocused } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { getDatasOcupadas, addAgendamento } from '../services/database';

LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai.', 'Jun.', 'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'],
  today: "Hoje"
};
LocaleConfig.defaultLocale = 'pt-br';

export default function FormularioAgendamento({ titulo, espaco }) {
    const { user } = useAuth(); 
    const [selectedDate, setSelectedDate] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [datasOcupadas, setDatasOcupadas] = useState([]);
    const isFocused = useIsFocused();

    const fetchDatasOcupadas = useCallback(async () => {
        try {
            const datas = await getDatasOcupadas(espaco);
            // Extrair apenas as strings de data
            const datasStrings = datas.map(item => item.dataAgendamento);
            setDatasOcupadas(datasStrings);
        } catch (error) {
            Alert.alert("Erro", "Não foi possível carregar as datas do calendário.");
        }
    }, [espaco]);

    useEffect(() => {
        if (isFocused) {
            fetchDatasOcupadas();
        }
    }, [isFocused, fetchDatasOcupadas]);

    const handleSubmit = async () => {
        if (!selectedDate) {
            Alert.alert("Atenção", "Por favor, selecione uma data para o agendamento.");
            return;
        }
        setLoading(true);
        try {
            const dadosAgendamento = { espaco, dataAgendamento: selectedDate };
            await addAgendamento(dadosAgendamento, user.id); 
            Alert.alert("Sucesso", "Sua solicitação foi enviada para análise!");
            setSelectedDate(''); 
            await fetchDatasOcupadas(); // Recarrega as datas para atualizar o calendário
        } catch (error) {
            Alert.alert("Erro", error.message || "Não foi possível realizar o agendamento.");
        } finally {
            setLoading(false);
        }
    };
    
    const markedDates = useMemo(() => {
        const hojeString = new Date().toISOString().split('T')[0];
        const marks = {};
        
        // Marcar datas ocupadas
        datasOcupadas.forEach(data => {
            marks[data] = { 
                disabled: true, 
                disableTouchEvent: true, 
                marked: true, 
                dotColor: 'red' 
            };
        });

        // Marcar data atual
        marks[hojeString] = { 
            ...marks[hojeString], 
            disabled: true, 
            disableTouchEvent: true 
        };

        // Marcar data selecionada
        if (selectedDate) {
            marks[selectedDate] = { 
                selected: true, 
                selectedColor: '#1E90FF',
                disableTouchEvent: false 
            };
        }

        return marks;
    }, [datasOcupadas, selectedDate]);
    
    const dataMinima = new Date();
    dataMinima.setDate(dataMinima.getDate() + 1);

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
                minDate={dataMinima.toISOString().split('T')[0]}
                onDayPress={(day) => {
                    const selectedDate = new Date(day.dateString);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    // Bloquear datas passadas e ocupadas
                    if (selectedDate < today || markedDates[day.dateString]?.disabled) {
                        return;
                    }
                    setSelectedDate(day.dateString);
                }}
                markedDates={markedDates}
            />

            <TouchableOpacity 
                style={[styles.button, (loading || !selectedDate) && styles.disabledButton]} 
                onPress={handleSubmit}
                disabled={loading || !selectedDate}
            >
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Solicitar Agendamento</Text>}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    formContainer: { width: '100%' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#1E90FF', textAlign: 'center' },
    calendar: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 20 },
    button: { backgroundColor: '#1E90FF', borderRadius: 50, paddingVertical: 12, width: '100%', alignItems: 'center', justifyContent: 'center' },
    disabledButton: { backgroundColor: '#87CEEB' },
    buttonText: { fontSize: 18, color: '#FFF', fontWeight: 'bold' }
});