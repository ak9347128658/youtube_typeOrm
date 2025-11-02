import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Product } from "../entities/Product";

/**
 * ======================================================
 * 💰 Understanding Transactions in TypeORM
 * ======================================================
 * A Transaction ensures that a group of database operations
 * either ALL succeed or ALL fail together.
 *
 * Example: When a user places an order:
 *   - You must create an order record
 *   - Deduct stock from each product
 *   - Update the user's total spending
 * If one step fails (e.g., stock is insufficient),
 * everything should ROLLBACK.
 *
 * TypeORM gives multiple ways to use transactions:
 * 1️⃣ Manual Transaction (using QueryRunner)
 * 2️⃣ Automatic Transaction (using manager.transaction)
 */

export async function transactionExamples() {
    console.log("=== TypeORM Transactions ===");

    // Get connection
    const connection = AppDataSource;

    /**
     * ======================================================
     * 1️⃣ Manual Transaction using QueryRunner
     * ======================================================
     * You have full control to start, commit, or rollback manually.
     */
    const queryRunner = connection.createQueryRunner();

    // Establish a real database connection
    await queryRunner.connect();

    // Start a new transaction
    await queryRunner.startTransaction();

    try {
        console.log("🚀 Starting manual transaction...");

        // Fetch a sample user and product
        const user = await queryRunner.manager.findOne(User, { where: { id: 1 } });
        const product = await queryRunner.manager.findOne(Product, { where: { id: 1 } });

        if (!user || !product) throw new Error("User or Product not found!");

        if (product.stockQuantity <= 0) throw new Error("❌ Product out of stock!");

        // Step 1: Create order
        const order = queryRunner.manager.create(Order, {
            orderNumber: `ORD-${Date.now()}`,
            status: "processing",
            totalAmount: product.price,
            shippingCost: 10,
            taxAmount: 5,
            shippingAddress: "123 Main Street",
            shippingCity: "New York",
            shippingCountry: "USA",
            customer: user,
        });
        await queryRunner.manager.save(order);

        // Step 2: Create order item
        const orderItem = queryRunner.manager.create(OrderItem, {
            order,
            product,
            quantity: 1,
            unitPrice: product.price,
            totalPrice: product.price,
        });
        await queryRunner.manager.save(orderItem);

        // Step 3: Update product stock
        product.stockQuantity -= 1;
        await queryRunner.manager.save(product);

        // Step 4: Update user’s totalSpent
        user.totalSpent = Number(user.totalSpent) + Number(product.price);
        await queryRunner.manager.save(user);

        // ✅ If all successful, commit
        await queryRunner.commitTransaction();
        console.log("✅ Transaction committed successfully!");
    } catch (error) {
        // ❌ If any step fails, rollback
        console.error("❌ Transaction failed. Rolling back...", error);
        await queryRunner.rollbackTransaction();
    } finally {
        // Release the query runner to free resources
        await queryRunner.release();
    }

    /**
     * ======================================================
     * 2️⃣ Automatic Transaction using manager.transaction()
     * ======================================================
     * TypeORM can handle BEGIN / COMMIT / ROLLBACK automatically
     * inside a callback function.
     */
    await connection.manager.transaction(async (manager) => {
        console.log("⚙️ Starting automatic transaction...");

        const user = await manager.findOne(User, { where: { id: 2 } });
        const product = await manager.findOne(Product, { where: { id: 2 } });

        if (!user || !product) throw new Error("User or Product not found!");

        if (product.stockQuantity <= 0) throw new Error("❌ Product out of stock!");

        // Create order
        const order = manager.create(Order, {
            orderNumber: `ORD-${Date.now()}`,
            status: "processing",
            totalAmount: product.price,
            shippingCost: 5,
            taxAmount: 2,
            shippingAddress: "22 Wall Street",
            shippingCity: "New York",
            shippingCountry: "USA",
            customer: user,
        });
        await manager.save(order);

        // Create order item
        const orderItem = manager.create(OrderItem, {
            order,
            product,
            quantity: 1,
            unitPrice: product.price,
            totalPrice: product.price,
        });
        await manager.save(orderItem);

        // Update stock
        product.stockQuantity -= 1;
        await manager.save(product);

        // Update user's spending
        user.totalSpent = Number(user.totalSpent) + Number(product.price);
        await manager.save(user);

        console.log("✅ Automatic transaction committed successfully!");
    });

    console.log("🎉 All transaction examples completed!");
}

// BEGIN TRANSACTION
//   ├── Insert INTO orders (...)
//   ├── Insert INTO order_items (...)
//   ├── UPDATE products SET stockQuantity = stockQuantity - 1
//   ├── UPDATE users SET totalSpent = totalSpent + price
//   ↓
// IF all succeed → COMMIT ✅
// IF any fails → ROLLBACK ❌
