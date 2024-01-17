import BcryptJs from 'bcryptjs'
import { IEncryptProvider } from '../encrypt.interface'

class EncryptProviderBcryptjs implements IEncryptProvider {
  hash(payload: string): Promise<string> {
    return BcryptJs.hash(payload, 8)
  }
  compare(payload: string, hashed: string): Promise<boolean> {
    return BcryptJs.compare(payload, hashed)
  }
}

export { EncryptProviderBcryptjs }
