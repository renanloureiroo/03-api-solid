import { Gym, Prisma } from '@prisma/client'

interface IGymsRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>

  findById(id: string): Promise<Gym | null>

  search(query: string, page: number): Promise<Gym[]>
}

export { IGymsRepository }
