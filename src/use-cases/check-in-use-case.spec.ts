import { ICheckInsRepository } from '@/repositories/check-ins-repostiry/check-ins-repository.interface'
import { beforeEach, describe, expect, it } from 'vitest'
import { CheckInUseCase } from './check-in-use-case'
import { InMemoryCheckInsRepository } from '@/repositories/check-ins-repostiry/in-memory-check-ins-repository'

let checkInsRepository: ICheckInsRepository
let sut: CheckInUseCase
describe('Use Case: Check In', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInsRepository)
  })
  it('should be able to check in', async () => {
    const checkInData = {
      gymId: 'any_gym_id',
      userId: 'any_user_id',
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
})
