import { IUsersRepository } from '@/repositories/users-repository/users-repository.interface'
import { User } from '@prisma/client'
import { ResourceNotFound } from './errors/resource-not-found'

interface GetUserProfileUseCaseDTO {
  userId: string
}

interface GetUserProfileUseCaseResponse {
  user: User
}

class GetUserProfileUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseDTO): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    return {
      user,
    }
  }
}

export { GetUserProfileUseCase }
