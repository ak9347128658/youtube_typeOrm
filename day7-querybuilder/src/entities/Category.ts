import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Product } from "./Product";

@Entity("categories")
export class Category {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({ type: "varchar", length: 100, unique: true })
    declare name: string;

    @Column({ type: "text", nullable: true })
    declare description?: string;

    @Column({ type: "varchar", length: 200, unique: true })
    declare slug: string;

    @Column({ type: "boolean", default: true })
    declare isActive: boolean;

    @OneToMany(() => Product, product => product.category)
    declare products: Product[];
}