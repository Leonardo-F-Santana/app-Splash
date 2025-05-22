import { Request, Response } from "express"
import { UserRepository } from "../../model/repository/UserRepository"
import { Uuid } from "../../model/Uuid"

export class UserRemoveById {

  constructor(readonly repository: UserRepository) {
  }

  async execute(request: Request, response: Response) {
    let id: string|Uuid = request.params.id
    id = new Uuid(id)
    await this.repository.remove(id)
    response.status(204).json({})
  }
}