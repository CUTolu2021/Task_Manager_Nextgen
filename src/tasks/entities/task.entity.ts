import { Comment } from 'src/comments/entities/comment.entity';
import { Organisation } from 'src/organisation/entities/organisation.entity';
import { User } from 'src/users/entities/user.entity';

import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, Or } from 'typeorm';


export enum taskStatus {
  NOT_COMPLETED='NOT_COMPLETED',
    IN_PROGRESS='IN_PROGRESS',
    COMPLETED='COMPLETED'
 
}

export enum taskPriority {
  LOW= 'LOW',
  MEDIUM= 'MEDIUM',
  HIGH='HIGH'
}
@Entity({name: "tasks"})
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    taskName: string;

    @Column()
    taskDescription: string;

    @Column({ default: taskStatus.IN_PROGRESS })
    status: taskStatus;

    @Column({ default: taskPriority.LOW })
    priority: taskPriority;

    @OneToMany(() => Comment, (comment) => comment.task)
    comments: Comment[]

    @ManyToOne(()=> Organisation, (organisation) => organisation.tasks, 
    {nullable: true})
    organisation?: Organisation | null

    @ManyToOne(() => User, (user) => user.tasksAssigned)
    assignedBy: User;
  
    @ManyToOne(() => User, (user) => user.tasksReceived)
    assignedTo: User;

    @Column()
    dueDate: Date; 
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;


}
