import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in-use-case'
import { ICheckInsRepository } from '@/repositories/check-ins-repository/check-ins-repository.interface'
import { InMemoryCheckInsRepository } from '@/repositories/check-ins-repository/in-memory-check-ins-repository'
import { IGymsRepository } from '@/repositories/gyms-repository/gyms-repository.interface'
import { InMemoryGymsRepository } from '@/repositories/gyms-repository/in-memory-gyms-repository'

let checkInsRepository: ICheckInsRepository
let gymsRepository: IGymsRepository
let sut: CheckInUseCase
describe('Use Case: Check In', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })
  it('should be able to check in', async () => {
    const gymData = {
      title: 'any_name',
      latitude: -20.2617561,
      longitude: -40.2668403,
    }
    const gym = await gymsRepository.create(gymData)

    const checkInData = {
      gymId: gym.id,
      userId: 'any_user_id',
      userLatitude: -20.2617561,
      userLongitude: -40.2668403,
    }

    const checkIn = await sut.execute(checkInData)

    expect(checkIn).toEqual({
      checkIn: expect.objectContaining({
        id: expect.any(String),
        gym_id: checkInData.gymId,
        user_id: checkInData.userId,
        validated_at: null,
        created_at: expect.any(Date),
      }),
    })
  })

  it('should not be able to check in twice in the same day', async () => {
    const date = new Date(2023, 0, 18, 5, 26, 0)
    vi.setSystemTime(date)

    const gymData = {
      title: 'any_name',
      latitude: -20.2617561,
      longitude: -40.2668403,
    }
    const gym = await gymsRepository.create(gymData)

    const checkInData = {
      gymId: gym.id,
      userId: 'any_user_id',
      userLatitude: -20.2617561,
      userLongitude: -40.2668403,
    }

    await sut.execute(checkInData)

    await expect(() => sut.execute(checkInData)).rejects.toBeInstanceOf(Error)
  })

  it('should  be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 18, 5, 26, 0))

    const gymData = {
      title: 'any_name',
      latitude: -20.2617561,
      longitude: -40.2668403,
    }
    const gym = await gymsRepository.create(gymData)

    const checkInData = {
      gymId: gym.id,
      userId: 'any_user_id',
      userLatitude: -20.2617561,
      userLongitude: -40.2668403,
    }

    await sut.execute(checkInData)

    vi.setSystemTime(new Date(2023, 0, 19, 0, 0, 1))
    const checkIn = await sut.execute(checkInData)

    expect(checkIn).toEqual({
      checkIn: expect.objectContaining({
        id: expect.any(String),
        gym_id: checkInData.gymId,
        user_id: checkInData.userId,
        validated_at: null,
        created_at: new Date(2023, 0, 19, 0, 0, 1),
      }),
    })
  })
  it('should  be able to check in on distant gym', async () => {
    vi.setSystemTime(new Date(2023, 0, 18, 5, 26, 0))

    const gymData = {
      title: 'any_name2',
      latitude: -20.2627792,
      longitude: -40.2664045,
    }

    const gym = await gymsRepository.create(gymData)

    const checkInData = {
      gymId: gym.id,
      userId: 'any_user_id',
      userLatitude: -20.2618752,
      userLongitude: -40.269016,
    }

    vi.setSystemTime(new Date(2023, 0, 19, 0, 0, 1))
    await expect(() => sut.execute(checkInData)).rejects.toBeInstanceOf(Error)
  })
})
