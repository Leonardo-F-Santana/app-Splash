import { User } from "../../../model/Morador";
import { Uuid } from "../../../model/Uuid";
import { UserRepository } from "../../../model/repository/MoradorRepository";


export class UserRepositoryInMemory implements UserRepository {

  private userCollection: Array<User> = []

  async save(user: User): Promise<void> {
    this.userCollection.push(user)
  }
  
  async getAll(): Promise<User[]> {
    return this.userCollection
  }

  getById(id: Uuid): Promise<User> {
    throw new Error("Method not implemented.");
  }

  remove(id: Uuid): Promise<void> {
    throw new Error("Method not implemented.");
  }

  update(id: Uuid): Promise<void> {
    throw new Error("Method not implemented.");
  }
}