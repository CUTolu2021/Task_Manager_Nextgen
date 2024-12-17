import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Organisation } from 'src/organisation/entities/organisation.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' }) // user, admin, super-admin, sub-admin
  role: string;

  @Column({ default: 'individual' }) // individual or organisation
  type: string;

  @ManyToOne(() => Organisation, (organisation) => organisation.users, {
    nullable: true,
  })
  //@JoinColumn()
  organisation?: Organisation | null; // Null for type: individual
}
