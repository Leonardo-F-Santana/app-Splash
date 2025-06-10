import { Request, Response } from "express";
import { MoradorRepository } from "../../model/repository/MoradorRepository";
import { Morador } from "../../model/Morador";
import { Perfil } from "../../model/Perfil"; // Precisamos do Perfil

export class MoradorCreate {

    constructor(readonly repository: MoradorRepository) {}

    async execute(request: Request, response: Response) {
        // Agora o body da requisição precisa ter todos os dados necessários
        const { 
            nomeCompleto, 
            login, 
            senha, // Lembre-se de fazer o HASH da senha aqui ou em um "service"
            email,
            documento, 
            bloco, 
            apartamento, 
            dataNascimento 
        } = request.body;

        try {
            // Cria a instância de Morador
            const morador = Morador.create({
                nomeCompleto,
                login,
                senha, // ATENÇÃO: Envie o HASH, não a senha pura
                email,
                documento,
                bloco,
                apartamento,
                dataNascimento: new Date(dataNascimento)
            });

            // Exemplo: Adicionando um perfil padrão 'MORADOR'
            // Em um caso real, você buscaria esse perfil do banco de dados primeiro
            const perfilMorador = Perfil.create({ nome: 'MORADOR' /*, id: 'uuid-do-perfil-morador-do-db' */ });
            morador.adicionarPerfil(perfilMorador);
            
            await this.repository.save(morador);
            
            // Não retorne o objeto completo com a senha! Crie um DTO de resposta.
            response.status(201).json({ id: morador.getId().getValue(), nome: morador.getNomeCompleto() });

        } catch (error: any) {
            response.status(400).json({ message: "Erro ao criar morador.", error: error.message });
        }
    }
}