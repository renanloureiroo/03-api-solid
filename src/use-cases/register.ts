import { IUsersRepository } from '@/repositories/users-repository/users-repository'
import { UserAlreadyExists } from './errors/user-already-exists'
import { User } from '@prisma/client'
import { IEncryptProvider } from '@/shared/providers/encrypt/encrypt-interface'

export interface RegisterUseCaseDTO {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

class RegisterUseCase {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly encryptProvider: IEncryptProvider,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseDTO): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExists()
    }

    const password_hash = await this.encryptProvider.hash(password)

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
    return { user }
  }
}

export { RegisterUseCase }
