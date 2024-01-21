import { ICheckInsRepository } from '@/repositories/check-ins-repository/check-ins-repository.interface'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ValidateCheckInUseCase } from './validate-check-in'
import { InMemoryCheckInsRepository } from '@/repositories/check-ins-repository/in-memory-check-ins-repository'
import { ResourceNotFound } from './errors/resource-not-found'
import { MaxTime } from './errors/max-time'

let checkInsRepository: ICheckInsRepository
let sut: ValidateCheckInUseCase

describe('Use Case: Validate Check In', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })
  it('should be able to validate a check in', async () => {
    const checkIn = await checkInsRepository.create({
      gym_id: 'aby_gym_id',
      user_id: 'any_user_id',
    })

    const validatedCheckIn = await sut.execute({
      checkInId: checkIn.id,
    })

    expect(validatedCheckIn.checkIn).toEqual(
      expect.objectContaining({
        validated_at: expect.any(Date),
      }),
    )
  })

  it('should not be able to validate a check in does not exists', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'any_check_in_id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  // eslint-disable-next-line quotes
  it("should not be able to validate a check in outside the maximum time limit of 20 minutes after it's creation", async () => {
    vi.setSystemTime(new Date(2024, 0, 21, 1, 3, 0))
    const checkIn = await checkInsRepository.create({
      gym_id: 'aby_gym_id',
      user_id: 'any_user_id',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21 // 21 minutes

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() =>
      sut.execute({
        checkInId: checkIn.id,
      }),
    ).rejects.toBeInstanceOf(MaxTime)
  })
})
