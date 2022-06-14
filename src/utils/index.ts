import { createHash } from 'crypto'

/**
 * 获取sha
 * @param str
 * @returns
 */
export function sha1(str: string) {
  const shasum = createHash('sha1')
  shasum.update(str)
  str = shasum.digest('hex')
  return str
}

/**
 * 根据keys拷贝数据到目标对象
 * @param data
 * @param target
 * @param keys
 * @returns
 */
export function copyValueToParams<T>(
  data: any,
  target: T,
  keys: Array<string>
) {
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      target[key] = data[key]
    }
  }
  return target
}

/**
 * 获取过期时间 传入 expires 秒
 * @param expires
 * @returns
 */
export function getExpiresTime(expires: number) {
  return Date.now().valueOf() + expires * 1000
}
