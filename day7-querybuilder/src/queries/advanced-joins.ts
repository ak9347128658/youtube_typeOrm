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
// SELECT user.*, order.*
// FROM users user
// INNER JOIN orders order
//   ON order.customerId = user.id
// WHERE order.status != 'cancelled';

    // 2. LEFT JOIN with condition
    // const allUsersWithOrderCount = await userRepository
    //     .createQueryBuilder("user")
    //     .leftJoin("user.orders", "order")
    //     .addSelect("COUNT(order.id)", "orderCount")
    //     .groupBy("user.id")
    //     .where("user.firstName = :name",{name: "Tobin"})
    //     .getRawAndEntities();
    // console.log(`📊 Users with order counts: ${JSON.stringify(allUsersWithOrderCount,null,2)}`);

//SELECT user.*, COUNT(order.id) AS "orderCount"
// FROM users user
// LEFT JOIN orders order
//   ON order.customerId = user.id;
// {
//   raw: [ ... ],
//   entities: [ ... ]
// }


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

// SELECT
//     "order"."id" AS "order_id",
//     "order"."status" AS "order_status",
//     "order"."created_at" AS "order_created_at",
//     "customer"."id" AS "customer_id",
//     "customer"."name" AS "customer_name",
//     "item"."id" AS "item_id",
//     "item"."quantity" AS "item_quantity",
//     "product"."id" AS "product_id",
//     "product"."name" AS "product_name",
//     "category"."id" AS "category_id",
//     "category"."name" AS "category_name"
// FROM "order" "order"
// LEFT JOIN "customer" "customer" ON "customer"."id" = "order"."customer_id"
// LEFT JOIN "order_item" "item" ON "item"."order_id" = "order"."id"
// LEFT JOIN "product" "product" ON "product"."id" = "item"."product_id"
// LEFT JOIN "category" "category" ON "category"."id" = "product"."category_id"
// WHERE "order"."status" = 'delivered';

    // 4. Self JOIN example (if we had hierarchical categories)
    // const categorizedProducts = await productRepository
    //     .createQueryBuilder("product")
    //     .leftJoinAndSelect("product.category", "category")
    //     .where("category.isActive = :isActive", { isActive: true })
    //     .orderBy("category.name", "ASC")
    //     .addOrderBy("product.name", "ASC")
    //     .getMany();
    // console.log(`🏷️ Products with active categories: ${categorizedProducts.length}`);
// SELECT
//     "product"."id" AS "product_id",
//     "product"."name" AS "product_name",
//     "category"."id" AS "category_id",
//     "category"."name" AS "category_name",
//     "category"."is_active" AS "category_is_active"
// FROM "product" "product"
// LEFT JOIN "category" "category" ON "category"."id" = "product"."category_id"
// WHERE "category"."is_active" = true
// ORDER BY "category"."name" ASC, "product"."name" ASC;

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
// SELECT * 
// FROM user
// LEFT JOIN order ON order.userId = user.id
// WHERE order.totalAmount > 500 AND order.status = 'delivered'
// GROUP BY user.id
// HAVING COUNT(order.id) >= 2


    // 6. Subquery in JOIN
    const topSellingProducts = await productRepository
        .createQueryBuilder("product")
        .leftJoin(
            qb => qb
                .select("item.product","productid")
                .addSelect("SUM(item.quantity)", "totalsold")
                .from(OrderItem, "item")
                .groupBy("item.product"),
            "sales",
            "sales.productid = product.id"
        )
        .addSelect("COALESCE(sales.totalsold, 0)", "totalsold")
        .orderBy("sales.totalsold", "DESC")
        .getRawAndEntities();
    console.log(`🔥 Top selling products query executed : ${JSON.stringify(topSellingProducts,null,2)}`);
// .leftJoin(subquery, "sales", "sales.product = product.id"
// SELECT product.*, COALESCE(sales."totalSold", 0) AS "totalSold"
// FROM product
// LEFT JOIN (
//   SELECT item.product AS product,
//          SUM(item.quantity) AS "totalSold"
//   FROM order_item item
//   GROUP BY item.product
// ) sales
//   ON sales.product = product.id
// ORDER BY sales."totalSold" DESC;



}