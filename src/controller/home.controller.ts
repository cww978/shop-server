import { Controller, Get, Inject, Query } from '@midwayjs/decorator'
import { WxService } from '../service/wx.service'

@Controller('/')
export class HomeController {
  @Inject()
  wxService: WxService

  @Get('/')
  async home(@Query() queryData): Promise<string> {
    const data = await this.wxService.check(queryData)
    return data
  }
}
