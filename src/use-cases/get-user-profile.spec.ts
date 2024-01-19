import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/users-repository/in-memory-users-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFound } from './errors/resource-not-found'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Use Case: Get User Profile', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })
  it('should be able to get user profile', async () => {
    const userData = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash: 'mocked_password_hash',
    }

    const user = await usersRepository.create(userData)
    const response = await sut.execute({ userId: user.id })

    expect(response).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          id: expect.any(String),
          name: expect.stringMatching(userData['name']),
          email: expect.stringMatching(userData['email']),
          password_hash: expect.stringMatching(userData['password_hash']),
          created_at: expect.any(Date),
        }),
      }),
    )
  })

  it('should not be able to get user profile with invalid user id', async () => {
    const response = sut.execute({ userId: 'invalid_user_id' })

    await expect(response).rejects.toThrow(ResourceNotFound)
  })
})
