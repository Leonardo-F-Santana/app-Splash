import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto'; 
import bcrypt from 'bcryptjs';  

let db = null;

export const initDB = async () => {
    try {
        db = await SQLite.openDatabaseAsync('splash.db');
        
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id TEXT PRIMARY KEY NOT NULL,
                nome TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                login TEXT UNIQUE NOT NULL,
                senha TEXT NOT NULL,
                ativo INTEGER,
                dataCriacao TEXT,
                tipo TEXT NOT NULL 
            );
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS moradores (
                id TEXT PRIMARY KEY NOT NULL,
                apartamento INTEGER NOT NULL,
                bloco TEXT NOT NULL,
                criado_por_admin_id TEXT,
                FOREIGN KEY (id) REFERENCES usuarios(id),
                FOREIGN KEY (criado_por_admin_id) REFERENCES usuarios(id)
            );
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS agendamentos (
                id TEXT PRIMARY KEY NOT NULL,
                morador_id TEXT NOT NULL,
                manipulado_por_admin_id TEXT,
                espaco TEXT NOT NULL,
                dataAgendamento TEXT NOT NULL,
                status TEXT NOT NULL,
                dataSolicitacao TEXT NOT NULL,
                FOREIGN KEY (morador_id) REFERENCES usuarios(id),
                FOREIGN KEY (manipulado_por_admin_id) REFERENCES usuarios(id)
            );
        `);
        
        console.log("Banco de dados inicializado com sucesso!");
        return db;
    } catch (error) {
        console.error("Erro ao inicializar o banco de dados:", error);
        throw error;
    }
};

export const findUserByLogin = async (login) => {
    try {
        const result = await db.getAllAsync(
            'SELECT * FROM usuarios WHERE login = ?;',
            [login]
        );
        
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        throw error;
    }
};

export const addAdminUser = async () => {
    try {
        const result = await db.getAllAsync(
            "SELECT * FROM usuarios WHERE login = 'admin'"
        );
        
        if (result.length === 0) {
            const id = Crypto.randomUUID();
            const senhaCriptografada = bcrypt.hashSync('admin123', 10);

            await db.runAsync(
                `INSERT INTO usuarios (id, nome, email, login, senha, ativo, dataCriacao, tipo) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
                [id, 'Admin Principal', 'admin@splash.com', 'admin', senhaCriptografada, 1, new Date().toISOString(), 'ADMIN']
            );
            console.log("Usuário Admin criado com sucesso!");
        } else {
            console.log("Usuário Admin já existe.");
        }
    } catch (error) {
        console.error("Erro ao adicionar admin:", error);
        throw error;
    }
};

export const addMorador = async (dados, adminId) => {
    try {
        const id = Crypto.randomUUID();
        const senhaCriptografada = bcrypt.hashSync(dados.senha, 8);
        
        // Remova a transação e execute as queries sequencialmente
        // Inserir usuário
        await db.runAsync(
            `INSERT INTO usuarios (id, nome, email, login, senha, ativo, dataCriacao, tipo) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
            [id, dados.nome, dados.email, dados.login, senhaCriptografada, 1, new Date().toISOString(), 'MORADOR']
        );
        
        // Inserir morador
        await db.runAsync(
            `INSERT INTO moradores (id, apartamento, bloco, criado_por_admin_id) 
             VALUES (?, ?, ?, ?);`,
            [id, dados.apartamento, dados.bloco, adminId]
        );
    } catch (error) {
        console.error("Erro ao adicionar morador:", error);
        throw error;
    }
};

const isDateOccupied = async (espaco, dataAgendamento) => {
    try {
        const result = await db.getFirstAsync(
            `SELECT 1 FROM agendamentos WHERE espaco = ? AND dataAgendamento = ? AND (status = 'ATIVO' OR status = 'ANALISE') LIMIT 1;`,
            [espaco, dataAgendamento]
        );
        // Retorna true se encontrou um registro, e false caso contrário
        return result !== null;
    } catch (error) {
        console.error("Erro ao verificar data ocupada:", error);
        throw error;
    }
};

// --- MUDANÇA AQUI ---
// Esta função foi reescrita para usar a nova API async
export const addAgendamento = async (dados, moradorId) => {
    try {
        const dataOcupada = await isDateOccupied(dados.espaco, dados.dataAgendamento);

        if (dataOcupada) {
            throw new Error("Esta data já está reservada ou em análise.");
        }

        const id = Crypto.randomUUID();
        await db.runAsync(
            `INSERT INTO agendamentos (id, morador_id, espaco, dataAgendamento, status, dataSolicitacao) 
             VALUES (?, ?, ?, ?, ?, ?);`,
            [id, moradorId, dados.espaco, dados.dataAgendamento, 'ANALISE', new Date().toISOString()]
        );
    } catch (error) {
        console.error("Erro ao adicionar agendamento:", error);
        // Re-lança o erro para que a tela possa capturá-lo e exibir o Alert
        throw error;
    }
};

// --- MUDANÇA PRINCIPAL AQUI ---
// Esta é a função que estava causando o erro. Agora ela usa a API async.
export const getDatasOcupadas = async (espaco) => {
    try {
        const result = await db.getAllAsync(
            `SELECT dataAgendamento FROM agendamentos 
             WHERE espaco = ? AND (status = 'ATIVO' OR status = 'ANALISE');`,
            [espaco]
        );
        return result; // getAllAsync já retorna o array de objetos que precisamos
    } catch (error) {
        console.error("Erro ao buscar datas ocupadas:", error);
        throw error; // Lança o erro para a função que chamou (fetchDatasOcupadas)
    }
};


export const getMeusAgendamentos = async (moradorId) => {
    try {
        // Nenhuma mudança necessária aqui
        const result = await db.getAllAsync(
            'SELECT * FROM agendamentos WHERE morador_id = ? ORDER BY dataAgendamento DESC;',
            [moradorId]
        );
        return result;
    } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        throw error;
    }
};

export const getAgendamentosPendentes = async () => {
    try {
        // Nenhuma mudança necessária aqui
        const result = await db.getAllAsync(
            `SELECT a.*, u.nome as nomeMorador, m.apartamento, m.bloco 
             FROM agendamentos a 
             JOIN usuarios u ON a.morador_id = u.id 
             JOIN moradores m ON a.morador_id = m.id
             WHERE a.status = 'ANALISE' 
             ORDER BY a.dataAgendamento ASC;`
        );
        return result;
    } catch (error) {
        console.error("Erro ao buscar agendamentos pendentes:", error);
        throw error;
    }
};

export const updateAgendamentoStatus = async (agendamentoId, novoStatus, adminId) => {
    try {
        // Nenhuma mudança necessária aqui
        await db.runAsync(
            `UPDATE agendamentos 
             SET status = ?, manipulado_por_admin_id = ? 
             WHERE id = ?;`,
            [novoStatus, adminId, agendamentoId]
        );
    } catch (error) {
        console.error("Erro ao atualizar status do agendamento:", error);
        throw error;
    }
};