import { MidwayHttpError } from '@midwayjs/core'
import { Catch } from '@midwayjs/decorator'
import { Context } from '@midwayjs/koa'

@Catch()
export class DefaultErrorFilter {
  async catch(err: MidwayHttpError, ctx: Context) {
    ctx.status = err.status
    return {
      status: err.status,
      message: err.message
    }
  }
}
