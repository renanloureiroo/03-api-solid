import { Gym, Prisma } from '@prisma/client'

import {
  FindManyNearbyParams,
  IGymsRepository,
} from '../gyms-repository.interface'
import { prisma } from '@/lib/prisma'

class PrismaGymsRepository implements IGymsRepository {
  async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    return prisma.gym.findMany({
      where: {
        latitude: {
          gte: params.latitude - 0.1,
          lte: params.latitude + 0.1,
        },
        longitude: {
          gte: params.longitude - 0.1,
          lte: params.longitude + 0.1,
        },
      },
    })
  }
  async search(query: string, page: number): Promise<Gym[]> {
    const skip = (page - 1) * 20
    return prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      skip,
      take: 20,
    })
  }
  create(data: Prisma.GymCreateInput): Promise<Gym> {
    return prisma.gym.create({
      data,
    })
  }
  findById(id: string): Promise<Gym | null> {
    return prisma.gym.findFirst({
      where: {
        id,
      },
    })
  }
}

export { PrismaGymsRepository }
