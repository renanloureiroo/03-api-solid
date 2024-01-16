import { IUsersRepository } from '@/repositories/users-repository/users-repository'
import { hash } from 'bcryptjs'

export interface RegisterUseCaseDTO {
  name: string
  email: string
  password: string
}

class RegisterUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseDTO) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new Error('E-mail already exists!')
    }

    const password_hash = await hash(password, 8)

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}

export { RegisterUseCase }
