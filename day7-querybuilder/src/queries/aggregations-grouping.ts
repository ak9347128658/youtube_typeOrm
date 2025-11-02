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
    const salesByCountry = await orderRepository
        .createQueryBuilder("order")
        .select("order.shippingCountry", "country")
        .addSelect("COUNT(*)", "orderCount")
        .addSelect("SUM(order.totalAmount)", "totalRevenue")
        .addSelect("AVG(order.totalAmount)", "avgOrderValue")
        .where("order.status = :status", { status: "delivered" })
        .groupBy("order.shippingCountry")
        .orderBy("totalRevenue", "DESC")
        .getRawMany();
    console.log(`🌍 Sales by country: ${salesByCountry.length} countries`);    
}

