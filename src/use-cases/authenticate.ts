import { IUsersRepository } from '@/repositories/users-repository/users-repository.interface'

import { IEncryptProvider } from '@/shared/providers/encrypt/encrypt.interface'

import { User } from '@prisma/client'
import { InvalidCredentials } from './errors/user-invalid-credentials'

interface AuthenticateUseCaseDTO {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

class AuthenticateUseCase {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly encryptProvider: IEncryptProvider,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseDTO): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentials()
    }

    const isPasswordCorrect = await this.encryptProvider.compare(
      password,
      user.password_hash,
    )

    if (!isPasswordCorrect) {
      throw new InvalidCredentials()
    }

    return {
      user,
    }
  }
}

export { AuthenticateUseCase }
