import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'organisations' })

export class Organisation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ unique: true })
    CAC: string;

    @Column()
    userId: number;
}
