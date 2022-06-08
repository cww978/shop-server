import { EntityModel } from '@midwayjs/orm'
import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

@EntityModel('wx_access_token')
export class WxAccessToken {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 28
  })
  openid: string

  @Column()
  access_token: string

  @Column()
  refresh_token: string

  @Column()
  expires_in: number

  @CreateDateColumn()
  create_time: Date

  @UpdateDateColumn()
  update_time: Date

  static getKeys() {
    return ['openid', 'access_token', 'refresh_token', 'expires_in']
  }
}
