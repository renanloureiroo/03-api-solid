import { ICheckInsRepository } from '@/repositories/check-ins-repository/check-ins-repository.interface'
import { beforeEach, describe, expect, it } from 'vitest'
import { ValidateCheckInUseCase } from './validate-check-in'
import { InMemoryCheckInsRepository } from '@/repositories/check-ins-repository/in-memory-check-ins-repository'
import { ResourceNotFound } from './errors/resource-not-found'

let checkInsRepository: ICheckInsRepository
let sut: ValidateCheckInUseCase

describe('Use Case: Validate Check In', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)
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
})
