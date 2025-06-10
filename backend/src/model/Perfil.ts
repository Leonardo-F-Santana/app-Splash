import { Uuid } from "./Uuid";

/**
 * Representa um perfil ou papel de um usuário no sistema.
 * Ex: 'MORADOR', 'SINDICO', 'ADMINISTRADOR_SISTEMA'
 */
export class Perfil {
    // Usando camelCase para consistência com o código TypeScript/JavaScript
    private id: Uuid;
    private nome: string;

    // Construtor privado para garantir que a criação passe sempre pelo método 'create'
    private constructor(id: Uuid, nome: string) {
        this.id = id;
        this.nome = nome;
    }

    /**
     * Método de fábrica para criar um novo Perfil.
     * Usar um objeto como parâmetro torna a chamada mais clara.
     * @param {string} params.nome - O nome do perfil (ex: 'MORADOR').
     * @param {string} [params.id] - ID existente (opcional, para reconstruir um objeto).
     */
    public static create(params: { nome: string; id?: string }): Perfil {
        // Padronizar o nome para maiúsculas ajuda a evitar inconsistências
        const nomePadronizado = params.nome.toUpperCase(); 
        const id = params.id ? new Uuid(params.id) : Uuid.randomGenerator();

        return new Perfil(id, nomePadronizado);
    }

    // Getters com nomes consistentes (camelCase)
    public getId(): Uuid {
        return this.id;
    }

    public getNome(): string {
        return this.nome;
    }
}