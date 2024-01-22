import { prisma } from '@/lib/prisma'
import { ICheckInsRepository } from '../check-ins-repository.interface'
import { CheckIn, Prisma } from '@prisma/client'
import dayjs from 'dayjs'

class PrismaCheckInsRepository implements ICheckInsRepository {
  update(data: CheckIn): Promise<CheckIn> {
    return prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data: data,
    })
  }
  findById(id: string): Promise<CheckIn | null> {
    return prisma.checkIn.findUnique({
      where: {
        id: id,
      },
    })
  }
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
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    return prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
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
