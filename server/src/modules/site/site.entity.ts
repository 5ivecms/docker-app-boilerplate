import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { XApiKeyEntity } from '../x-api-key/x-api-key.entity'

@Entity('site')
export class Site {
  @PrimaryGeneratedColumn({ type: 'int' })
  public id: number

  @Column({ type: 'varchar' })
  public domain: string

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date

  @OneToOne(() => XApiKeyEntity)
  @JoinColumn()
  public xApiKey: XApiKeyEntity
}
