import { ICheckInsRepository } from '@/repositories/check-ins-repository/check-ins-repository.interface'
import { CheckIn } from '@prisma/client'
import { ResourceNotFound } from './errors/resource-not-found'
import dayjs from 'dayjs'
import { DISTANCE_IN_MINUTES_FROM_CHECK_IN_CREATION_ALLOWED } from '@/utils/constants'
import { MaxTime } from './errors/max-time'

interface ValidateCheckInDTO {
  checkInId: string
}
interface ValidateCheckInResponse {
  checkIn: CheckIn
}

class ValidateCheckInUseCase {
  constructor(private readonly checkInRepository: ICheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInDTO): Promise<ValidateCheckInResponse> {
    let checkIn = await this.checkInRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFound()
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minute',
    )

    if (
      distanceInMinutesFromCheckInCreation >
      DISTANCE_IN_MINUTES_FROM_CHECK_IN_CREATION_ALLOWED
    ) {
      throw new MaxTime()
    }

    Object.assign(checkIn, {
      validated_at: new Date(),
    })

    checkIn = await this.checkInRepository.update(checkIn)

    return {
      checkIn,
    }
  }
}

export { ValidateCheckInUseCase }
