import { IGymsRepository } from '@/repositories/gyms-repository/gyms-repository.interface'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'
import { InMemoryGymsRepository } from '@/repositories/gyms-repository/in-memory-gyms-repository'

let gymsRepository: IGymsRepository
let sut: SearchGymsUseCase

describe('Use Case: Search Gyms', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should return a list of gyms', async () => {
    for (let i = 0; i < 10; i++) {
      gymsRepository.create({
        title: `Gym ${i}`,
        latitude: 0,
        longitude: 0,
      })
    }

    const result = await sut.execute({ query: '5' })

    expect(result.gyms).toHaveLength(1)
  })

  it('should return a list of gyms with pagination', async () => {
    for (let i = 0; i < 25; i++) {
      gymsRepository.create({
        title: `Gym ${i}`,
        latitude: 0,
        longitude: 0,
      })
    }
    const result = await sut.execute({ query: 'Gy', page: 2 })

    expect(result.gyms).toHaveLength(5)
  })

  // eslint-disable-next-line quotes
  it("should return an empty list if there's no gyms", async () => {
    for (let i = 0; i < 10; i++) {
      gymsRepository.create({
        title: `Gym ${i}`,
        latitude: 0,
        longitude: 0,
      })
    }
    const result = await sut.execute({ query: 'Test' })

    expect(result.gyms).toHaveLength(0)
  })
})
