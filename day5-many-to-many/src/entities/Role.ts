import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    CreateDateColumn
} from "typeorm";
import { User } from "./User";


@Entity("roles")
export class Role {

    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({ length: 50, unique: true })
    declare name: string;

    @Column({ type: "text", nullable: true })
    declare description?: string;                //65,535 bytes (~64 KB), LONGTEXT 4,294,967,295 bytes (~4 GB), 16,777,215 bytes (~16 MB): MEDIUMTEXT

    @Column({ type: "text", array: true, default: [] })
    declare permissions: string[];  // ['CREATE_USER', 'DELETE_USER', 'UPDATE_USER']

    @Column({ default: true })
    declare isActive: boolean;

    @CreateDateColumn()
    declare createdAt: Date;

    @ManyToMany(() => User, (user) => user.roles)
    declare users: User[];

}