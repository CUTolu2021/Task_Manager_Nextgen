import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { User } from '../../users/entities/user.entity';


@Entity({name: 'comments'})
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    comment: string;

    @ManyToOne(() => Task, (task) => task.comments)
    task: Task

    @ManyToOne(() => User, (user) => user.comments)
    user: User;
}
