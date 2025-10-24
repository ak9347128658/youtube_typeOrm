import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import { User } from "./User";


@Entity("posts")
export class Post {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({ length: 300 })
    declare title: string;

    @Column({ type: "text" })
    declare content: string;

    @Column({ length: 500, nullable: true })
    declare excerpt?: string;

    @Column({ type: "boolean", default: false })
    declare isPublished: boolean;

    @Column({ type: "int", default: 0 })
    declare viewCount: number;

    @Column({ type: "text", array: true, default: [] })
    declare tags: string[];

    @CreateDateColumn()
    declare createdAt: Date;

    @UpdateDateColumn()
    declare updatedAt: Date;

    @Column({ type: "timestamp", nullable: true })
    declare publishedAt?: Date;

    // Many posts belong to one user
    @ManyToOne(() => User, (user) => user.posts, {
        onDelete: "CASCADE"
    })
    declare author: User;

    // computed properties
    get wordCount(): number {
        return this.content.split(/\s+/).length
    }

    get readingTime(): number {
        // Assuming 200 words per minute reading speed
        return Math.ceil(this.wordCount / 200)
    }
}

// "Hello   world  how are you".split(/\s+/)
// ["Hello", "world", "how", "are", "you"]

// this.wordCount = 420;

// this.wordCount / 200 = 2.1
// Math.ceil(2.1) = 3
