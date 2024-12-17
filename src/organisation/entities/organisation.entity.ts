import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'organisations' })
export class Organisation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  CAC: string;

  /* @Column()
  userId: number; */

  @OneToMany(() => User, (user) => user.organisation)
  users: User[];
}
