import { Gym, Prisma } from '@prisma/client'

import { randomUUID } from 'node:crypto'
import {
  FindManyNearbyParams,
  IGymsRepository,
} from './gyms-repository.interface'
import { Decimal } from '@prisma/client/runtime/library'
import { calculateDistance } from '@/utils/calculate-distance-between-points'
import { MAX_DISTANCE_VIEW_GYM_ALLOWED } from '@/utils/constants'

class InMemoryGymsRepository implements IGymsRepository {
  private gyms: Array<Gym>

  constructor() {
    this.gyms = []
  }
  async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    const gyms = this.gyms.filter((gym) => {
      const distance = calculateDistance(
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        'km',
      )
      return distance < MAX_DISTANCE_VIEW_GYM_ALLOWED
    })

    return gyms
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
