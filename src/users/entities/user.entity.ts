import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
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
  organisation?: Organisation | null; // Null for type: individual

  // This line is like a map that shows how to find the organisation that a user belongs to.
  // It's like a direction that says "Hey, to find the organisation that this user belongs to, go to the organisation table and find the row that has the same id as the user's organisationId".
  // The @JoinColumn() is like a label that says "Hey, I'm the direction to the organisation table!"
  
  @OneToMany(() => Task, (task) => task.assignedBy)
  tasksAssigned: Task[];

  @OneToMany(() => Task, (task) => task.assignedTo)
  tasksReceived: Task[];

  @Column({ default: 'active' })
  status: string;
}