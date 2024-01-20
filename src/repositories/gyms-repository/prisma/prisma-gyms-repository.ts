import { Gym, Prisma } from '@prisma/client'

import { IGymsRepository } from '../gyms-repository.interface'
import { prisma } from '@/lib/prisma'

class PrismaGymsRepository implements IGymsRepository {
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
