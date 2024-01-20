import { Gym, Prisma } from '@prisma/client'

interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

interface IGymsRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>

  findById(id: string): Promise<Gym | null>

  findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>

  search(query: string, page: number): Promise<Gym[]>
}

export { IGymsRepository, FindManyNearbyParams }
