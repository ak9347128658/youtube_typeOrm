import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
    AfterLoad,
    BeforeInsert,
    BeforeUpdate,
    AfterInsert,
    AfterUpdate,
    AfterRemove,
    Index
} from "typeorm";
import { OrderItem } from "./OrderItem";
import { Category } from "./Category";

@Entity("products")
@Index(["name"])
@Index(["sku"], { unique: true })
@Index(["isActive", "categoryId"])
@Index(["price", "isActive"])
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 200 })
    name!: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @Column({ length: 100, unique: true })
    sku!: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    price!: number;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    compareAtPrice?: number;

    @Column({ type: "int", default: 0 })
    stockQuantity!: number;

    @Column({ default: true })
    isActive!: boolean;

    @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
    weight?: number;

    @Column({ type: "jsonb", nullable: true })
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };

    @Column({ type: "jsonb", nullable: true })
    images?: string[];

    @Column({ type: "jsonb", nullable: true })
    tags?: string[];

    @Column({ type: "jsonb", nullable: true })
    attributes?: {
        color?: string;
        size?: string;
        material?: string;
        [key: string]: any;
    };

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    // Relations
    @Column({ nullable: true })
    categoryId?: number;

    @ManyToOne(() => Category, { onDelete: 'SET NULL' })
    @JoinColumn({ name: "categoryId" })
    category?: Category;

    @OneToMany(() => OrderItem, orderItem => orderItem.product)
    orderItems!: OrderItem[];

    // Virtual properties
    isOnSale?: boolean;
    discountPercentage?: number;
    isInStock?: boolean;

    // Event listeners
    @AfterLoad()
    setComputed() {
        this.isOnSale = !!(this.compareAtPrice && this.compareAtPrice > this.price);
        if (this.isOnSale && this.compareAtPrice) {
            this.discountPercentage = Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
        }
        this.isInStock = this.stockQuantity > 0;
    }

    @BeforeInsert()
    beforeInsert() {
        console.log(`[EVENT] Before inserting product: ${this.name}`);
        if (!this.sku) {
            this.sku = this.generateSKU();
        }
    }

    @AfterInsert()
    afterInsert() {
        console.log(`[EVENT] Product inserted with ID: ${this.id}`);
    }

    @BeforeUpdate()
    beforeUpdate() {
        console.log(`[EVENT] Before updating product: ${this.id}`);
        if (this.stockQuantity <= 0) {
            console.log(`[WARNING] Product ${this.name} is out of stock`);
        }
    }

    @AfterUpdate()
    afterUpdate() {
        console.log(`[EVENT] Product updated: ${this.id}`);
    }

    @AfterRemove()
    afterRemove() {
        console.log(`[EVENT] Product removed: ${this.id}`);
    }

    private generateSKU(): string {
        const prefix = this.name.substring(0, 3).toUpperCase();
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        return `${prefix}-${timestamp}-${random}`;
    }
}