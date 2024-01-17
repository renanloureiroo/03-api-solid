import { IUsersRepository } from '@/repositories/users-repository/users-repository.interface'

import { IEncryptProvider } from '@/shared/providers/encrypt/encrypt.interface'
import { InvalidCredentials } from './errors/user-unauthorized'
import { User } from '@prisma/client'

interface AuthenticateUseCaseDTO {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

class AuthenticationUseCase {
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

export { AuthenticationUseCase }
