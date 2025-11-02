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
import { OrderItem } from "./OrderItem";

@Entity("orders")
@Index(["status", "createdAt"])
@Index(["customerId", "createdAt"])
@Index(["orderNumber"], { unique: true })
export class Order {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 50, unique: true })
    orderNumber!: string;

    @Column({ type: "enum", enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending" })
    status!: "pending" | "processing" | "shipped" | "delivered" | "cancelled";

    @Column({ type: "decimal", precision: 10, scale: 2 })
    totalAmount!: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    taxAmount!: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    shippingAmount!: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    discountAmount!: number;

    @Column({ type: "jsonb", nullable: true })
    shippingAddress?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };

    @Column({ type: "jsonb", nullable: true })
    billingAddress?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };

    @Column({ type: "text", nullable: true })
    notes?: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ type: "timestamp", nullable: true })
    shippedAt?: Date;

    @Column({ type: "timestamp", nullable: true })
    deliveredAt?: Date;

    // Relations
    @Column()
    customerId!: number;

    @ManyToOne(() => User, user => user.orders, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "customerId" })
    customer!: User;

    @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
    orderItems!: OrderItem[];

    // Virtual properties
    itemCount?: number;
    subtotal?: number;

    // Event listeners
    @AfterLoad()
    setComputed() {
        if (this.orderItems) {
            this.itemCount = this.orderItems.length;
            this.subtotal = this.orderItems.reduce((sum, item) => 
                sum + (item.quantity * item.unitPrice), 0
            );
        }
    }

    @BeforeInsert()
    beforeInsert() {
        console.log(`[EVENT] Before inserting order: ${this.orderNumber}`);
        if (!this.orderNumber) {
            this.orderNumber = this.generateOrderNumber();
        }
    }

    @AfterInsert()
    afterInsert() {
        console.log(`[EVENT] Order inserted with ID: ${this.id}`);
    }

    @BeforeUpdate()
    beforeUpdate() {
        console.log(`[EVENT] Before updating order: ${this.id}`);
        if (this.status === 'shipped' && !this.shippedAt) {
            this.shippedAt = new Date();
        }
        if (this.status === 'delivered' && !this.deliveredAt) {
            this.deliveredAt = new Date();
        }
    }

    @AfterUpdate()
    afterUpdate() {
        console.log(`[EVENT] Order updated: ${this.id}`);
    }

    @AfterRemove()
    afterRemove() {
        console.log(`[EVENT] Order removed: ${this.id}`);
    }

    private generateOrderNumber(): string {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `ORD-${timestamp}-${random}`;
    }
}