import { Uuid } from "./Uuid";
import { Morador } from "./Morador"; // <--- Importe a classe Morador

export class Agendamento {
    private id: Uuid;
    private morador: Morador; // <--- AQUI ESTÁ A CONEXÃO!
    private tipoEspaco: string;
    private dataAgendamento: Date;
    private status: string;
    private dataSolicitacao: Date;

    private constructor(params: {
        id?: string;
        morador: Morador;
        tipoEspaco: string;
        dataAgendamento: Date;
        status?: string;
        dataSolicitacao?: Date;
    }) {
        this.id = params.id ? new Uuid(params.id) : Uuid.randomGenerator();
        this.morador = params.morador; // Armazena o objeto completo
        this.tipoEspaco = params.tipoEspaco;
        this.dataAgendamento = params.dataAgendamento;
        this.status = params.status || 'EM ANÁLISE';
        this.dataSolicitacao = params.dataSolicitacao || new Date();
    }
    
    public static create(params: {
        morador: Morador;
        tipoEspaco: string;
        dataAgendamento: Date;
    }): Agendamento {
        return new Agendamento(params);
    }

    // Getter para o morador
    public getMorador(): Morador {
        return this.morador;
    }
    
    public getId(): Uuid {
        return this.id;
    }

    public getTipoEspaco(): string {
        return this.tipoEspaco;
    }

    public getDataAgendamento(): Date {
        return this.dataAgendamento;
    }

    public getStatus(): string {
        return this.status;
    }

    public getDataSoliticacao(): Date {
        return this.dataSolicitacao;
    }
    // ... outros getters
}