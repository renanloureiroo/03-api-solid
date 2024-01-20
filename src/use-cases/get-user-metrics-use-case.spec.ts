import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ICheckInsRepository } from '@/repositories/check-ins-repository/check-ins-repository.interface'
import { InMemoryCheckInsRepository } from '@/repositories/check-ins-repository/in-memory-check-ins-repository'

import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInsRepository: ICheckInsRepository
let sut: GetUserMetricsUseCase

describe('Use Case: GetUserMetrics', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get metrics with no check-ins registers', async () => {
    const metrics = await sut.execute({ userId: 'user_id' })

    expect(metrics.totalCheckIns).toBe(0)
  })

  it('should be able to get metrics with check-ins registers', async () => {
    for (let i = 1; i < 26; i++) {
      vi.setSystemTime(new Date(2024, 0, i, 4, 40, 0))
      await checkInsRepository.create({
        gym_id: `gym_id_${i}`,
        user_id: 'user_id',
      })
    }

    const metrics = await sut.execute({ userId: 'user_id' })

    expect(metrics.totalCheckIns).toBe(25)
  })
})
