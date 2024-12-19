import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BeforeUpdate } from 'typeorm';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';

export enum HistoryAction {
  CREATED,
  UPDATED,
  COMPLETED,
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

// @BeforeUpdate('task')
// async updateHistory(action: HistoryAction, task: Task, user: User) {
//   const history = new History();
//   history.action = action;
//   history.task = task;
//   history.performer = user;
//   history.createdAt = new Date();
//   await history.save();
//}