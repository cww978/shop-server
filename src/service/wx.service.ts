import { Provide, App } from '@midwayjs/decorator'
import { Application } from '@midwayjs/koa'
import { WxCheckOption } from '../interface'
import { sha1 } from '../utils/index'
import axios from 'axios'

@Provide()
export class WxService {
  @App()
  app: Application

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

  async getWxUserAccessToken(code: string) {
    const { appid, appsecret } = this.app.getConfig('wx')

    const { data } = await axios.get(
      `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${appsecret}&code=${code}&grant_type=authorization_code`
    )
    console.log(data)

    return data
  }
}
