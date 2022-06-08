import { Controller, Get, Inject, Query } from '@midwayjs/decorator'
import { WxService } from '../service/wx.service'

@Controller('/wx')
export class HomeController {
  @Inject()
  wxService: WxService

  @Get('/get_access_token')
  async getAccessToken(@Query('code') code: string): Promise<string> {
    const data = await this.wxService.getWxUserAccessToken(code)
    return data
  }
}
