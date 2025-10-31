import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne,
    CreateDateColumn,
    Index,
    Unique
} from "typeorm";
import { User } from "./User";
import { Product } from "./Product";

@Entity("reviews")
@Unique(["user", "product"]) // One review per user per product
@Index(["product", "rating"])
export class Review {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({ type: "int" })
    declare rating: number;

    @Column({ type: "text" })
    declare comment: string;

    @Column({ type: "boolean", default: true })
    declare isVerified: boolean;

    @Column({ type: "int", default: 0 })
    declare helpfulCount: number;

    @CreateDateColumn()
    declare createdAt: Date;

    @ManyToOne(() => User, user => user.reviews)
    declare user: User;

    @ManyToOne(() => Product, product => product.reviews)
    declare product: Product;
}