import { Provide, App, Logger, Inject } from '@midwayjs/decorator'
import { Application } from '@midwayjs/koa'
import { InjectEntityModel } from '@midwayjs/orm'
import { Repository } from 'typeorm'
import { ILogger } from '@midwayjs/logger'

import { WxCheckOption } from '../interface'
import { sha1, copyValueToParams } from '../utils/index'
import { WxAccessToken } from '../entity/wx_access_token'
import { WxUser } from '../entity/wx_user'
import { UserService } from './user.service'
import axios from 'axios'

@Provide()
export class WxService {
  @Logger()
  logger: ILogger

  @Inject()
  userService: UserService

  @App()
  app: Application

  @InjectEntityModel(WxAccessToken)
  accessTokenModel: Repository<WxAccessToken>

  @InjectEntityModel(WxUser)
  userModel: Repository<WxUser>

  async check(options: WxCheckOption) {
    const token = 'caoww'
    const tmpArr = [token, options.timestamp, options.nonce]
    tmpArr.sort()
    const tmpStr = tmpArr.join('')
    const sha1Str = sha1(tmpStr)
    if (options.signature === sha1Str) {
      return options.echostr
    } else {
      return '授权失败'
    }
  }

  async wxLogin(code: string) {
    const access = await this.getWxUserAccessToken(code)
    const user = await this.getWxUserInfo(access?.access_token, access?.openid)
    if (user) {
      const token = await this.userService.getToken(user.openid, user.nickname)
      return {
        user_id: user.openid,
        user_info: user,
        token
      }
    } else {
      return null
    }
  }

  async getWxUserAccessToken(code: string): Promise<WxAccessToken> {
    const { appid, appsecret } = this.app.getConfig('wx')

    const { data } = await axios.get(
      `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${appsecret}&code=${code}&grant_type=authorization_code`
    )

    if (Object.hasOwnProperty.call(data, 'access_token')) {
      const access = await this.accessTokenModel.findOne({
        where: { openid: data.openid }
      })
      const accessParam = copyValueToParams<WxAccessToken>(
        data,
        access || new WxAccessToken(),
        WxAccessToken.getKeys()
      )
      await this.accessTokenModel.save(accessParam)
      return accessParam
    } else {
      return null
    }
  }

  async getWxUserInfo(token: string, openid: string): Promise<WxUser> {
    const { data } = await axios.get(
      `https://api.weixin.qq.com/sns/userinfo?access_token=${token}&openid=${openid}&lang=zh_CN`
    )
    if (Object.hasOwnProperty.call(data, 'openid')) {
      const user = await this.userModel.findOne({
        where: { openid: data.openid }
      })

      const userParam = copyValueToParams<WxUser>(
        data,
        user || new WxUser(),
        WxUser.getKeys()
      )

      this.userModel.save(userParam)

      return userParam
    } else {
      return null
    }
  }
}
