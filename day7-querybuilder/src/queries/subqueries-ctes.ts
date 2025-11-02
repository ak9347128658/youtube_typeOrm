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
    // const usersWithRecentOrders = await userRepository
    //     .createQueryBuilder("user")
    //     .where(qb => {
    //         const subQuery = qb
    //             .subQuery()
    //             .select("order.customer")
    //             .from(Order, "order")
    //             .where("order.createdAt > :date", { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) })
    //             .getQuery();
    //         return `user.id IN ${subQuery}`;
    //     })
    //     .getMany();
    // console.log(`🕒 Users with orders in last 30 days: ${usersWithRecentOrders.length}`);   

    // 2. Subquery in SELECT (scalar subquery)
    // const usersWithOrderCounts = await userRepository
    //     .createQueryBuilder("user")
    //     .addSelect(qb => {
    //         return qb
    //             .select("COUNT(*)", "orderCount")
    //             .from(Order, "order")
    //             .where("order.customer = user.id")
    //             .andWhere("order.status != :status", { status: "cancelled" });
    //     }, "orderCount")
    //     .getRawAndEntities();
    // console.log(`📊 Users with calculated order counts: ${usersWithOrderCounts.entities[0].firstName} ${usersWithOrderCounts.raw[0].orderCount}`);

    // 3. EXISTS subquery
    // const usersWithHighValueOrders = await userRepository
    //     .createQueryBuilder("user")
    //     .where(qb => {
    //         const subQuery = qb
    //             .subQuery()
    //             .select("1")
    //             .from(Order, "order")
    //             .where("order.customer = user.id")
    //             .andWhere("order.totalAmount > :amount", { amount: 1000 })
    //             .getQuery();
    //         return `EXISTS ${subQuery}`;
    //     })
    //     .getMany();
    // console.log(`💎 Users with high-value orders: ${usersWithHighValueOrders.length}`);    

    // 5. Correlated subquery for ranking
    // const topProductsPerCategory = await productRepository
    //     .createQueryBuilder("product")
    //     .where(qb => {
    //         const subQuery = qb
    //             .subQuery()
    //             .select("COUNT(*)")
    //             .from(Product, "p2")
    //             .where("p2.category = product.category")
    //             .andWhere("p2.salesCount > product.salesCount")
    //             .getQuery();
    //         return `(${subQuery}) < :rank`;
    //     })
    //     .setParameter("rank", 3)
    //     .leftJoinAndSelect("product.category", "category")
    //     .orderBy("category.name", "ASC")
    //     .addOrderBy("product.salesCount", "DESC")
    //     .getMany();
    // console.log(`🏆 Top 3 products per category: ${topProductsPerCategory.length}`);    

    // 6. Common Table Expression (CTE) using raw query
    const monthlySalesData = await AppDataSource.query(`
        WITH monthly_sales AS (
            SELECT 
                DATE_TRUNC('month', o.created_at) as month,
                COUNT(*) as order_count,
                SUM(o.total_amount) as total_revenue,
                AVG(o.total_amount) as avg_order_value
            FROM orders o
            WHERE o.status = 'delivered'
            GROUP BY DATE_TRUNC('month', o.created_at)
        )
        SELECT 
            month,
            order_count,
            total_revenue,
            avg_order_value,
            LAG(total_revenue) OVER (ORDER BY month) as prev_month_revenue,
            (total_revenue - LAG(total_revenue) OVER (ORDER BY month)) / LAG(total_revenue) OVER (ORDER BY month) * 100 as growth_rate
        FROM monthly_sales
        ORDER BY month DESC
        LIMIT 12
    `);
    console.log(`📈 Monthly sales data: ${monthlySalesData.length} months`);    

}

// Example Data Produced by the CTE
// | month      | order_count | total_revenue | avg_order_value |
// | ---------- | ----------- | ------------- | --------------- |
// | 2025-10-01 | 180         | 300,000       | 1666.67         |
// | 2025-09-01 | 150         | 250,000       | 1666.67         |
// | 2025-08-01 | 100         | 190,000       | 1900.00         |
// | 2025-07-01 | 120         | 210,000       | 1750.00         |

// ┌────────────────────────────────────────────┐
// │                orders table                │
// │────────────────────────────────────────────│
// │ id │ total_amount │ created_at │ status    │
// │----│---------------│------------│-----------│
// │ 1  │ 1000          │ 2025-07-12 │ delivered │
// │ 2  │ 1500          │ 2025-07-25 │ delivered │
// │ 3  │ 1200          │ 2025-08-10 │ delivered │
// │ 4  │ 2000          │ 2025-09-14 │ delivered │
// │ 5  │ 1800          │ 2025-10-02 │ delivered │
// └────┴---------------┴------------┴-----------┘
//           │
//           ▼
//    ┌───────────────────────────────┐
//    │ CTE: monthly_sales            │
//    │───────────────────────────────│
//    │ month  │ total_revenue │ avg │
//    │ 2025-07│ 2500          │1250 │
//    │ 2025-08│ 1200          │1200 │
//    │ 2025-09│ 2000          │2000 │
//    │ 2025-10│ 1800          │1800 │
//    └───────────────────────────────┘
//           │
//           ▼
//    ┌───────────────────────────────────────┐
//    │ Final SELECT with LAG() and growth %  │
//    │───────────────────────────────────────│
//    │ month │ total │ prev │ growth_rate    │
//    │ 2025-10│ 1800 │ 2000 │ -10.0%         │
//    │ 2025-09│ 2000 │ 1200 │ +66.6%         │
//    │ 2025-08│ 1200 │ 2500 │ -52.0%         │
//    │ 2025-07│ 2500 │ NULL │ NULL           │
//    └───────────────────────────────────────┘

// [
//   {
//     month: "2025-10-01T00:00:00.000Z",
//     order_count: "180",
//     total_revenue: "300000",
//     avg_order_value: "1666.67",
//     prev_month_revenue: "250000",
//     growth_rate: "20.00"
//   },
//   {
//     month: "2025-09-01T00:00:00.000Z",
//     order_count: "150",
//     total_revenue: "250000",
//     avg_order_value: "1666.67",
//     prev_month_revenue: "190000",
//     growth_rate: "31.57"
//   },
//   ...
// ]
