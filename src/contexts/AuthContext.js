import React, { createContext, useState, useContext } from 'react';
import { findUserByLogin } from '../services/database'; 
import bcrypt from 'bcryptjs'; 

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false); 

    const signIn = async (login, senha) => {
        setIsLoading(true);
        try {
            const foundUser = await findUserByLogin(login);
            if (!foundUser) {
                throw new Error("Usuário não encontrado.");
            }

            const passwordMatch = bcrypt.compareSync(senha, foundUser.senha);
            if (!passwordMatch) {
                throw new Error("Senha incorreta.");
            }

            if (!foundUser.ativo) {
                throw new Error("Este usuário está inativo.");
            }

            setUser(foundUser);
        } catch (error) {
            console.error("Erro no signIn local:", error);
            throw new Error("Usuário ou senha inválidos.");
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ signed: !!user, user, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    return context;
}