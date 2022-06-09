import { Controller, Get, Inject, Query } from '@midwayjs/decorator'
import { Context } from '@midwayjs/koa'
import { InjectEntityModel } from '@midwayjs/orm'
import { Repository } from 'typeorm'
import { WxService } from '../service/wx.service'
import { WxAccessToken } from '../entity/wx_access_token'

@Controller('/')
export class HomeController {
  @Inject()
  wxService: WxService

  @Inject()
  ctx: Context

  @InjectEntityModel(WxAccessToken)
  accessTokenModel: Repository<WxAccessToken>

  @Get('/')
  async home(@Query() queryData): Promise<string> {
    const data = await this.wxService.check(queryData)
    return data
  }

  @Get('/test')
  async test(): Promise<any> {
    return 'Hello'
  }
}
