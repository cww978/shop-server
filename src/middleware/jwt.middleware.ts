import { Middleware } from '@midwayjs/decorator'
import { PassportMiddleware } from '@midwayjs/passport'
import { JwtStrategy } from '../strategy/jwt.strategy'
import * as passport from 'passport'
import { IMiddleware } from '@midwayjs/core'
import { NextFunction, Context } from '@midwayjs/koa'

@Middleware()
export class JwtMiddleware
  extends PassportMiddleware(JwtStrategy)
  implements IMiddleware<Context, NextFunction>
{
  getAuthenticateOptions():
    | Promise<passport.AuthenticateOptions>
    | passport.AuthenticateOptions {
    return {
      userProperty: 'user'
    }
  }

  ignore(ctx: Context): boolean {
    // 下面的路由将忽略此中间件
    return ctx.path === '/api/get_token' || ctx.path === '/api/401'
  }
}
