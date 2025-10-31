import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import { Role } from "./Role";

@Entity("users")
export class User {

    @PrimaryGeneratedColumn()    
    declare id: number;

    @Column({  length: 100 })
    declare firstName: string;

    @Column({  length: 100 })
    declare lastName: string;

    @Column({  length: 200, unique: true })
    declare email: string;

    @Column({ length: 50 })
    declare username: string;

    @Column({ default: true })
    declare isActive: boolean;

    @CreateDateColumn()
    declare createdAt: Date;

    @UpdateDateColumn()
    declare updatedAt: Date;

    @ManyToMany(() => Role, (roles) => roles.users, {
        cascade: true,  // allow saving roles when saving user
        eager: false    //
    })
    @JoinTable({
       name: "user_roles",
       joinColumn: {
         name: "user_id",
         referencedColumnName: "id"
       },
       inverseJoinColumn: {
         name: "role_id",
         referencedColumnName:"id"
       } 
    })
    declare roles: Role[];
}


// new User().find(id = 1);

// user = {
//     ..,
//     roles: [
//         "admin","lead","agent"
//     ]
// }

// eager = false
// user = {
//     ..,
//     roles: null
// }