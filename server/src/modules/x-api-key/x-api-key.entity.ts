import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('xApiKey')
export class XApiKeyEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  public readonly id: number

  @Column({ type: 'varchar' })
  public readonly apiKey: string

  @Column({ type: 'text', default: '' })
  public readonly comment: string

  @Column({ type: 'text', default: '' })
  public readonly test: string

  @CreateDateColumn({ type: 'timestamptz' })
  public readonly createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  public readonly updatedAt: Date
}
