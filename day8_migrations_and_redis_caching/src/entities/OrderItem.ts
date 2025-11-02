import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    BeforeInsert,
    BeforeUpdate,
    AfterInsert,
    AfterUpdate,
    AfterRemove,
    Index
} from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product";

@Entity("order_items")
@Index(["orderId", "productId"])
export class OrderItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    quantity!: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    unitPrice!: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    totalPrice!: number;

    @Column({ type: "jsonb", nullable: true })
    productSnapshot?: {
        name: string;
        description: string;
        image?: string;
    };

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    // Relations
    @Column()
    orderId!: number;

    @Column()
    productId!: number;

    @ManyToOne(() => Order, order => order.orderItems, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "orderId" })
    order!: Order;

    @ManyToOne(() => Product, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: "productId" })
    product!: Product;

    // Event listeners
    @BeforeInsert()
    beforeInsert() {
        console.log(`[EVENT] Before inserting order item for order: ${this.orderId}`);
        this.totalPrice = this.quantity * this.unitPrice;
    }

    @AfterInsert()
    afterInsert() {
        console.log(`[EVENT] Order item inserted with ID: ${this.id}`);
    }

    @BeforeUpdate()
    beforeUpdate() {
        console.log(`[EVENT] Before updating order item: ${this.id}`);
        this.totalPrice = this.quantity * this.unitPrice;
    }

    @AfterUpdate()
    afterUpdate() {
        console.log(`[EVENT] Order item updated: ${this.id}`);
    }

    @AfterRemove()
    afterRemove() {
        console.log(`[EVENT] Order item removed: ${this.id}`);
    }
}