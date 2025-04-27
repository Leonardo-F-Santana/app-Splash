import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Animatable from 'react-native-animatable';

export default function Agendamento() {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [eventType, setEventType] = useState('');
  const [guests, setGuests] = useState('');

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  const handleSubmit = () => {
    alert('Agendamento solicitado com sucesso!');
  };

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
          animation="fadeIn"
          source={require('../../assets/logo.png')}
          style={{ width: '100%' }}
          resizeMode='contain'
        />
      </View>

      <Animatable.View 
        delay={300} 
        animation="fadeInUp" 
        style={styles.containerForm}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Agendamento de Salão</Text>
          
          {/* Formulário */}
          <Text style={styles.label}>Tipo de Evento</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Aniversário, Casamento..."
            placeholderTextColor="#a1a1a1"
            value={eventType}
            onChangeText={setEventType}
          />
          
          <Text style={styles.label}>Data do Evento</Text>
          <TouchableOpacity 
            style={styles.input} 
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>{date.toLocaleDateString('pt-BR')}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}
          
          <Text style={styles.label}>Hora do Evento</Text>
          <TouchableOpacity 
            style={styles.input} 
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.dateText}>
              {time.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display="default"
              onChange={onChangeTime}
            />
          )}
          
          <Text style={styles.label}>Número de Convidados</Text>
          <TextInput
            style={styles.input}
            placeholder="Quantidade aproximada"
            placeholderTextColor="#a1a1a1"
            keyboardType="numeric"
            value={guests}
            onChangeText={setGuests}
          />
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Solicitar Agendamento</Text>
          </TouchableOpacity>
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
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  containerForm: {
    flex: 2,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: '5%',
    paddingTop: '5%',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1E90FF',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#a1a1a1',
  },
  input: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    height: 40,
    marginBottom: 25,
    fontSize: 16,
    paddingHorizontal: 0,
  },
  dateText: {
    color: '#000',
  },
  button: {
    backgroundColor: '#1E90FF',
    borderRadius: 50,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
});