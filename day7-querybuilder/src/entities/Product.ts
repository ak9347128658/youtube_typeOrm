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
import { Category } from "./Category";
import { OrderItem } from "./OrderItem";
import { Review } from "./Review";

@Entity("products")
@Index(["category", "isActive"])
@Index(["price"])
export class Product {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({ type: "varchar", length: 300 })
    declare name: string;

    @Column({ type: "text" })
    declare description: string;

    @Column({ type: "varchar", length: 100, unique: true })
    declare sku: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    declare price: number;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    declare compareAtPrice?: number;

    @Column({ type: "int", default: 0 })
    declare stockQuantity: number;

    @Column({ type: "boolean", default: true })
    declare isActive: boolean;

    @Column({ type: "decimal", precision: 3, scale: 2, default: 0 })
    declare averageRating: number;

    @Column({ type: "int", default: 0 })
    declare reviewCount: number;

    @Column({ type: "int", default: 0 })
    declare salesCount: number;

    @Column({ type: "varchar", length: 100 })
    declare brand: string;

    @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
    declare weight?: number;

    @CreateDateColumn()
    declare createdAt: Date;

    @UpdateDateColumn()
    declare updatedAt: Date;

    @ManyToOne(() => Category, category => category.products)
    declare category: Category;

    @OneToMany(() => OrderItem, orderItem => orderItem.product)
    declare orderItems: OrderItem[];

    @OneToMany(() => Review, review => review.product)
    declare reviews: Review[];

    get isOnSale(): boolean {
        return this.compareAtPrice !== undefined && this.compareAtPrice !== null && this.compareAtPrice > this.price;
    }

    get discountPercentage(): number {
        if (!this.isOnSale) return 0;
        return Math.round(((this.compareAtPrice! - this.price) / this.compareAtPrice!) * 100);
    }
//  1000    800  (200 / 1000) * 100 = 20 % off
    get isInStock(): boolean {
        return this.stockQuantity > 0;
    }
}