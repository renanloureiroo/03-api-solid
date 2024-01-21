import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { FetchCheckInsHistoryUseCase } from './fetch-check-ins-history'

import { ICheckInsRepository } from '@/repositories/check-ins-repository/check-ins-repository.interface'
import { InMemoryCheckInsRepository } from '@/repositories/check-ins-repository/in-memory-check-ins-repository'
import { PageExtrapolatedTotalPages } from './errors/page-extrapolated-total-pages'

let checkInsRepository: ICheckInsRepository

let sut: FetchCheckInsHistoryUseCase
describe('Use Case: Fetch check ins history', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchCheckInsHistoryUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })
  it('should be able list history of check ins', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 4, 18, 0))
    await checkInsRepository.create({
      gym_id: 'gym_id_01',
      user_id: 'user_id',
    })

    vi.setSystemTime(new Date(2024, 0, 20, 4, 19, 0))
    await checkInsRepository.create({
      gym_id: 'gym_id_02',
      user_id: 'user_id',
    })

    const checkIns = await sut.execute({ userId: 'user_id' })

    expect(checkIns.checkIns).toHaveLength(2)
    expect(checkIns).toEqual({
      pages: 1,
      checkIns: expect.arrayContaining([
        expect.objectContaining({
          gym_id: 'gym_id_01',
          user_id: 'user_id',
        }),
        expect.objectContaining({
          gym_id: 'gym_id_02',
          user_id: 'user_id',
        }),
      ]),
    })
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i < 26; i++) {
      vi.setSystemTime(new Date(2024, 0, i, 4, 40, 0))
      await checkInsRepository.create({
        gym_id: `gym_id_${i}`,
        user_id: 'user_id',
      })
    }

    const checkIns = await sut.execute({ userId: 'user_id', page: 2 })

    expect(checkIns.checkIns).toHaveLength(5)
    expect(checkIns).toEqual({
      pages: 2,
      checkIns: expect.arrayContaining([
        expect.objectContaining({
          gym_id: 'gym_id_21',
          user_id: 'user_id',
        }),
        expect.objectContaining({
          gym_id: 'gym_id_22',
          user_id: 'user_id',
        }),
        expect.objectContaining({
          gym_id: 'gym_id_23',
          user_id: 'user_id',
        }),
        expect.objectContaining({
          gym_id: 'gym_id_24',
          user_id: 'user_id',
        }),
        expect.objectContaining({
          gym_id: 'gym_id_25',
          user_id: 'user_id',
        }),
      ]),
    })
  })

  it('should not be possible to search the paginated check-in history with a greater number of pages than the total', async () => {
    for (let i = 1; i < 26; i++) {
      vi.setSystemTime(new Date(2024, 0, i, 4, 40, 0))
      await checkInsRepository.create({
        gym_id: `gym_id_${i}`,
        user_id: 'user_id',
      })
    }

    await expect(() =>
      sut.execute({ userId: 'user_id', page: 3 }),
    ).rejects.toBeInstanceOf(PageExtrapolatedTotalPages)
  })
})
