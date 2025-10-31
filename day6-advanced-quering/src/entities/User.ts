import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    OneToMany,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index
} from "typeorm";
import { UserProfile } from "./UserProfile";
import { Post } from "./Post";
import { Comment } from "./Comment";

@Entity("users")
@Index(["email","isActive"])        //CREATE INDEX "IDX_users_email_isActive" ON "users" ("email", "isActive");
export class User {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({ type: "varchar", length: 100 })
    @Index() // Single column index
    declare firstName: string;

    @Column({ type: "varchar", length: 100 })
    declare lastName: string;

    @Column({ type: "varchar", length: 200, unique: true })
    declare email: string;

    @Column({ type: "varchar", length: 50, unique: true })
    declare username: string;

    @Column({ type: "enum", enum: ["admin", "editor", "author", "reader"], default: "reader" })
    declare role: "admin" | "editor" | "author" | "reader";

    @Column({ type: "boolean", default: true })
    declare isActive: boolean;

    @Column({ type: "date", nullable: true })
    declare lastLoginDate?: Date;

    @Column({ type: "int", default: 0 })
    declare postCount: number;

    @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
    declare reputation: number;

    @CreateDateColumn()
    declare createdAt: Date;

    @UpdateDateColumn()
    declare updatedAt: Date;

    @OneToOne(() => UserProfile, (profile) => profile.user,{
        cascade: true
    })
    @JoinColumn()
    declare profile: UserProfile;

    @OneToMany(() => Post, posts => posts.author)
    declare posts: Post[]

    @OneToMany(() => Comment, (comments) => comments.author)
    declare comments: Comment[]

    
    // Computed properties
    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    get isAuthor(): boolean{
        return ["admin","editor","author"].includes(this.role);
    }

}