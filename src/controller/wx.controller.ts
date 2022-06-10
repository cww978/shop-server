import { Controller, Get, Inject, Query } from '@midwayjs/decorator'
import { WxService } from '../service/wx.service'
import { Context } from '@midwayjs/koa'

@Controller('/wx')
export class HomeController {
  @Inject()
  wxService: WxService

  @Inject()
  ctx: Context

  @Get('/login')
  async login(@Query('code') code: string): Promise<any> {
    const data = await this.wxService.wxLogin(code)
    return {
      code: data ? 0 : -1,
      data,
      message: 'success'
    }
  }

  @Get('/get_user')
  async getUserInfo(): Promise<any> {
    const data = await this.wxService.getUserInfo(this.ctx.state.user.userid)
    return {
      code: data ? 0 : -1,
      data,
      message: 'success'
    }
  }
}
