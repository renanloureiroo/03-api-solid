import { CheckIn } from '@prisma/client'

import { ICheckInsRepository } from '@/repositories/check-ins-repository/check-ins-repository.interface'
import { IGymsRepository } from '@/repositories/gyms-repository/gyms-repository.interface'
import { ResourceNotFound } from './errors/resource-not-found'
import {
  Point,
  calculateDistance,
} from '@/utils/calculate-distance-between-points'
import { MaxDistance } from './errors/max-distance'
import { MaxNumberOfCheckIns } from './errors/max-number-of-check-ins'
import { MAX_DISTANCE_ALLOWED } from '@/utils/constants'

interface CheckInUseCaseDTO {
  userId: string
  gymId: string
  userLongitude: number
  userLatitude: number
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

class CheckInUseCase {
  constructor(
    private readonly checkInsRepository: ICheckInsRepository,
    private readonly gymsRepository: IGymsRepository,
  ) {}

  async execute({
    gymId,
    userId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseDTO): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFound()
    }

    const userLocation: Point = {
      latitude: userLatitude,
      longitude: userLongitude,
    }

    const gymLocation: Point = {
      latitude: gym.latitude.toNumber(),
      longitude: gym.longitude.toNumber(),
    }

    const distance = calculateDistance(userLocation, gymLocation, 'm')

    if (distance > MAX_DISTANCE_ALLOWED) {
      throw new MaxDistance()
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckIns()
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return {
      checkIn,
    }
  }
}

export { CheckInUseCase }
