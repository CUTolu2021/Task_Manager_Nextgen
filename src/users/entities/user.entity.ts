import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Organisation } from 'src/organisation/entities/organisation.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Comment } from 'src/comments/entities/comment.entity';
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

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @ManyToOne(() => Organisation, (organisation) => organisation.users, {
    nullable: true,
  })
  organisation?: Organisation | null;
  
  @OneToMany(() => Task, (task) => task.assignedBy)
  tasksAssigned: Task[];

  @OneToMany(() => Task, (task) => task.assignedTo)
  tasksReceived: Task[];

  @Column({ default: 'active' })
  status: string;
}
