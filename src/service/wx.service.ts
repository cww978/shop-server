import { Provide, App, Logger, Inject, Config } from '@midwayjs/decorator'
import { Application } from '@midwayjs/koa'
import { InjectEntityModel } from '@midwayjs/orm'
import { RedisService } from '@midwayjs/redis'
import { Repository } from 'typeorm'
import { ILogger } from '@midwayjs/logger'
import axios from 'axios'
import stringRandom = require('string-random')
import moment = require('moment')

import { WxCheckOption } from '../interface'
import { sha1, copyValueToParams, getExpiresTime } from '../utils/index'
import { WxAccessToken } from '../entity/wx_access_token'
import { WxUser } from '../entity/wx_user'
import { AuthService } from './auth.service'
import { WxAccessTokenRes, WxUserInfoRes, WxConfigRes } from '../interface'

@Provide()
export class WxService {
  @Logger()
  logger: ILogger

  @Inject()
  authService: AuthService

  @Inject()
  redisService: RedisService

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
    const user: WxUserInfoRes = await this.updateWxUserInfo(
      access?.access_token,
      access?.openid
    )
    if (user) {
      const token = await this.authService.createToken(
        user.openid,
        user.nickname
      )
      return token
    } else {
      return null
    }
  }

  async wxSignature(openid: string, url: string): Promise<WxConfigRes> {
    const jsapiTicket = await this.getJsTicket(openid)
    const config: WxConfigRes = {
      appid: this.wxConfig.appid,
      noncestr: stringRandom(16),
      timestamp: Date.now().valueOf(),
      signature: null
    }
    if (jsapiTicket) {
      const ticket = 'jsapi_ticket=' + jsapiTicket
      const timestamp = 'timestamp=' + config.timestamp
      const link = 'url=' + url
      const noncestr = 'noncestr=' + config.noncestr
      const string1 = `${ticket}&${noncestr}&${timestamp}&${link}`
      config.signature = sha1(string1)
    } else {
      this.logger.warn('【wxSignature】', 'jsapi_ticket is null')
    }
    return config
  }

  async getJsTicket(openid: string) {
    const key = 'jsticket-' + openid
    const ticket = await this.redisService.get(key)
    if (ticket) {
      return ticket
    } else {
      const access_token = await this.getGlobalAccessToken()
      const { data } = await axios.get(
        `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`
      )
      if (data.errcode === 0) {
        this.redisService.set(key, data.ticket, 'EX', data.expires_in)
        return data.ticket
      } else {
        this.logger.warn('【getJsTicket】' + data.errmsg)
        return null
      }
    }
  }

  async getGlobalAccessToken() {
    const key = 'global-access-token'
    const { appid, appsecret } = this.wxConfig
    const token = await this.redisService.get(key)
    if (token) {
      return token
    } else {
      const { data } = await axios.get(
        `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`
      )
      if (Object.hasOwnProperty.call(data, 'access_token')) {
        this.redisService.set(key, data.access_token, 'EX', data.expires_in)
        return data.access_token
      } else {
        this.logger.warn('【getGlobalAccessToken】' + data.errmsg)
        return null
      }
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
      accessParam.expires_time = new Date(getExpiresTime(data.expires_in))
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
      if (moment(Date.now()).isBefore(access.expires_time)) {
        return access.access_token
      } else {
        const refresh = await this.getRefreshToken(access.refresh_token)
        access.access_token = refresh.access_token
        access.refresh_token = refresh.refresh_token
        access.expires_time = new Date(getExpiresTime(refresh.expires_in))
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

  async getUserInfo(openid: string): Promise<WxUser> {
    return await this.userModel.findOne({
      where: { openid: openid }
    })
  }

  async updateWxUserInfo(
    token: string,
    openid: string
  ): Promise<WxUserInfoRes> {
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
