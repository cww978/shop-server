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
