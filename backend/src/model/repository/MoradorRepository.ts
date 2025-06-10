import { Morador } from "../Morador"; // Importa a nova classe Morador
import { Uuid } from "../Uuid";

// DTO para atualização. Podemos refinar isso depois.
export class MoradorUpdateDTO {
    constructor(
        readonly nomeCompleto: string,
        readonly email: string
        // Adicione outros campos que podem ser atualizados
    ) {}
}

export interface MoradorRepository {
    save(morador: Morador): Promise<void>;
    getAll(): Promise<Array<Morador>>;
    getById(id: Uuid): Promise<Morador | null>; // É bom retornar nulo se não encontrar
    remove(id: Uuid): Promise<void>;
    update(id: Uuid, data: MoradorUpdateDTO): Promise<Morador>;
    // Poderíamos adicionar um método para buscar por login também
    findByLogin(login: string): Promise<Morador | null>; 
}