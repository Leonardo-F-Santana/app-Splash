import { User } from "../User";
import { Uuid } from "../Uuid";


export interface UserRepository {
  save(user: User): Promise<void>
  getAll(): Promise<Array<User>>
  getById(id: Uuid): Promise<User>
  remove(id: Uuid): Promise<void>
  update(id: Uuid): Promise<void>
}