import { Prisma, User } from '@prisma/client'
import { IUsersRepository } from './users-repository'
import { randomUUID } from 'node:crypto'

class InMemoryUsersRepository implements IUsersRepository {
  private users: Array<User>

  constructor() {
    this.users = []
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email)

    return user ? user : null
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user: User = {
      id: randomUUID(),
      ...data,
      created_at: new Date(),
    }

    this.users.push(user)

    return user
  }
}

export { InMemoryUsersRepository }
