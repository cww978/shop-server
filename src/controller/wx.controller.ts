import { Controller, Get, Inject, Query } from '@midwayjs/decorator'
import { WxService } from '../service/wx.service'

@Controller('/wx')
export class HomeController {
  @Inject()
  wxService: WxService

  @Get('/login')
  async login(@Query('code') code: string): Promise<any> {
    const data = await this.wxService.wxLogin(code)
    return {
      code: data ? 0 : -1,
      data,
      message: 'success'
    }
  }
}
