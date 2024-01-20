import { CheckIn, Prisma } from '@prisma/client'
import { ICheckInsRepository } from './check-ins-repository.interface'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

class InMemoryCheckInsRepository implements ICheckInsRepository {
  private checkIns: CheckIn[]
  constructor() {
    this.checkIns = []
  }

  async countByUserId(userId: string): Promise<number> {
    const checkIns = this.checkIns.filter((checkIn) => {
      return checkIn.user_id === userId
    })

    return checkIns.length
  }
  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const itensPerPage = 20
    const checkIns = this.checkIns.filter((checkIn) => {
      return checkIn.user_id === userId
    })
    const paginatedCheckIns = checkIns.slice(
      (page - 1) * itensPerPage,
      page * itensPerPage,
    )

    return paginatedCheckIns
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkIn = this.checkIns.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDay =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return checkIn.user_id === userId && isOnSameDay
    })
    return checkIn ? checkIn : null
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
