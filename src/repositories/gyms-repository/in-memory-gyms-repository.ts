import { Gym, Prisma } from '@prisma/client'

import { randomUUID } from 'node:crypto'
import { IGymsRepository } from './gyms-repository.interface'
import { Decimal } from '@prisma/client/runtime/library'

class InMemoryGymsRepository implements IGymsRepository {
  private gyms: Array<Gym>

  constructor() {
    this.gyms = []
  }
  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: randomUUID(),
      ...data,
      description: data.description ? data.description : null,
      phone: data.phone ? data.phone : null,
      latitude: new Decimal(data.latitude as number),
      longitude: new Decimal(data.longitude as number),
    }
    this.gyms.push(gym)
    return gym
  }
  async findById(id: string): Promise<Gym | null> {
    const gym = this.gyms.find((gym) => gym.id === id)
    return gym ? gym : null
  }
}

export { InMemoryGymsRepository }
