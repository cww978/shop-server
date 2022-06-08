import { Provide, Inject } from '@midwayjs/decorator'
import { IUserOptions } from '../interface'
import { InjectEntityModel } from '@midwayjs/orm'
import { JwtService } from '@midwayjs/jwt'
import { WxUser } from '../entity/wx_user'
import { Repository } from 'typeorm'

@Provide()
export class UserService {
  @InjectEntityModel(WxUser)
  userModel: Repository<WxUser>

  @Inject()
  jwtService: JwtService

  async getUser(options: IUserOptions) {
    return {
      id: options.uid,
      name: '曹文维'
    }
  }

  async setUser() {
    const user = new WxUser()
    user.nickname = 'caoww'
    user.mobile = '17673627972'
    const result = await this.userModel.save(user)
    return result
  }

  async getToken(userid: string, username: string) {
    const payload = {
      userid: userid,
      username: username
    }
    const token = await this.jwtService.sign(payload)
    return token
  }
}
