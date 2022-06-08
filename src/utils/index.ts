import { createHash } from 'crypto'

export function sha1(str: string) {
  const shasum = createHash('sha1')
  shasum.update(str)
  str = shasum.digest('hex')
  return str
}
