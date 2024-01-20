import { IGymsRepository } from '@/repositories/gyms-repository/gyms-repository.interface'
import { Gym } from '@prisma/client'

interface FetchNearbyGymsDTO {
  userLatitude: number
  userLongitude: number
}

interface FetchNearbyGymsResponse {
  gyms: Gym[]
}

class FetchNearbyGymsUseCase {
  constructor(private gymsRepository: IGymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsDTO): Promise<FetchNearbyGymsResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return {
      gyms,
    }
  }
}

export { FetchNearbyGymsUseCase }
