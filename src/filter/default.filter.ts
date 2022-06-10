import { MidwayHttpError } from '@midwayjs/core'
import { Catch } from '@midwayjs/decorator'
import { Context } from '@midwayjs/koa'

@Catch()
export class DefaultErrorFilter {
  async catch(err: MidwayHttpError, ctx: Context) {
    ctx.status = typeof err.status === 'number' ? err.status : 500
    return {
      status: typeof err.status === 'number' ? err.status : 500,
      message:
        typeof err.message !== 'undefined' ? err.message : 'unknown error'
    }
  }
}
