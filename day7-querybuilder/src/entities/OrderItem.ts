import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne,
    Index,
    Unique
} from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product";

@Entity("order_items")
@Unique(["order", "product"])
@Index(["product"])
export class OrderItem {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({ type: "int" })
    declare quantity: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    declare unitPrice: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    declare totalPrice: number;

    @ManyToOne(() => Order, order => order.items, { onDelete: "CASCADE" })
    declare order: Order;

    @ManyToOne(() => Product, product => product.orderItems)
    declare product: Product;
}

// | id | order_id | product_id | quantity |                                    |
// | -- | -------- | ---------- | -------- | ---------------------------------- |
// | 1  | 10       | 5          | 2        |                                    |
// | 2  | 10       | 5          | 3        | ❌ duplicate product in same order! |
