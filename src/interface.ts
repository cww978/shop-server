/**
 * @description User-Service parameters
 */
export interface IUserOptions {
  uid: number
}

/**
 * @description wx-check parameters
 */
export interface WxCheckOption {
  signature: string
  timestamp: number
  nonce: number
  echostr: string
}

/**
 * @description wx-token
 */
export interface WxAccessTokenRes {
  access_token: string
  expires_in: number
  refresh_token: string
  openid: string
  scope: string
}

/**
 * @description wx-userinfo
 */
export interface WxUserInfoRes {
  openid: string
  sex: number
  nickname: string
  province: string
  city: string
  country: string
  headimgurl: string
}
