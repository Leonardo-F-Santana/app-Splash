import { Request, Response } from "express"
import { UserRepository } from "../../model/repository/UserRepository"
import { User } from "../../model/User"

export class UserCreate {

  constructor(readonly repository: UserRepository) {
  }

  async execute(request: Request, response: Response) {
    const { nome, documento, bloco, apartamento, nascimento } = request.body

    const user = User.create(nome, documento, bloco, apartamento, nascimento)
    await this.repository.save(user)
    response.status(201).json({user})
  }
}