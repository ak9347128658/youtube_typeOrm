import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
    Tree,
    TreeChildren,
    TreeParent,
    BeforeInsert,
    BeforeUpdate,
    AfterInsert,
    AfterUpdate,
    AfterRemove,
    Index
} from "typeorm";
import { Product } from "./Product";

@Entity("categories")
@Tree("nested-set")
@Index(["slug"], { unique: true })
export class Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    name!: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @Column({ length: 150, unique: true })
    slug!: string;

    @Column({ default: true })
    isActive!: boolean;

    @Column({ type: "int", default: 0 })
    sortOrder!: number;

    @Column({ type: "text", nullable: true })
    imageUrl?: string;

    @Column({ type: "jsonb", nullable: true })
    metadata?: {
        seoTitle?: string;
        seoDescription?: string;
        keywords?: string[];
    };

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    // Tree relations
    @TreeChildren()
    children!: Category[];

    @TreeParent()
    parent?: Category;

    // Product relation
    @OneToMany(() => Product, product => product.category)
    products!: Product[];

    // Event listeners
    @BeforeInsert()
    beforeInsert() {
        console.log(`[EVENT] Before inserting category: ${this.name}`);
        if (!this.slug) {
            this.slug = this.generateSlug(this.name);
        }
    }

    @AfterInsert()
    afterInsert() {
        console.log(`[EVENT] Category inserted with ID: ${this.id}`);
    }

    @BeforeUpdate()
    beforeUpdate() {
        console.log(`[EVENT] Before updating category: ${this.id}`);
    }

    @AfterUpdate()
    afterUpdate() {
        console.log(`[EVENT] Category updated: ${this.id}`);
    }

    @AfterRemove()
    afterRemove() {
        console.log(`[EVENT] Category removed: ${this.id}`);
    }

    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }
}

// Electronics
//  ├── Mobiles
//  │     ├── Android
//  │     └── iPhone
//  └── Laptops
//        ├── Gaming
//        └── Business

// | id | name        | parentId |
// | -- | ----------- | -------- |
// | 1  | Electronics | NULL     |
// | 2  | Mobiles     | 1        |
// | 3  | Laptops     | 1        |
// | 4  | Android     | 2        |

// const tree = await categoryRepository.findTrees();

// [
//   {
//     "id": 1,
//     "name": "Electronics",
//     "children": [
//       {
//         "id": 2,
//         "name": "Mobiles",
//         "children": [
//           { "id": 4, "name": "Android", "children": [] }
//         ]
//       },
//       {
//         "id": 3,
//         "name": "Laptops",
//         "children": []
//       }
//     ]
//   }
// ]

// const parent = new Category();
// parent.name = "Electronics";
// await categoryRepository.save(parent);

// const child = new Category();
// child.name = "Mobiles";
// child.parent = parent; // <== Set parent
// await categoryRepository.save(child);

// | id | name        | parentId |
// | -- | ----------- | -------- |
// | 1  | Electronics | NULL     |
// | 2  | Mobiles     | 1        |
