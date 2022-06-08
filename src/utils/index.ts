import { createHash } from 'crypto'

export function sha1(str: string) {
  const shasum = createHash('sha1')
  shasum.update(str)
  str = shasum.digest('hex')
  return str
}

export function copyValueToParams<T>(data: any, target: T) {
  for (const key in target) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      target[key] = data[key]
    }
  }
  return target
}
