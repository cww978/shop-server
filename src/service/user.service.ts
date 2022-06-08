import { Provide } from '@midwayjs/decorator'
import { IUserOptions } from '../interface'
import { InjectEntityModel } from '@midwayjs/orm'
import { WxUser } from '../entity/wx_user'
import { Repository } from 'typeorm'

@Provide()
export class UserService {
  @InjectEntityModel(WxUser)
  photoModel: Repository<WxUser>

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
    const result = await this.photoModel.save(user)
    return result
  }
}
