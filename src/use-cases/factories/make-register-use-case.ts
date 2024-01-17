import { PrismaUsersRepository } from '@/repositories/users-repository/prisma/prisma-users-repository'
import { EncryptProvider } from '@/shared/providers/encrypt/encrypt'
import { RegisterUseCase } from '../register'

export function makeRegisterUseCase() {
  const encryptProvider = new EncryptProvider()
  const usersRepository = new PrismaUsersRepository()

  const registerUseCase = new RegisterUseCase(usersRepository, encryptProvider)

  return registerUseCase
}
