import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Product } from "../entities/Product";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";


export async function advancedJoinOperations() {
    const userRepository = AppDataSource.getRepository(User);
    const productRepository = AppDataSource.getRepository(Product);
    const orderRepository = AppDataSource.getRepository(Order);

    console.log("=== Advanced JOIN Operations ===");

    // 1. INNER JOIN
    // const usersWithOrders = await userRepository
    //     .createQueryBuilder("user")
    //     .innerJoinAndSelect("user.orders", "order")
    //     .where("order.status != :status", { status: "cancelled" })
    //     .getMany();
    // console.log(`👥 Users with orders: ${usersWithOrders.length}`);    
    
    // 2. LEFT JOIN with condition
    // const allUsersWithOrderCount = await userRepository
    //     .createQueryBuilder("user")
    //     .leftJoin("user.orders", "order")
    //     .addSelect("COUNT(order.id)", "orderCount")
    //     .groupBy("user.id")
    //     .getRawAndEntities();
    // console.log(`📊 Users with order counts: ${allUsersWithOrderCount.entities.length}`);


    // 3. Multiple JOINs
    // const ordersWithDetails = await orderRepository
    //     .createQueryBuilder("order")
    //     .leftJoinAndSelect("order.customer", "customer")
    //     .leftJoinAndSelect("order.items", "item")
    //     .leftJoinAndSelect("item.product", "product")
    //     .leftJoinAndSelect("product.category", "category")
    //     .where("order.status = :status", { status: "delivered" })
    //     .getMany();
    // console.log(`📦 Delivered orders with full details: ${ordersWithDetails.length}`);    
    
    // 4. Self JOIN example (if we had hierarchical categories)
    // const categorizedProducts = await productRepository
    //     .createQueryBuilder("product")
    //     .leftJoinAndSelect("product.category", "category")
    //     .where("category.isActive = :isActive", { isActive: true })
    //     .orderBy("category.name", "ASC")
    //     .addOrderBy("product.name", "ASC")
    //     .getMany();
    // console.log(`🏷️ Products with active categories: ${categorizedProducts.length}`);

    // 5. JOIN with complex conditions
    // const highValueCustomers = await userRepository
    //     .createQueryBuilder("user")
    //     .leftJoin("user.orders", "order")
    //     .where("order.totalAmount > :amount", { amount: 500 })
    //     .andWhere("order.status = :status", { status: "delivered" })
    //     .groupBy("user.id")
    //     .having("COUNT(order.id) >= :orderCount", { orderCount: 2 })
    //     .getMany();
    // console.log(`💎 High-value customers: ${highValueCustomers.length}`);  
    
     // 6. Subquery in JOIN
    // const topSellingProducts = await productRepository
    //     .createQueryBuilder("product")
    //     .leftJoin(
    //         qb => qb
    //             .select("item.product")
    //             .addSelect("SUM(item.quantity)", "totalSold")
    //             .from(OrderItem, "item")
    //             .groupBy("item.product"),
    //         "sales",
    //         "sales.product = product.id"
    //     )
    //     .addSelect("COALESCE(sales.totalSold, 0)", "totalSold")
    //     .orderBy("sales.totalSold", "DESC")
    //     .getRawAndEntities();
    // console.log(`🔥 Top selling products query executed`);   
}


// SELECT 
//   product.*, 
//   COALESCE(sales.totalSold, 0) AS "totalSold"
// FROM products product
// LEFT JOIN (
//     SELECT 
//       item.product AS product,
//       SUM(item.quantity) AS totalSold
//     FROM order_items item
//     GROUP BY item.product
// ) sales
//   ON sales.product = product.id
// ORDER BY sales.totalSold DESC;

// Example Data:

// products:
// | id | name           |
// | -- | -------------- |
// | 1  | iPhone 15      |
// | 2  | MacBook Air    |
// | 3  | Samsung Galaxy |
// | 4  | AirPods        |

// order_items:
// | id | productId | quantity |
// | -- | --------- | -------- |
// | 1  | 1         | 3        |
// | 2  | 1         | 2        |
// | 3  | 2         | 1        |
// | 4  | 3         | 5        |
// ...


// SELECT item.product, SUM(item.quantity) AS totalSold
// FROM order_items item
// GROUP BY item.product;

// sales
// | product | totalSold |
// | ------- | --------- |
// | 1       | 5         |
// | 2       | 1         |
// | 3       | 5         |

// LEFT JOIN with Products:
// | product.id | name           | totalSold |
// | ---------- | -------------- | --------- |
// | 1          | iPhone 15      | 5         |
// | 2          | MacBook Air    | 1         |
// | 3          | Samsung Galaxy | 5         |
// | 4          | AirPods        | NULL      |

// COALESCE & ORDER BY

// COALESCE(sales.totalSold, 0) turns NULL → 0

// Sorted descending by totalSold
// | product | name           | totalSold |
// | ------- | -------------- | --------- |
// | 1       | iPhone 15      | 5         |
// | 3       | Samsung Galaxy | 5         |
// | 2       | MacBook Air    | 1         |
// | 4       | AirPods        | 0         |


// {
//   raw: [
//     { product_id: 1, name: "iPhone 15", totalSold: "5" },
//     { product_id: 3, name: "Samsung Galaxy", totalSold: "5" },
//     { product_id: 2, name: "MacBook Air", totalSold: "1" },
//     { product_id: 4, name: "AirPods", totalSold: "0" }
//   ],
//   entities: [
//     Product { id: 1, name: 'iPhone 15' },
//     Product { id: 3, name: 'Samsung Galaxy' },
//     Product { id: 2, name: 'MacBook Air' },
//     Product { id: 4, name: 'AirPods' }
//   ]
// }

//                    ┌─────────────────────┐
//                    │     products        │
//                    ├─────────────────────┤
//                    │ id │ name           │
//                    │ 1  │ iPhone 15      │
//                    │ 2  │ MacBook Air    │
//                    │ 3  │ Samsung Galaxy │
//                    │ 4  │ AirPods        │
//                    └──────────┬──────────┘
//                               │
//                               ▼
//         ┌──────────────────────────────┐
//         │   Subquery: order_items      │
//         │──────────────────────────────│
//         │ SELECT item.product,         │
//         │ SUM(item.quantity) AS total  │
//         │ GROUP BY item.product        │
//         └──────────┬───────────────────┘
//                    │
//                    ▼
// ┌────────────────────────────────────────────────────────┐
// │  LEFT JOIN (subquery)                                  │
// │  ON sales.product = product.id                          │
// │                                                        │
// │  → Merge product info + total quantity sold per product │
// │  → Use COALESCE to set missing totals = 0               │
// │  → Sort DESC by totalSold                               │
// └────────────────────────────────────────────────────────┘

// Product Table
//   └── LEFT JOIN
//        Subquery: SUM(quantity) per product
//             └── COALESCE(totalSold, 0)
//                  └── ORDER BY totalSold DESC
// Result → Products ranked by total sales

