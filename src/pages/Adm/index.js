import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function SearchResident() {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [block, setBlock] = useState("");
  const [apartment, setApartment] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [space, setSpace] = useState("");

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSearch = () => {
    Alert.alert(
      "Busca realizada",
      `Critérios:\n• Nome: ${name || "—"}\n• Bloco: ${block || "—"}\n• Ap.: ${
        apartment || "—"
      }\n• Data: ${date.toLocaleDateString("pt-BR")}\n• Espaço: ${space || "—"}`
    );
  };

  return (
    <View style={styles.container}>
      <Animatable.View
        animation="fadeInLeft"
        delay={500}
        style={styles.containerHeader}
      >
        <Text style={styles.message}>Buscar Agendamento</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Nome</Text>
        <TextInput
          placeholder="Digite o nome..."
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.title}>Bloco</Text>
        <TextInput
          placeholder="Digite o bloco..."
          style={styles.input}
          value={block}
          onChangeText={setBlock}
        />

        <Text style={styles.title}>Apartamento</Text>
        <TextInput
          placeholder="Digite o nº do apto..."
          style={styles.input}
          keyboardType="numeric"
          value={apartment}
          onChangeText={setApartment}
        />

        <Text style={styles.title}>Data</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>{date.toLocaleDateString("pt-BR")}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <Text style={styles.title}>Espaço</Text>
        <TextInput
          placeholder="Ex: Salão, Churrasqueira..."
          style={styles.input}
          value={space}
          onChangeText={setSpace}
        />

        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonRegister}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.registerText}>Voltar</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E90FF",
  },
  containerHeader: {
    marginTop: "14%",
    marginBottom: "8%",
    paddingStart: "5%",
  },
  message: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
  },
  containerForm: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: "5%",
    paddingEnd: "5%",
  },
  title: {
    fontSize: 20,
    marginTop: 28,
  },
  input: {
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 12,
    fontSize: 16,
    justifyContent: "center",
    paddingTop: 10,
  },
  dateText: {
    fontSize: 16,
    color: "#000",
  },
  button: {
    backgroundColor: "#1E90FF",
    width: "100%",
    borderRadius: 4,
    paddingVertical: 8,
    marginTop: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonRegister: {
    marginTop: 14,
    alignSelf: "center",
  },
  registerText: {
    color: "#a1a1a1",
  },
});
