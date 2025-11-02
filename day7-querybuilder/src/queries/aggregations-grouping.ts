import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Product } from "../entities/Product";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";


export async function aggregationsAndGrouping() {
    const userRepository = AppDataSource.getRepository(User);
    const productRepository = AppDataSource.getRepository(Product);
    const orderRepository = AppDataSource.getRepository(Order);

    console.log("=== Aggregations and Grouping ===");
   // 1. Basic aggregations
    // const orderStats = await orderRepository
    //     .createQueryBuilder("order")
    //     .select("COUNT(*)", "totalOrders")
    //     .addSelect("SUM(order.totalAmount)", "totalRevenue")
    //     .addSelect("AVG(order.totalAmount)", "avgOrderValue")
    //     .addSelect("MIN(order.totalAmount)", "minOrderValue")
    //     .addSelect("MAX(order.totalAmount)", "maxOrderValue")
    //     .where("order.status = :status", { status: "delivered" })
    //     .getRawOne();
    // console.log(`📊 Order statistics:`, orderStats);

    // 2. GROUP BY with aggregations
    // const salesByCountry = await orderRepository
    //     .createQueryBuilder("order")
    //     .select("order.shippingCountry", "country")
    //     .addSelect("COUNT(*)", "orderCount")
    //     .addSelect("SUM(order.totalAmount)", "totalRevenue")
    //     .addSelect("AVG(order.totalAmount)", "avgOrderValue")
    //     .where("order.status = :status", { status: "delivered" })
    //     .groupBy("order.shippingCountry")
    //     .orderBy("totalRevenue", "DESC")
    //     .getRawMany();
    // console.log(`🌍 Sales by country: ${salesByCountry.length} countries`);    

    // 3. GROUP BY with HAVING
    // const highRevenueCountries = await orderRepository
    //     .createQueryBuilder("order")
    //     .select("order.shippingCountry", "country")
    //     .addSelect("SUM(order.totalAmount)", "totalRevenue")
    //     .addSelect("COUNT(*)", "orderCount")
    //     .where("order.status = :status", { status: "delivered" })
    //     .groupBy("order.shippingCountry")
    //     .having("SUM(order.totalAmount) > :minRevenue", { minRevenue: 10000 })
    //     .orderBy("totalRevenue", "DESC")
    //     .getRawMany();
    // console.log(`💰 High revenue countries: ${highRevenueCountries.length}`);    

    // 4. Complex grouping with multiple levels
    const dailySalesTrends = await orderRepository
        .createQueryBuilder("order")
        .select("DATE(order.createdAt)", "date")
        .addSelect("COUNT(*)", "orderCount")
        .addSelect("SUM(order.totalAmount)", "revenue")
        .addSelect("COUNT(DISTINCT order.customer)", "uniqueCustomers")
        .where("order.status = :status", { status: "delivered" })
        .andWhere("order.createdAt >= :startDate", { 
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
        })
        .groupBy("DATE(order.createdAt)")
        .orderBy("date", "DESC")
        .getRawMany();
    console.log(`📅 Daily sales trends (last 30 days): ${dailySalesTrends.length} days`);    
}

// Example Database:

// orders:
// | id | customer | totalAmount | createdAt        | status    |
// | -- | -------- | ----------- | ---------------- | --------- |
// | 1  | 101      | 200         | 2025-10-28 10:00 | delivered |
// | 2  | 102      | 300         | 2025-10-28 15:00 | delivered |
// | 3  | 101      | 250         | 2025-10-27 11:00 | delivered |
// | 4  | 103      | 400         | 2025-10-27 14:00 | delivered |
// | 5  | 104      | 180         | 2025-10-27 18:00 | delivered |
// | 6  | 105      | 120         | 2025-10-25 09:00 | cancelled |
// | 7  | 102      | 350         | 2025-10-25 17:00 | delivered |

// filter by status (delivered)
// | id | customer | totalAmount | createdAt  |
// | -- | -------- | ----------- | ---------- |
// | 1  | 101      | 200         | 2025-10-28 |
// | 2  | 102      | 300         | 2025-10-28 |
// | 3  | 101      | 250         | 2025-10-27 |
// | 4  | 103      | 400         | 2025-10-27 |
// | 5  | 104      | 180         | 2025-10-27 |
// | 7  | 102      | 350         | 2025-10-25 |

// group by Date:
// | Date       | orderCount | totalRevenue | uniqueCustomers   |
// | ---------- | ---------- | ------------ | ----------------- |
// | 2025-10-28 | 2          | 500          | 2 (101, 102)      |
// | 2025-10-27 | 3          | 830          | 3 (101, 103, 104) |
// | 2025-10-25 | 1          | 350          | 1 (102)           |

// | Date          | Orders | Revenue | Unique Customers |
// | ------------- | ------ | ------- | ---------------- |
// | 🗓 2025-10-28 | 2      | $500    | 2                |
// | 🗓 2025-10-27 | 3      | $830    | 3                |
// | 🗓 2025-10-25 | 1      | $350    | 1                |

// [
//   { date: "2025-10-28", orderCount: "2", revenue: "500", uniqueCustomers: "2" },
//   { date: "2025-10-27", orderCount: "3", revenue: "830", uniqueCustomers: "3" },
//   { date: "2025-10-25", orderCount: "1", revenue: "350", uniqueCustomers: "1" }
// ]

// ┌────────────────────────────────────────────┐
// │                orders table                │
// │────────────────────────────────────────────│
// │ id │ totalAmount │ customer │ createdAt   │
// │----│--------------│----------│-------------│
// │ 1  │ 200          │ 101      │ 2025-10-28  │
// │ 2  │ 300          │ 102      │ 2025-10-28  │
// │ 3  │ 250          │ 101      │ 2025-10-27  │
// │ 4  │ 400          │ 103      │ 2025-10-27  │
// │ 5  │ 180          │ 104      │ 2025-10-27  │
// │ 7  │ 350          │ 102      │ 2025-10-25  │
// └────┴--------------┴----------┴-------------┘
//          │
//          ▼
// Filter → WHERE status='delivered' AND createdAt >= last 30 days
//          │
//          ▼
// GROUP BY → DATE(createdAt)
//          │
//          ├── COUNT(*) → orderCount
//          ├── SUM(totalAmount) → revenue
//          └── COUNT(DISTINCT customer) → uniqueCustomers
//          ▼
// ORDER BY → date DESC
//          ▼
// ┌────────────────────────────────────────────┐
// │ 📅 2025-10-28 → 2 orders, $500, 2 customers │
// │ 📅 2025-10-27 → 3 orders, $830, 3 customers │
// │ 📅 2025-10-25 → 1 order, $350, 1 customer   │
// └────────────────────────────────────────────┘
