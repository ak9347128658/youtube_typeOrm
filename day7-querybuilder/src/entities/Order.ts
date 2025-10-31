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
import { OrderItem } from "./OrderItem";

@Entity("orders")
@Index(["customer", "createdAt"])
@Index(["status", "createdAt"])
export class Order {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({ type: "varchar", length: 20, unique: true })
    declare orderNumber: string;

    @Column({ 
        type: "enum", 
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending"
    })
    declare status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";

    @Column({ type: "decimal", precision: 10, scale: 2 })
    declare totalAmount: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    declare shippingCost: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    declare taxAmount: number;

    @Column({ type: "varchar", length: 200 })
    declare shippingAddress: string;

    @Column({ type: "varchar", length: 100 })
    declare shippingCity: string;

    @Column({ type: "varchar", length: 50 })
    declare shippingCountry: string;

    @Column({ type: "timestamp", nullable: true })
    declare shippedAt?: Date;

    @Column({ type: "timestamp", nullable: true })
    declare deliveredAt?: Date;

    @CreateDateColumn()
    declare createdAt: Date;

    @UpdateDateColumn()
    declare updatedAt: Date;

    @ManyToOne(() => User, user => user.orders)
    declare customer: User;

    @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
    declare items: OrderItem[];

    get itemCount(): number {
        return this.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    }

    get subtotal(): number {
        return this.totalAmount - this.shippingCost - this.taxAmount;
    }
}