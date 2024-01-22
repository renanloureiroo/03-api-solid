import { User } from '@prisma/client'

export function userMapper(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.created_at,
  }
}
