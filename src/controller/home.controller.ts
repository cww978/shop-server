import { Controller, Get, Inject, Query } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/orm'
import { Repository } from 'typeorm'
import { WxService } from '../service/wx.service'
import { WxUser } from '../entity/wx_user'

@Controller('/')
export class HomeController {
  @Inject()
  wxService: WxService

  @InjectEntityModel(WxUser)
  userModel: Repository<WxUser>

  @Get('/')
  async home(@Query() queryData): Promise<string> {
    const data = await this.wxService.check(queryData)
    return data
  }

  @Get('/test')
  async test(): Promise<any> {
    const data = await this.userModel.findOne({
      where: { openid: 'ofhN951RnXIxqx_if3m7pjeEjuSk' }
    })

    if (data) {
      return 1
    } else {
      return 2
    }
  }
}
