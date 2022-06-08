import { Controller, Get, Inject, Query } from '@midwayjs/decorator'
import { WxService } from '../service/wx.service'
import { WxAccessToken } from '../entity/wx_access_token'
import { copyValueToParams } from '../utils'

@Controller('/')
export class HomeController {
  @Inject()
  wxService: WxService

  @Get('/')
  async home(@Query() queryData): Promise<string> {
    const data = await this.wxService.check(queryData)
    return data
  }

  @Get('/test')
  async test(): Promise<any> {
    const accessParam = copyValueToParams(
      {
        access_token: '123'
      },
      new WxAccessToken(),
      WxAccessToken.getKeys()
    )
    console.log(accessParam)

    return accessParam
  }
}
