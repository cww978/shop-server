import { Catch } from '@midwayjs/decorator'
import { httpError } from '@midwayjs/core'
import { Context } from '@midwayjs/koa'
import { UnauthorizedError } from '@midwayjs/core/dist/error/http'

@Catch(httpError.UnauthorizedError)
export class UnauthorizedErrorFilter {
  async catch(error: UnauthorizedError, ctx: Context) {
    ctx.status = error.status
    return {
      code: error.code,
      message: error.message
    }
  }
}
