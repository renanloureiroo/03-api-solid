import { prisma } from '@/lib/prisma'
import { ICheckInsRepository } from '../check-ins-repository.interface'
import { CheckIn, Prisma } from '@prisma/client'

class PrismaCheckInsRepository implements ICheckInsRepository {
  countByUserId(userId: string): Promise<number> {
    return prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })
  }
  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    return prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: date,
          lt: new Date(date.getTime() + 86400000),
        },
      },
    })
  }
  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const itensPerPage = 20

    return prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      skip: (page - 1) * itensPerPage,
      take: itensPerPage,
    })
  }

  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    return prisma.checkIn.create({
      data: data,
    })
  }
}

export { PrismaCheckInsRepository }
