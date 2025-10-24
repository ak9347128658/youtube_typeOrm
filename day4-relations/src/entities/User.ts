import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from "typeorm"
import { Profile } from "./Profile";
import { Post } from "./Post";

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

    @Column({  default: true })
    declare isActive: boolean;

    @CreateDateColumn()
    declare createdAt: Date;

    @UpdateDateColumn()
    declare updatedAt: Date;

    @OneToOne(()=> Profile,(profile)=> profile.user, {
        cascade: true,
        eager: false,
    })
    @JoinColumn()
    declare profile: Profile

    @OneToMany(() => Post, (post) => post.author,{
        cascade: true
    })
    declare posts: Post[]
    
    get fullName(): string {
        return `${this.firstName} ${this.lastName}`
    }

    get postCount(): number {
        return this.posts ? this.posts.length : 0;
    }
}