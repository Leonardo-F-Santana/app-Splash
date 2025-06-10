import { Request, Response } from "express"
import { UserRepository } from "../../model/repository/MoradorRepository"
import { Uuid } from "../../model/Uuid"

export class UserGetById {

  constructor(readonly repository: UserRepository) {
  }

  async execute(request: Request, response: Response) {
    let id: string|Uuid = request.params.id

    id = new Uuid(id)
    const user = await this.repository.getById(id)
    response.status(200).json({user})
  }
}