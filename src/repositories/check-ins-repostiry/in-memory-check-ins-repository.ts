import { CheckIn, Prisma } from '@prisma/client'
import { ICheckInsRepository } from './check-ins-repository.interface'
import { randomUUID } from 'node:crypto'

class InMemoryCheckInsRepository implements ICheckInsRepository {
  private checkIns: CheckIn[]
  constructor() {
    this.checkIns = []
  }
  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn: CheckIn = {
      id: data.id ? data.id : randomUUID(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
      gym_id: data.gym_id,
      user_id: data.user_id,
    }

    this.checkIns.push(checkIn)
    return checkIn
  }
}

export { InMemoryCheckInsRepository }
