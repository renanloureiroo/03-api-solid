import { prisma } from '@/lib/prisma'
import { ICheckInsRepository } from '../check-ins-repository.interface'
import { CheckIn, Prisma } from '@prisma/client'

class PrismaCheckInsRepository implements ICheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    return prisma.checkIn.create({
      data: data,
    })
  }
}

export { PrismaCheckInsRepository }
