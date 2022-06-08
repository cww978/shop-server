import { EntityModel } from '@midwayjs/orm'
import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

@EntityModel('wx_user')
export class WxUser {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 28
  })
  openid: string

  @Column({
    length: 100
  })
  nickname: string

  @Column()
  headimgurl: string

  @Column({
    length: 50
  })
  mobile: string

  @Column()
  sex: number

  @Column({
    length: 100
  })
  country: string

  @Column({
    length: 100
  })
  province: string

  @Column({
    length: 100
  })
  city: string

  @Column({
    length: 100
  })
  language: string

  @CreateDateColumn()
  create_time: Date

  @UpdateDateColumn()
  update_time: Date

  static getKeys() {
    return [
      'openid',
      'nickname',
      'headimgurl',
      'mobile',
      'sex',
      'country',
      'province',
      'city',
      'language'
    ]
  }
}
