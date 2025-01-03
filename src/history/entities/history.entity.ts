import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BeforeUpdate } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { User } from '../../users/entities/user.entity';

export enum HistoryAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  COMPLETED = 'COMPLETED',
  // add more actions as needed
}

@Entity({name: 'history'})
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: HistoryAction,
  })
  action: HistoryAction;

  @ManyToOne(() => Task, (task) => task.id)
  task: Task;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column()
  createdAt: Date;

}