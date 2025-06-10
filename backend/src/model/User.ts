import { Uuid } from "./Uuid";
import { Perfil } from "./Perfil"; // Importe a classe Perfil

export class User {
    private id: Uuid;
    private nomeCompleto: string;
    private login: string;
    private senha: string;
    private email: string;
    private ativoSistema: boolean;
    private dataCriacao: Date;
    private perfis: Perfil[]; // <--- AQUI ESTÁ A CONEXÃO!

    // O construtor agora pode receber uma lista inicial de perfis
    constructor(params: {
        id?: string;
        nomeCompleto: string;
        login: string;
        senha: string;
        email: string;
        ativoSistema?: boolean;
        dataCriacao?: Date;
        perfis?: Perfil[];
    }) {
        this.id = params.id ? new Uuid(params.id) : Uuid.randomGenerator();
        this.nomeCompleto = params.nomeCompleto;
        this.login = params.login;
        this.senha = params.senha;
        this.email = params.email;
        this.ativoSistema = params.ativoSistema !== undefined ? params.ativoSistema : true;
        this.dataCriacao = params.dataCriacao || new Date();
        this.perfis = params.perfis || []; // Inicia com uma lista vazia se nada for passado
    }

    // Métodos para manipular a lista de perfis
    public adicionarPerfil(perfil: Perfil): void {
        // Lógica para não adicionar perfis duplicados
        if (!this.perfis.some(p => p.getPerfilId().toString() === perfil.getPerfilId().toString())) {
            this.perfis.push(perfil);
        }
    }

    public getPerfis(): Perfil[] {
        return this.perfis;
    }

    public getId(): Uuid {
        return this.id;
    }

    public getNomeCompleto(): string {
        return this.nomeCompleto;
    }

    public getLogin(): string {
        return this.login;
    }

    public getSenha(): string {
        return this.senha;
    }

    public getEmail(): string {
        return this.email;
    }

    public getAtivoSistema(): boolean {
        return this.ativoSistema;
    }

    public getDataCriacao(): Date {
        return this.dataCriacao;
    }
}