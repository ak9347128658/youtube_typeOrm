import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    Index
} from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";

@Entity("posts")
@Index(["isPublished", "publishedAt"]) // CREATE INDEX "IDX_posts_isPublished_publishedAt" ON "posts" ("isPublished", "publishedAt");
@Index(["author", "createdAt"]) // CREATE INDEX "IDX_posts_author_createdAt" ON "posts" ("authorId", "createdAt");
export class Post {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({ type: "varchar", length: 300 })
    declare title: string;

    @Column({ type: "varchar", length: 500, unique: true })
    @Index() // For SEO-friendly URLs
    declare slug: string;

    @Column({ type: "text" })
    declare content: string;

    @Column({ type: "varchar", length: 500, nullable: true })
    declare excerpt?: string;

    @Column({ type: "varchar", length: 100 })
    @Index() // Category queries are common
    declare category: string;

    @Column({ type: "text", array: true, default: [] })
    declare tags: string[];

    @Column({ type: "boolean", default: false })
    declare isPublished: boolean;

    @Column({ type: "boolean", default: false })
    declare isFeatured: boolean;

    @Column({ type: "int", default: 0 })
    declare viewCount: number;

    @Column({ type: "int", default: 0 })
    declare likeCount: number;

    @Column({ type: "int", default: 0 })
    declare commentCount: number;

    @Column({ type: "decimal", precision: 3, scale: 2, default: 0 })
    declare rating: number;

    @Column({ type: "timestamp", nullable: true })
    declare publishedAt?: Date;

    @CreateDateColumn()
    declare createdAt: Date;

    @UpdateDateColumn()
    declare updatedAt: Date;

    // Relations
    @ManyToOne(() => User, user => user.posts, { onDelete: "CASCADE" })
    declare author: User;

    @OneToMany(() => Comment, (comment) => comment.post)
    declare comments: Comment[];

    // Computed properties
    get wordCount(): number {
        return this.content.split(/\s+/).length;
    }
    
 
    get readingTime(): number {
        return Math.ceil(this.wordCount / 200); // 200 words per minute
    }   

    get isPopular(): boolean {
        return this.viewCount > 1000 || this.likeCount > 100;
    }    
}
