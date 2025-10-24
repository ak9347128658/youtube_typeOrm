import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    OneToOne,
    CreateDateColumn,
    UpdateDateColumn 
} from "typeorm";
import { User } from "./User";

@Entity("profiles")
export class Profile{
     @PrimaryGeneratedColumn()
    declare id: number;

    @Column({ type: "text", nullable: true })
    declare bio?: string;

    @Column({  length: 200, nullable: true })
    declare website?: string;

    @Column({  length: 20, nullable: true })
    declare phone?: string;

    @Column({ type: "date", nullable: true })
    declare dateOfBirth?: Date;

    @Column({  length: 100, nullable: true })
    declare occupation?: string;   

    @Column({type: 'json', nullable: true})
    socialLinks?: {
        twitter?: string;
        linkedin?: string;
        github?: string;
    }

    @Column({ length: 500, nullable: true })
    declare avatarUrl?: string;

    @CreateDateColumn()
    declare createdAt: Date;

    @UpdateDateColumn()
    declare updatedAt: Date;    

    @OneToOne(() => User, (user) => user.profile, {
        onDelete: 'CASCADE'
    })
    declare user: User
}