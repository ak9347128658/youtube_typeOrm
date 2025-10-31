import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Product } from "../entities/Product";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";


export async function subqueriesAndCTEs() {
    const userRepository = AppDataSource.getRepository(User);
    const productRepository = AppDataSource.getRepository(Product);
    const orderRepository = AppDataSource.getRepository(Order);

    console.log("=== Subqueries and CTEs ===");

    // 1. Subquery in WHERE clause
    const usersWithRecentOrders = await userRepository
        .createQueryBuilder("user")
        .where(qb => {
            const subQuery = qb
                .subQuery()
                .select("order.customer")
                .from(Order, "order")
                .where("order.createdAt > :date", { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) })
                .getQuery();
            return `user.id IN ${subQuery}`;
        })
        .getMany();
    console.log(`🕒 Users with orders in last 30 days: ${usersWithRecentOrders.length}`);

// SELECT order.customer
// FROM orders order
// WHERE order.created_at > '2025-09-30T20:00:00Z'

// WHERE user.id IN (
//     SELECT order.customer
//     FROM orders order
//     WHERE order.created_at > $1
// )
// [1,3,4,5]
} 
