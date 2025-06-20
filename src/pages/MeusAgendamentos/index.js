import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../contexts/AuthContext'; 
import { getMeusAgendamentos } from '../../services/database';
import AgendamentoCard from '../../components/AgendamentoCard';

export default function MeusAgendamentos() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [agendamentos, setAgendamentos] = useState([]);
    const isFocused = useIsFocused();
    const { user } = useAuth(); 

    const fetchAgendamentos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getMeusAgendamentos(user.id);
            setAgendamentos(response);
        } catch (error) {
            console.error("Erro ao buscar agendamentos:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (isFocused) {
            fetchAgendamentos();
        }
    }, [isFocused, fetchAgendamentos]);

    const agendamentosSeparados = useMemo(() => {
        const salao = agendamentos.filter(a => a.espaco === 'SALAO');
        const churrasqueira = agendamentos.filter(a => a.espaco === 'CHURRASQUEIRA');
        return { salao, churrasqueira };
    }, [agendamentos]);

    if (loading && agendamentos.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#1E90FF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.menuIcon}
                onPress={() => navigation.openDrawer()}
            >
                <Icon name="menu" size={35} color="#1E90FF" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Meus Agendamentos</Text>
            
            <FlatList
                data={[{ key: 'salao' }, { key: 'churrasqueira' }]}
                keyExtractor={(item) => item.key}
                showsVerticalScrollIndicator={false}
                RefreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchAgendamentos} />
                }
                renderItem={({ item }) => {
                    if (item.key === 'salao') {
                        return (
                            <>
                                <Text style={styles.sectionTitle}>Salão de Festas</Text>
                                <FlatList
                                    data={agendamentosSeparados.salao}
                                    keyExtractor={(ag) => ag.id.toString()}
                                    renderItem={({ item }) => <AgendamentoCard agendamento={item} />}
                                    ListEmptyComponent={<Text style={styles.emptyText}>Nenhum agendamento para o salão.</Text>}
                                    scrollEnabled={false} 
                                />
                            </>
                        );
                    }
                    if (item.key === 'churrasqueira') {
                        return (
                            <>
                                <Text style={styles.sectionTitle}>Churrasqueira</Text>
                                <FlatList
                                    data={agendamentosSeparados.churrasqueira}
                                    keyExtractor={(ag) => ag.id.toString()}
                                    renderItem={({ item }) => <AgendamentoCard agendamento={item} />}
                                    ListEmptyComponent={<Text style={styles.emptyText}>Nenhum agendamento para a churrasqueira.</Text>}
                                    scrollEnabled={false} 
                                />
                            </>
                        );
                    }
                    return null;
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60, 
        paddingHorizontal: 20,
        backgroundColor: '#f0f4f7',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f4f7',
    },
    menuIcon: {
        position: 'absolute',
        top: 65,
        left: 20,
        zIndex: 1,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E90FF',
        marginBottom: 20,
        textAlign: 'center', 
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#1E90FF',
        paddingBottom: 5,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#888',
        fontSize: 16,
    }
});