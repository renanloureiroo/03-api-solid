import { compare, hash } from 'bcryptjs'
import { IEncryptProvider } from '../encrypt-interface'

class EncryptProviderBcryptjs implements IEncryptProvider {
  hash(payload: string): Promise<string> {
    return hash(payload, 8)
  }
  compare(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed)
  }
}

export { EncryptProviderBcryptjs }
