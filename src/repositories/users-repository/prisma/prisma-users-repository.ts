import { prisma } from '@/lib/prisma'
import { Prisma, User } from '@prisma/client'
import { IUsersRepository } from '../users-repository.interface'

export class PrismaUsersRepository implements IUsersRepository {
  findById(id: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        id,
      },
    })
  }
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        email,
      },
    })
  }
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
    })
  }
}
