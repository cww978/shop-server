import { Provide, App, Logger, Inject, Config } from '@midwayjs/decorator'
import { Application } from '@midwayjs/koa'
import { InjectEntityModel } from '@midwayjs/orm'
import { Repository } from 'typeorm'
import { ILogger } from '@midwayjs/logger'
import axios from 'axios'
import moment = require('moment')

import { WxCheckOption } from '../interface'
import { sha1, copyValueToParams } from '../utils/index'
import { WxAccessToken } from '../entity/wx_access_token'
import { WxUser } from '../entity/wx_user'
import { AuthService } from './auth.service'
import { WxAccessTokenRes, WxUserInfoRes } from '../interface'

@Provide()
export class WxService {
  @Logger()
  logger: ILogger

  @Inject()
  authService: AuthService

  @Config('wx')
  wxConfig

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
    const access: WxAccessTokenRes = await this.getAccessTokenForCode(code)
    const user: WxUserInfoRes = await this.getWxUserInfo(
      access?.access_token,
      access?.openid
    )
    if (user) {
      const token = await this.authService.createToken(
        user.openid,
        user.nickname
      )
      return {
        user_id: user.openid,
        user_info: user,
        token
      }
    } else {
      return null
    }
  }

  async getAccessTokenForCode(code: string): Promise<WxAccessTokenRes> {
    const { appid, appsecret } = this.wxConfig

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
      return data
    } else {
      return null
    }
  }

  async getAccessTokenForOpenid(openid: string): Promise<string> {
    const access = await this.accessTokenModel.findOne({
      where: { openid: openid }
    })
    if (access === null) {
      return null
    } else {
      const saveTime = moment(access.update_time).valueOf() + access.expires_in
      const nowTime = moment(Date.now()).valueOf()
      if (nowTime < saveTime) {
        return access.access_token
      } else {
        const refresh = await this.getRefreshToken(access.refresh_token)
        access.access_token = refresh.access_token
        access.refresh_token = refresh.refresh_token
        access.expires_in = refresh.expires_in
        this.accessTokenModel.save(access)
        return access.access_token
      }
    }
  }

  async getRefreshToken(refresh_token: string): Promise<WxAccessTokenRes> {
    const { appid } = this.wxConfig
    const { data } = await axios.get(
      `https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=${appid}&grant_type=refresh_token&refresh_token=${refresh_token}`
    )
    return data
  }

  async getWxUserInfo(token: string, openid: string): Promise<WxUserInfoRes> {
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

      return data
    } else {
      return null
    }
  }
}
