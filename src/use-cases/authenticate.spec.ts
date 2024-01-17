import { InMemoryUsersRepository } from '@/repositories/users-repository/in-memory-users-repository'
import { EncryptProvider } from '@/shared/providers/encrypt/encrypt'
import { beforeEach, describe, expect, it } from 'vitest'

import { AuthenticateUseCase } from './authenticate'
import { IEncryptProvider } from '@/shared/providers/encrypt/encrypt.interface'
import { InvalidCredentials } from './errors/user-invalid-credentials'

let encryptProvider: IEncryptProvider
let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('UseCases: Authenticate', () => {
  beforeEach(() => {
    encryptProvider = new EncryptProvider()
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository, encryptProvider)
  })
  it('should be able to authenticate user', async () => {
    const password = 'mocked_password'
    const password_hash = await encryptProvider.hash(password)

    const userData = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash,
    }

    const user = await usersRepository.create(userData)

    const response = await sut.execute({
      email: user.email,
      password,
    })

    expect(response.user.id).toEqual(user.id)
  })

  it('should not be able to authenticate user with wrong password', async () => {
    const password = 'mocked_password'
    const password_hash = await encryptProvider.hash(password)

    const userData = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash,
    }

    const user = await usersRepository.create(userData)

    await expect(() =>
      sut.execute({
        email: user.email,
        password: 'wrong_password',
      }),
    ).rejects.toThrow(InvalidCredentials)
  })

  it('should not be able to authenticate user with wrong email', async () => {
    const password = 'mocked_password'
    const password_hash = await encryptProvider.hash(password)

    const userData = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash,
    }

    await usersRepository.create(userData)

    await expect(() =>
      sut.execute({
        email: 'wrong_email@email.com',
        password,
      }),
    ).rejects.toThrow(InvalidCredentials)
  })
})
