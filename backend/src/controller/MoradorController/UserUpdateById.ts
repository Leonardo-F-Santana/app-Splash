import { Request, Response } from "express"
import { UserRepository } from "../../model/repository/MoradorRepository"
import { User } from "../../model/Morador"
import { UserUpdateDTO } from "./DTOs/UserUpdateDTO"
import { Uuid } from "../../model/Uuid"

export class UserUpdateById {

  constructor(readonly repository: UserRepository) {
  }

  async execute(request: Request, response: Response) {
    const { id } = request.params
    const { nome, documento } = request.body
    let user = User.create(nome, documento, id)
    const userDto = new UserUpdateDTO(user.getNome(), user.getDocumento().getValue())
    user = await this.repository.update(user.getId(), userDto)
    response.status(200).json({user})
  }
}