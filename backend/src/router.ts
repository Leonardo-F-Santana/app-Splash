import { Request, Response, Router } from 'express'
import { UserRepositoryInMemory } from './infra/repository/memory/UserRepositoryInMemory';
import { UserCreate } from './controller/UserController/UserCreate';
import { UserList } from './controller/UserController/UserList';

const router = Router()

const repository = new UserRepositoryInMemory()
const userCreate = new UserCreate(repository)
const userList = new UserList(repository)

router.post('/user', (request: Request, response: Response) => {
  userCreate.execute(request, response)
})

router.get('/user', (request: Request, response: Response) => {
  userList.execute(request, response)
})

export { router }