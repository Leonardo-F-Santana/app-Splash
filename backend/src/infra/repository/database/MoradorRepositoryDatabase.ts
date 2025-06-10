import knex, { Knex } from 'knex';
import { Morador } from '../../../model/Morador';
import { MoradorRepository, MoradorUpdateDTO } from '../../../model/repository/MoradorRepository';
import { development } from './KnexConfig';
import { Uuid } from '../../../model/Uuid';
import { User } from '../../../model/User';
import { Perfil } from '../../../model/Perfil';
import { DocumentoFactory } from '../../../model/DocumentoFactory';

export class MoradorRepositoryDatabase implements MoradorRepository {

    private connection: Knex;

    constructor() {
        this.connection = knex(development);
    }
    
    // MÉTODO SAVE COM TRANSAÇÃO
    async save(morador: Morador): Promise<void> {
        // Usamos uma transação para garantir que todas as inserções funcionem, ou nenhuma delas.
        await this.connection.transaction(async (trx) => {
            // 1. Insere na tabela 'usuarios'
            await trx('usuarios').insert({
                usuario_id: morador.getId().getValue(),
                nome_completo: morador.getNomeCompleto(),
                login: morador.getLogin(),
                senha: morador.getSenha(), // Lembre-se que isso deve ser um HASH
                email: morador.getEmail(),
                ativo_sistema: morador.getAtivoSistema(),
                data_criacao_usuario: morador.getDataCriacao()
            });

            // 2. Insere na tabela 'moradores'
            await trx('moradores').insert({
                usuario_id: morador.getId().getValue(), // Mesma chave primária e estrangeira
                documento: morador.getDocumento().getValue(),
                apartamento: morador.getApartamento(),
                bloco: morador.getBloco(),
                data_nascimento: morador.getDataNascimento(),
                ativo_no_condominio: morador.getAtivoNoCondominio(),
                data_cadastro_morador: morador.getDataCadastroMorador()
            });

            // 3. Insere na tabela 'usuario_possui_perfil'
            const perfis = morador.getPerfis();
            if (perfis && perfis.length > 0) {
                const perfisData = perfis.map(perfil => ({
                    usuario_id: morador.getId().getValue(),
                    perfil_id: perfil.getId().getValue()
                }));
                await trx('usuario_possui_perfil').insert(perfisData);
            }
        });
    }

    // MÉTODO GETBYID COM JOINS
    async getById(id: Uuid): Promise<Morador | null> {
        // 1. Busca os dados base do usuário e morador
        const moradorData = await this.connection('usuarios as u')
            .join('moradores as m', 'u.usuario_id', 'm.usuario_id')
            .where('u.usuario_id', id.getValue())
            .select(
                'u.*', 
                'm.documento', 
                'm.apartamento', 
                'm.bloco',
                'm.data_nascimento',
                'm.ativo_no_condominio',
                'm.data_cadastro_morador'
            )
            .first();

        if (!moradorData) {
            return null; // Retorna nulo se não encontrar
        }

        // 2. Busca os perfis associados
        const perfisData = await this.connection('usuario_possui_perfil as up')
            .join('perfis as p', 'up.perfil_id', 'p.perfil_id')
            .where('up.usuario_id', id.getValue())
            .select('p.perfil_id', 'p.nome_perfil');

        const perfis = perfisData.map(p => Perfil.create({ nome: p.nome_perfil, id: p.perfil_id }));

        // 3. Reconstrói o objeto Morador (usando um construtor que aceite todos os dados)
        // Precisaremos ajustar os construtores para permitir a reconstrução a partir do BD
        // Por agora, vamos usar o create, mas o ideal seria um construtor mais flexível.
        
        const morador = Morador.create({
            id: moradorData.usuario_id,
            nomeCompleto: moradorData.nome_completo,
            login: moradorData.login,
            senha: moradorData.senha, // A senha já vem como hash do BD
            email: moradorData.email,
            documento: moradorData.documento,
            apartamento: moradorData.apartamento,
            bloco: moradorData.bloco,
            dataNascimento: moradorData.data_nascimento
        });
        
        // Adiciona os perfis reconstruídos ao objeto
        perfis.forEach(p => morador.adicionarPerfil(p));

        return morador;
    }

    // Implementar os outros métodos (getAll, remove, update) seguindo a mesma lógica.
    // getAll vai precisar de JOINs e um loop para reconstruir cada morador.
    // remove vai precisar deletar de várias tabelas (ou usar ON DELETE CASCADE no BD).
    // update vai precisar de transação para atualizar as tabelas corretas.

    // ... implementação pendente para os outros métodos ...
    async getAll(): Promise<Array<Morador>> { throw new Error("Method not implemented."); }
    async remove(id: Uuid): Promise<void> { throw new Error("Method not implemented."); }
    async update(id: Uuid, data: MoradorUpdateDTO): Promise<Morador> { throw new Error("Method not implemented."); }
    async findByLogin(login: string): Promise<Morador | null> { throw new Error("Method not implemented."); }
}