import { PrismaUsersRepository } from '@/repositories/users-repository/prisma/prisma.users.repository'
import { EncryptProvider } from '@/shared/providers/encrypt/encrypt'

import { AuthenticateUseCase } from '../authenticate'

export function makeAuthenticateUseCase() {
  const encryptProvider = new EncryptProvider()
  const usersRepository = new PrismaUsersRepository()

  const authenticateUseCase = new AuthenticateUseCase(
    usersRepository,
    encryptProvider,
  )

  return authenticateUseCase
}
