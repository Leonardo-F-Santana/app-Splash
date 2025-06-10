import { Request, Response } from "express"
import { UserRepository } from "../../model/repository/MoradorRepository"

export class UserList {

  constructor(readonly repository: UserRepository) {
  }

  async execute(request: Request, response: Response) {
    const userCollection = await this.repository.getAll()
    response.status(200).json({userCollection})
  }
}