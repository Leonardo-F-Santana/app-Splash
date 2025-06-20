import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext'; 
import { getAgendamentosPendentes, updateAgendamentoStatus } from '../../services/database'; 
import AdminAgendamentoCard from '../../components/AdminAgendamentoCard';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Adm() {
    const { user } = useAuth();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [agendamentosPendentes, setAgendamentosPendentes] = useState([]);
    const isFocused = useIsFocused();

    const fetchPendentes = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAgendamentosPendentes(); 
            const agendamentosFormatados = response.map(ag => ({
                ...ag,
                nomeMorador: ag.nomeMorador,
                dadosMorador: `Bloco ${ag.bloco}, Apto ${ag.apartamento}`
            }));
            setAgendamentosPendentes(agendamentosFormatados);
        } catch (error) {
            console.error("Erro ao buscar agendamentos pendentes:", error);
            Alert.alert("Erro", "Não foi possível carregar as solicitações.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isFocused) {
            fetchPendentes();
        }
    }, [isFocused]);

    const handleAction = async (id, action) => {
        const novoStatus = action === 'aprovar' ? 'ATIVO' : 'CANCELADO';
        try {
            await updateAgendamentoStatus(id, novoStatus, user.id);
            Alert.alert("Sucesso", `Agendamento ${action === 'aprovar' ? 'aprovado' : 'reprovado'}!`);
            fetchPendentes(); 
        } catch (error) {
            Alert.alert("Erro", `Não foi possível processar a solicitação.`);
            console.error(`Erro ao ${action}:`, error);
        }
    };

    if (loading) {
        return <View style={styles.centerContainer}><ActivityIndicator size="large" color="#1E90FF" /></View>;
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.menuIcon}
                onPress={() => navigation.openDrawer()}
            >
                <Icon name="menu" size={35} color="#1E90FF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Agendamentos Pendentes</Text>
            <FlatList
                data={agendamentosPendentes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <AdminAgendamentoCard
                        agendamento={item}
                        onAprovar={() => handleAction(item.id, 'aprovar')}
                        onReprovar={() => handleAction(item.id, 'cancelar')}
                    />
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum agendamento pendente de análise.</Text>}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 60, paddingHorizontal: 20, backgroundColor: '#f0f4f7' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f7' },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1E90FF', marginBottom: 20, textAlign: 'center' },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#888', fontSize: 16 },
    menuIcon: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    }
});