import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    Index
} from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

@Entity("comments")
export class Comment {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({ type: "text" })
    declare content: string;

    @Column({ type: "boolean", default: true })
    declare isApproved: boolean;

    @Column({ type: "int", default: 0 })
    declare likeCount: number;

    @CreateDateColumn()
    declare createdAt: Date;

    @UpdateDateColumn()
    declare updatedAt: Date;

    // Relations
    @ManyToOne(() => User, user => user.comments, { onDelete: "CASCADE" })
    declare author: User;

    @ManyToOne(() => Post, post => post.comments, { onDelete: "CASCADE" })
    declare post: Post;
}