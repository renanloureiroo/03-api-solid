import { IGymsRepository } from '@/repositories/gyms-repository/gyms-repository.interface'

interface CreateGymDTO {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

export class CreateGymUseCase {
  constructor(private readonly gymRepository: IGymsRepository) {}

  async execute({
    title,
    latitude,
    longitude,
    description,
    phone,
  }: CreateGymDTO) {
    const gym = await this.gymRepository.create({
      title,
      latitude,
      longitude,
      description,
      phone,
    })

    return gym
  }
}
