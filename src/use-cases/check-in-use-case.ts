import { CheckIn } from '@prisma/client'

import { ICheckInsRepository } from '@/repositories/check-ins-repository/check-ins-repository.interface'
import { IGymsRepository } from '@/repositories/gyms-repository/gyms-repository.interface'
import { ResourceNotFound } from './errors/resource-not-found'
import {
  Point,
  calculateDistance,
} from '@/utils/calculate-distance-between-points'

interface CheckInUseCaseDTO {
  userId: string
  gymId: string
  userLongitude: number
  userLatitude: number
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

const MAX_DISTANCE_ALLOWED = 100 // meters

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
      throw new Error('User is too far from gym')
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new Error('User already checked in today')
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
