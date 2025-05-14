import { Request, Response, Router } from 'express'
import { UserRepositoryInMemory } from './infra/repository/memory/UserRepositoryInMemory';
import { UserCreate } from './controller/UserController/UserCreate';
import { UserList } from './controller/UserController/UserList';
import { UserRepositoryDatabase } from './infra/repository/database/UserRepositoryDatabase';
import { UserGetById } from './controller/UserController/UserGetById'

const router = Router()

//const repository = new UserRepositoryInMemory()
const repository = new UserRepositoryDatabase()
const userCreate = new UserCreate(repository)
const userList = new UserList(repository)
const userGetById = new UserGetById(repository)

router.post('/user', (request: Request, response: Response) => {
  userCreate.execute(request, response)
})

router.get('/user', (request: Request, response: Response) => {
  userList.execute(request, response)
})

router.get('/user/:id', (request: Request, response: Response) => {
  userGetById.execute(request, response)
})

export { router }