import { Provide, Inject } from '@midwayjs/decorator'
import { JwtService } from '@midwayjs/jwt'

@Provide()
export class AuthService {
  @Inject()
  jwtService: JwtService

  async createToken(userid: string, username: string) {
    const payload = {
      userid: userid,
      username: username
    }
    const token = await this.jwtService.sign(payload)
    return token
  }
}
