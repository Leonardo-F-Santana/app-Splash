import React, { createContext, useState, useContext, useEffect } from 'react';
import { findUserByLogin } from '../services/database'; 
import bcrypt from 'bcryptjs'; 
import * as SecureStore from 'expo-secure-store'; // Importando o SecureStore

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Este agora controla o loading inicial do app
    const [isAuthenticating, setIsAuthenticating] = useState(false); // Para o loading do botão de login

    // Este useEffect agora tenta fazer o login automático ao iniciar o app
    useEffect(() => {
        async function loadStoredSession() {
            try {
                const sessionData = await SecureStore.getItemAsync('user_session');
                if (sessionData) {
                    const { login, senha } = JSON.parse(sessionData);
                    // Tenta fazer o login com os dados salvos
                    await signIn(login, senha, false); // false para não salvar de novo
                }
            } catch (error) {
                console.log("Nenhuma sessão salva ou erro ao carregar.", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadStoredSession();
    }, []);

    const signIn = async (login, senha, rememberMe) => {
        setIsAuthenticating(true);
        try {
            const foundUser = await findUserByLogin(login);
            if (!foundUser || !bcrypt.compareSync(senha, foundUser.senha) || foundUser.ativo !== 1) {
                throw new Error("Usuário ou senha inválidos.");
            }
            
            setUser(foundUser);

            // Se o usuário marcou "Lembrar de mim", salva as credenciais
            if (rememberMe) {
                await SecureStore.setItemAsync('user_session', JSON.stringify({ login, senha }));
            }

        } catch (error) {
            // Limpa qualquer sessão antiga em caso de erro no login
            await SecureStore.deleteItemAsync('user_session');
            throw error; // Lança o erro para a tela de SignIn tratar
        } finally {
            setIsAuthenticating(false);
        }
    };

    const signOut = async () => {
        try {
            // Ao deslogar, sempre removemos a sessão salva
            await SecureStore.deleteItemAsync('user_session');
        } catch (error) {
            console.error("Erro ao remover sessão do SecureStore:", error);
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ signed: !!user, user, isLoading, isAuthenticating, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}