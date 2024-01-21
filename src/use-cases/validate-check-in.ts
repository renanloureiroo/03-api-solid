import { ICheckInsRepository } from '@/repositories/check-ins-repository/check-ins-repository.interface'
import { CheckIn } from '@prisma/client'
import { ResourceNotFound } from './errors/resource-not-found'

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
