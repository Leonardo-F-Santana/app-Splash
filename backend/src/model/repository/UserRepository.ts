import { User } from "../User";


export interface UserRepository {
  save(user: User): Promise<void>
  getAll(): Promise<Array<User>>
}