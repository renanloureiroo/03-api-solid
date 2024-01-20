import { IGymsRepository } from '@/repositories/gyms-repository/gyms-repository.interface'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/gyms-repository/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from '../fetch-nearby-gyms'

let gymsRepository: IGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Use Case: Fetch Nearby Gyms', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should return a list of gyms', async () => {
    await gymsRepository.create({
      title: 'any_name',
      latitude: -20.2617561,
      longitude: -40.2668403,
    })

    await gymsRepository.create({
      title: 'any_name2',
      latitude: -20.2627792,
      longitude: -40.2664045,
    })

    const { gyms } = await sut.execute({
      userLatitude: -20.2618752,
      userLongitude: -40.269016,
    })

    expect(gyms).toHaveLength(2)

    expect(gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          title: 'any_name',
        }),
        expect.objectContaining({
          id: expect.any(String),
          title: 'any_name2',
        }),
      ]),
    )
  })
  it('should be  return a empty list ', async () => {
    await gymsRepository.create({
      title: 'any_name2',
      latitude: -20.0029512,
      longitude: -40.4119798,
    })

    const { gyms } = await sut.execute({
      userLatitude: -20.2618752,
      userLongitude: -40.269016,
    })

    expect(gyms).toHaveLength(0)
  })
})
