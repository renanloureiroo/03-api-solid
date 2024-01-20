import { Gym, Prisma } from '@prisma/client'

import { randomUUID } from 'node:crypto'
import { IGymsRepository } from './gyms-repository.interface'
import { Decimal } from '@prisma/client/runtime/library'

class InMemoryGymsRepository implements IGymsRepository {
  private gyms: Array<Gym>

  constructor() {
    this.gyms = []
  }
  search(query: string, page: number): Promise<Gym[]> {
    const skip = (page - 1) * 20
    return Promise.resolve(
      this.gyms
        .filter((gym) => gym.title.includes(query))
        .slice(skip, skip + 20),
    )
  }
  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
      created_at: new Date(),
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
