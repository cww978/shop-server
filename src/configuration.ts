import { Configuration, App } from '@midwayjs/decorator'
import * as koa from '@midwayjs/koa'
import * as validate from '@midwayjs/validate'
import * as orm from '@midwayjs/orm'
import * as info from '@midwayjs/info'
import * as jwt from '@midwayjs/jwt'
import { join } from 'path'
// import { DefaultErrorFilter } from './filter/default.filter';
// import { NotFoundFilter } from './filter/notfound.filter';
import { JwtMiddleware } from './middleware/jwt.middleware'
import { DefaultErrorFilter } from './filter/default.filter'
@Configuration({
  imports: [
    koa,
    validate,
    orm,
    jwt,
    {
      component: info,
      enabledEnvironment: ['local']
    }
  ],
  importConfigs: [join(__dirname, './config')]
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application

  async onReady() {
    // add middleware
    this.app.useMiddleware([JwtMiddleware])
    // add filter
    this.app.useFilter([DefaultErrorFilter])
  }
}
