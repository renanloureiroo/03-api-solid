import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { InMemoryUsersRepository } from '@/repositories/users-repository/in-memory-users-repository'
import { UserAlreadyExists } from './errors/user-already-exists'

import { EncryptProvider } from '@/shared/providers/encrypt/encrypt'
import { IEncryptProvider } from '@/shared/providers/encrypt/encrypt.interface'

let encryptProvider: IEncryptProvider
let registerUseCase: RegisterUseCase
let usersRepository: InMemoryUsersRepository

describe('UseCases: Register', () => {
  beforeEach(() => {
    encryptProvider = new EncryptProvider()
    usersRepository = new InMemoryUsersRepository()
    registerUseCase = new RegisterUseCase(usersRepository, encryptProvider)
  })
  it('should be able to register a new user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'mocked_password',
    }

    await registerUseCase.execute(userData)

    const user = await usersRepository.findByEmail(userData['email'])

    expect(user?.id).toEqual(expect.any(String))
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

    await expect(() => registerUseCase.execute(userData2)).rejects.toThrow(
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

    const isPasswordCorrectlyHashed = await encryptProvider.compare(
      userData['password'],
      response.user?.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBeTruthy()
  })
})
