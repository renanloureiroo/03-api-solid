import { IGymsRepository } from '@/repositories/gyms-repository/gyms-repository.interface'
import { InMemoryGymsRepository } from '@/repositories/gyms-repository/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateGymUseCase } from './create-gym'

let gymRepository: IGymsRepository
let sut: CreateGymUseCase

describe('Use Case: Create Gym', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymRepository)
  })

  it('should be able to create a gym', async () => {
    const gymData = {
      title: 'any_name',
      description: 'any_description',
      phone: 'any_phone',
      latitude: -20.2617561,
      longitude: -40.2668403,
    }

    const gym = await sut.execute(gymData)

    expect(gym).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: gymData.title,
        description: gymData.description,
        phone: gymData.phone,
        created_at: expect.any(Date),
      }),
    )
  })
})
