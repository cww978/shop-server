import { Controller, Get, Inject, Query } from '@midwayjs/decorator'
import { Context } from '@midwayjs/koa'

import { WxService } from '../service/wx.service'
import { AuthService } from '../service/auth.service'

@Controller('/')
export class HomeController {
  @Inject()
  wxService: WxService

  @Inject()
  authService: AuthService

  @Inject()
  ctx: Context

  @Get('/')
  async home(@Query() queryData): Promise<string> {
    const data = await this.wxService.check(queryData)
    return data
  }

  @Get('/test')
  async test(): Promise<any> {
    return 'Hello'
  }

  @Get('/get_token')
  async token(): Promise<any> {
    const token = await this.authService.createToken(
      'ofhN951RnXIxqx_if3m7pjeEjuSk',
      'Caowenw'
    )
    return token
  }
}
