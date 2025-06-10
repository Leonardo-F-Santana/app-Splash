import { User } from './User';
// Supondo que você tenha essas classes
import { Documento } from "./Documento";
import { DocumentoFactory } from './DocumentoFactory';

export class Morador extends User {
    // Não precisa de user_id ou morador_nome, pois eles já existem na classe User
    private documento: Documento;
    private apartamento: number;
    private bloco: number;
    private dataNascimento: Date;
    private ativoNoCondominio: boolean;
    private dataCadastroMorador: Date;

    // O construtor recebe dados para User e para Morador
    private constructor(
        // Parâmetros para a classe PAI (User)
        userParams: {
            id?: string;
            nomeCompleto: string;
            login: string;
            senha: string; // Lembre-se de usar o hash
            email: string;
        },
        // Parâmetros para a classe FILHA (Morador)
        moradorParams: {
            documento: Documento;
            apartamento: number;
            bloco: number;
            dataNascimento: Date;
        }
    ) {
        // 1. Chama o construtor da classe User com os dados do usuário
        super({
            id: userParams.id,
            nomeCompleto: userParams.nomeCompleto,
            login: userParams.login,
            senha: userParams.senha,
            email: userParams.email,
        });

        // 2. Inicializa as propriedades específicas de Morador
        this.documento = moradorParams.documento;
        this.apartamento = moradorParams.apartamento;
        this.bloco = moradorParams.bloco;
        this.dataNascimento = moradorParams.dataNascimento;
        this.ativoNoCondominio = true;
        this.dataCadastroMorador = new Date();
    }

    // O método create agora agrupa toda a informação necessária
    public static create(params: {
        // Dados de User
        nomeCompleto: string;
        login: string;
        senha: string;
        email: string;
        // Dados de Morador
        documento: string; // Recebe a string e a classe cria o objeto
        apartamento: number;
        bloco: number;
        dataNascimento: Date;
        id?: string;
    }): Morador {
        const currentDocumento = DocumentoFactory.create(params.documento);

        return new Morador(
            { // Objeto para o construtor do User
                id: params.id,
                nomeCompleto: params.nomeCompleto,
                login: params.login,
                senha: params.senha,
                email: params.email
            },
            { // Objeto para o construtor do Morador
                documento: currentDocumento,
                apartamento: params.apartamento,
                bloco: params.bloco,
                dataNascimento: params.dataNascimento
            }
        );
    }
    
    // Métodos Getters para as propriedades de Morador
    // Os getters de User (getId, getNomeCompleto, etc.) já são herdados automaticamente!

    public getDocumento(): Documento {
        return this.documento;
    }

    public getApartamento(): number {
        return this.apartamento;
    }

    public getBloco(): number {
        return this.bloco;
    }

    public getDataNascimento(): Date {
        return this.dataNascimento;
    }

    public getAtivoNoCondominio(): boolean {
        return this.ativoNoCondominio;
    }

    public getDataCadastroMorador(): Date {
        return this.dataCadastroMorador;
    }
}