import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { InMemoryUsersRepository } from '@/repositories/users-repository/in-memory-users-repository'
import { UserAlreadyExists } from './errors/user-already-exists'

let registerUseCase: RegisterUseCase
let usersRepository: InMemoryUsersRepository

describe('UseCases: Register', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    registerUseCase = new RegisterUseCase(usersRepository)
  })
  it('should be able to register a new user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'mocked_password',
    }

    await registerUseCase.execute(userData)

    const user = await usersRepository.findByEmail(userData['email'])

    expect(user).toBeTruthy()
    expect(user?.name).toBe(userData['name'])
    expect(user?.email).toBe(userData['email'])
  })

  it('should not be able to register a new user with a account already created using same email', async () => {
    const userData = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'mocked_password',
    }
    const userData2 = {
      name: 'John Doe 2',
      email: userData['email'],
      password: 'mocked_password',
    }

    await registerUseCase.execute(userData)

    await expect(registerUseCase.execute(userData2)).rejects.toThrow(
      UserAlreadyExists,
    )
  })

  it('should be able to register a new user with a hashed password', async () => {
    const userData = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'mocked_password',
    }

    const response = await registerUseCase.execute(userData)

    expect(response.user?.password_hash).not.toEqual(userData['password'])
  })
})
