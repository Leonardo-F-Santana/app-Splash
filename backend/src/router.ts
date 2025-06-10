import { Request, Response, Router } from 'express'
import { UserRepositoryInMemory } from './infra/repository/memory/UserRepositoryInMemory';
import { UserCreate } from './controller/MoradorController/MoradorCreate';
import { UserList } from './controller/MoradorController/UserList';
import { UserRepositoryDatabase } from './infra/repository/database/MoradorRepositoryDatabase';
import { UserGetById } from './controller/MoradorController/UserGetById'
import { UserRemoveById } from './controller/MoradorController/UserRemoveById';
import { UserUpdateById } from './controller/MoradorController/UserUpdateById';



const router = Router()

//const repository = new UserRepositoryInMemory()
const repository = new UserRepositoryDatabase()
const userCreate = new UserCreate(repository)
const userList = new UserList(repository)
const userGetById = new UserGetById(repository)
const userRemoveById = new UserRemoveById(repository)
const userUpdateById = new UserUpdateById(repository)

router.post('/user', (request: Request, response: Response) => {
  userCreate.execute(request, response)
})

router.get('/user', (request: Request, response: Response) => {
  userList.execute(request, response)
})

router.get('/user/:id', (request: Request, response: Response) => {
  userGetById.execute(request, response)
})

router.delete('/user/:id', (request: Request, response: Response) => {
  userRemoveById.execute(request, response)
})

router.patch('/user/:id', (request: Request, response: Response) => {
  userUpdateById.execute(request, response)
})

export { router }