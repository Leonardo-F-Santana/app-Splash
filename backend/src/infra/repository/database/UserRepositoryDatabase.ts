import knex, { Knex } from 'knex';
import { User } from '../../../model/User';
import { UserRepository } from './../../../model/repository/UserRepository';
import { development } from './KnexConfig';
import { Uuid } from '../../../model/Uuid';

export class UserRepositoryDatabase implements UserRepository {

  private connection: Knex

  constructor() {
    this.connection = knex(development)
  }
  
  async save(user: User): Promise<void> {
    await this.connection('user').insert({
      'id': user.getId().getValue(),
      'nome': user.getNome(),
      'documento': user.getDocumento().getValue(),
      'apartamento': user.getApartamento(),
      'bloco': user.getBloco(),
      'nascimento': user.getNascimento()
    })
  }
  async getAll(): Promise<User[]> {
    const userCollection: Array<User> = []
  
    const users = await this.connection('user').select('*')

    for (var i = 0; i < users.length; i++) {
      const user = users[i]
      const id = user['id']
      const nome = user['nome']
      const documento = user['documento']
      const apartamento = user['apartamento']
      const bloco = user['bloco']
      const nascimento = user['nascimento']
      userCollection.push(User.create(nome, documento, apartamento, bloco, nascimento, id))
    }
    return userCollection
  }

  async getById(id: Uuid): Promise<User> {
    const result = await this.connection('user')
    .select('*')
    .where({ id: id.getValue() })
    .limit(1);

  const user = result[0]; 

  if (!user) {
    throw new Error(`Usuário não encontrado: ${id.getValue()}`);
  }

  return User.create(
    user['nome'],
    user['documento'],
    user['apartamento'],
    user['bloco'],
    user['nascimento'],
    user['id']
  );
  }

  async remove(id: Uuid): Promise<void> {
    await this.connection('user').where({'id': id.getValue()}).delete()
  }

  update(id: Uuid): Promise<void> {
    throw new Error('Method not implemented.');
  }
}