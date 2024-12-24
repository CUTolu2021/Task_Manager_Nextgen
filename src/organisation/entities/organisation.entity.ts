import { Task } from 'src/tasks/entities/task.entity';
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

    @OneToMany(() => Task, (task) => task.organisation)
    tasks: Task[];  

    @OneToMany(() => User, (user) => user.organisation)
    users: User[];

    @Column({ default: 'active' })
    status: string

    @Column({ default: false })
    approved: boolean;
    
}
