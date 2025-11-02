import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    AfterLoad,
    BeforeInsert,
    BeforeUpdate,
    AfterInsert,
    AfterUpdate,
    AfterRemove,
    Index
} from "typeorm";
import { User } from "./User";

@Entity("posts")
@Index(["title"])
@Index(["status", "createdAt"])
@Index(["authorId", "isPublished"])
export class Post {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 200 })
    title!: string;

    @Column({ type: "text" })
    content!: string;

    @Column({ type: "text", nullable: true })
    excerpt?: string;

    @Column({ length: 200, unique: true })
    slug!: string;

    @Column({ default: false })
    isPublished!: boolean;

    @Column({ type: "enum", enum: ["draft", "published", "archived"], default: "draft" })
    status!: "draft" | "published" | "archived";

    @Column({ type: "int", default: 0 })
    viewCount!: number;

    @Column({ type: "int", default: 0 })
    likeCount!: number;

    @Column({ type: "jsonb", nullable: true })
    tags?: string[];

    @Column({ type: "jsonb", nullable: true })
    metadata?: {
        seoTitle?: string;
        seoDescription?: string;
        featuredImageUrl?: string;
    };

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ type: "timestamp", nullable: true })
    publishedAt?: Date;

    // Relations
    @Column()
    authorId!: number;

    @ManyToOne(() => User, user => user.posts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "authorId" })
    author!: User;

    // Virtual properties
    readingTime?: number;
    isRecent?: boolean;

    // Event listeners
    @AfterLoad()
    setComputed() {
        // Calculate reading time (average 200 words per minute)
        const wordCount = this.content.split(' ').length;
        this.readingTime = Math.ceil(wordCount / 200);
        
        // Check if post is recent (within last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        this.isRecent = this.createdAt > sevenDaysAgo;
    }

    @BeforeInsert()
    beforeInsert() {
        console.log(`[EVENT] Before inserting post: ${this.title}`);
        this.slug = this.generateSlug(this.title);
        this.excerpt = this.excerpt || this.generateExcerpt();
    }

    @AfterInsert()
    afterInsert() {
        console.log(`[EVENT] Post inserted with ID: ${this.id}`);
    }

    @BeforeUpdate()
    beforeUpdate() {
        console.log(`[EVENT] Before updating post: ${this.id}`);
        if (this.isPublished && !this.publishedAt) {
            this.publishedAt = new Date();
            this.status = "published";
        }
    }

    @AfterUpdate()
    afterUpdate() {
        console.log(`[EVENT] Post updated: ${this.id}`);
    }

    @AfterRemove()
    afterRemove() {
        console.log(`[EVENT] Post removed: ${this.id}`);
    }

    private generateSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            + '-' + Date.now();
    }

    private generateExcerpt(): string {
        return this.content.substring(0, 150) + (this.content.length > 150 ? '...' : '');
    }
}