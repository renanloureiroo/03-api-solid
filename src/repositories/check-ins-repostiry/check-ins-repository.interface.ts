import { CheckIn, Prisma } from '@prisma/client'

interface ICheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
}

export { ICheckInsRepository }
