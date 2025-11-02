import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn,
    OneToMany,
    AfterLoad,
    BeforeInsert,
    BeforeUpdate,
    AfterInsert,
    AfterUpdate,
    AfterRemove,
    Index
} from "typeorm";


@Entity("users")
@Index(["email"], { unique: true })
@Index(["username"], { unique: true })
@Index(["isActive", "createdAt"])
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 50, unique: true })
    username!: string;

    @Column({ length: 100, unique: true })
    email!: string;

    @Column({ length: 100 })
    firstName!: string;

    @Column({ length: 100 })
    lastName!: string;

    @Column({ type: "text", nullable: true })
    bio?: string;

    @Column({ default: true })
    isActive!: boolean;

    @Column({ type: "date", nullable: true })
    dateOfBirth?: Date;

    @Column({ type: "enum", enum: ["admin", "user", "moderator"], default: "user" })
    role!: "admin" | "user" | "moderator";

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    balance!: number;

    @Column({ type: "jsonb", nullable: true })
    preferences?: {
        theme?: string;
        notifications?: boolean;
        language?: string;
    };

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    // Relations
    @OneToMany("Post", "author", { cascade: true })
    posts!: any[];

    @OneToMany("Order", "customer", { cascade: true })
    orders!: any[];

    // Virtual property for full name
    fullName?: string;

    // Event listeners for caching
    @AfterLoad()
    setComputed() {
        this.fullName = `${this.firstName} ${this.lastName}`;
    }

    @BeforeInsert()
    beforeInsert() {
        console.log(`[EVENT] Before inserting user: ${this.email}`);
        this.email = this.email.toLowerCase();
    }

    @AfterInsert()
    afterInsert() {
        console.log(`[EVENT] User inserted with ID: ${this.id}`);
    }

    @BeforeUpdate()
    beforeUpdate() {
        console.log(`[EVENT] Before updating user: ${this.id}`);
        this.email = this.email.toLowerCase();
    }

    @AfterUpdate()
    afterUpdate() {
        console.log(`[EVENT] User updated: ${this.id}`);
    }

    @AfterRemove()
    afterRemove() {
        console.log(`[EVENT] User removed: ${this.id}`);
    }
}

// user.email = "HELLO@MAIL.COM";
// await userRepository.save(user);

// // Console:
// // [EVENT] Before updating user: 5
