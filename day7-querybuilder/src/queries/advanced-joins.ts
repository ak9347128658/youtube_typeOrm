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

