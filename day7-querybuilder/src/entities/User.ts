import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    Index
} from "typeorm";
import { Order } from "./Order";
import { Review } from "./Review";

@Entity("users")
@Index(["email", "isActive"])
export class User {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({ type: "varchar", length: 100 })
    declare firstName: string;

    @Column({ type: "varchar", length: 100 })
    declare lastName: string;

    @Column({ type: "varchar", length: 200, unique: true })
    declare email: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    declare city: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    declare country: string;

    @Column({ type: "date", nullable: true })
    declare birthDate?: Date;

    @Column({ type: "boolean", default: true })
    declare isActive: boolean;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    declare totalSpent: number;

    @CreateDateColumn()
    declare createdAt: Date;

    @UpdateDateColumn()
    declare updatedAt: Date;

    @OneToMany(() => Order, order => order.customer)
    declare orders: Order[];

    @OneToMany(() => Review, review => review.user)
    declare reviews: Review[];

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    get age(): number | null {
        if (!this.birthDate) return null;
        const today = new Date();
        const birth = new Date(this.birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }
}