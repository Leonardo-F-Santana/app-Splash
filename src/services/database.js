import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto'; 
import bcrypt from 'bcryptjs';  

const db = SQLite.openDatabase('splash.db');

export const initDB = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS usuarios (
                    id TEXT PRIMARY KEY NOT NULL,
                    nome TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    login TEXT UNIQUE NOT NULL,
                    senha TEXT NOT NULL,
                    ativo INTEGER,
                    dataCriacao TEXT,
                    tipo TEXT NOT NULL 
                );`,
                [],
                () => {}, 
                (_, err) => { reject(err); } 
            );

            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS moradores (
                    id TEXT PRIMARY KEY NOT NULL,
                    apartamento INTEGER NOT NULL,
                    bloco TEXT NOT NULL,
                    criado_por_admin_id TEXT,
                    FOREIGN KEY (id) REFERENCES usuarios(id),
                    FOREIGN KEY (criado_por_admin_id) REFERENCES usuarios(id)
                );`,
                [],
                () => {},
                (_, err) => { reject(err); }
            );

            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS agendamentos (
                    id TEXT PRIMARY KEY NOT NULL,
                    morador_id TEXT NOT NULL,
                    manipulado_por_admin_id TEXT,
                    espaco TEXT NOT NULL,
                    dataAgendamento TEXT NOT NULL,
                    status TEXT NOT NULL,
                    dataSolicitacao TEXT NOT NULL,
                    FOREIGN KEY (morador_id) REFERENCES usuarios(id),
                    FOREIGN KEY (manipulado_por_admin_id) REFERENCES usuarios(id)
                );`,
                [],
                () => { 
                    resolve(); 
                },
                (_, err) => { reject(err); }
            );
        });
    });
    return promise;
};

export const findUserByLogin = (login) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM usuarios WHERE login = ?;',
                [login],
                (_, result) => {
                    if (result.rows.length > 0) {
                        resolve(result.rows.item(0)); 
                    } else {
                        resolve(null); 
                    }
                },
                (_, err) => {
                    reject(err);
                }
            );
        });
    });
    return promise;
};

export const addAdminUser = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                "SELECT * FROM usuarios WHERE login = 'admin'",
                [],
                (_, result) => {
                    if (result.rows.length === 0) {
                        const id = Crypto.randomUUID();
                        const senhaCriptografada = bcrypt.hashSync('admin123', 10); 

                        tx.executeSql(
                            `INSERT INTO usuarios (id, nome, email, login, senha, ativo, dataCriacao, tipo) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
                            [id, 'Admin Principal', 'admin@splash.com', 'admin', senhaCriptografada, 1, new Date().toISOString(), 'ADMIN'],
                            () => { console.log("Usuário Admin criado com sucesso!"); resolve(); },
                            (_, err) => { reject(err); }
                        );
                    } else {
                        console.log("Usuário Admin já existe.");
                        resolve();
                    }
                },
                (_, err) => { reject(err); }
            );
        });
    });
    return promise;
};