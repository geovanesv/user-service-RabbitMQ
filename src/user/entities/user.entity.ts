import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'nome', length: 150 })
  nome: string;

  @Column('character varying', { name: 'email', length: 150, unique: true })
  email: string;

  @Column('character varying', { name: 'password', length: 60, select: false })
  password?: string;

  @Column('boolean', { name: 'ativo', default: () => 'true' })
  ativo: boolean;

  @Column('timestamp with time zone', { name: 'created_at', nullable: true })
  createdAt: Date;

  @Column('timestamp with time zone', { name: 'updated_at', nullable: true })
  updatedAt: Date;
}
