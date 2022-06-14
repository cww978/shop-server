import { MidwayConfig } from '@midwayjs/core'

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1654500690008_5056',
  wx: {
    appid: 'wx0455b0286bde8a25',
    appsecret: '3ff3f81bfa5966b505cae82b16063011'
  },
  orm: {
    type: 'mysql',
    host: '43.156.38.80',
    port: 3306,
    username: 'root',
    password: 'chuyin978',
    database: 'wx-platform',
    synchronize: false,
    logging: true
  },
  redis: {
    client: {
      port: 6379,
      host: '43.156.38.80',
      password: '123456',
      db: 0
    }
  },
  jwt: {
    secret: '3afa41js',
    expiresIn: '2d'
  },
  koa: {
    port: 80
  }
} as MidwayConfig
