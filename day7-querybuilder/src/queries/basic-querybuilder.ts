import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Product } from "../entities/Product";
import { Order } from "../entities/Order";


export async function basicQueryBuilderOperations() {
    const userRepository = AppDataSource.getRepository(User);
    const productRepository = AppDataSource.getRepository(Product);

    console.log("=== Basic QueryBuilder Operations ===");

    // 1. Basic SELECT
    // const allUsers = await userRepository
    //     .createQueryBuilder("user")
    //     .getMany();
    // console.log(`👥 All users: ${allUsers.length}`);    

    // 2. SELECT with WHERE
    // const activeUsers = await userRepository
    //     .createQueryBuilder("user")
    //     .where("user.isActive = :isActive", { isActive: true })
    //     .getMany();
    // console.log(`🟢 Active users: ${activeUsers.length}`);


    // 3. SELECT specific columns
    // const userEmails = await userRepository
    //     .createQueryBuilder("user")
    //     .select(["user.id", "user.email", "user.firstName"])
    //     .where("user.isActive = :isActive", { isActive: true })
    //     .getMany();
    // console.log(`📧 User emails loaded: ${userEmails.length}`);

    // 4. ORDER BY
    // const usersBySpending = await userRepository
    //     .createQueryBuilder("user")
    //     .orderBy("user.totalSpent", "DESC")
    //     .addOrderBy("user.createdAt", "ASC")
    //     .getMany();
    // console.log(`💰 Top spender: ${usersBySpending[0]?.fullName} ($${usersBySpending[0]?.totalSpent})`);    
    // 5. LIMIT and OFFSET
    // const paginatedProducts = await productRepository
    //     .createQueryBuilder("product")
    //     .where("product.isActive = :isActive", { isActive: true })
    //     .orderBy("product.createdAt", "DESC")
    //     .skip(5)  // OFFSET
    //     .take(5)  // LIMIT
    //     .getMany();
    // console.log(`📦 Latest products (page 1): ${paginatedProducts.length}`);

    // // 6. COUNT
    // const productCount = await productRepository
    //     .createQueryBuilder("product")
    //     .where("product.stockQuantity > :stock", { stock: 0 })
    //     .getCount();
    // console.log(`📊 Products in stock: ${productCount}`);

    // 7. Raw results
    // const userStats = await userRepository
    //     .createQueryBuilder("user")
    //     .select("COUNT(*)", "totalUsers")
    //     .addSelect("AVG(user.totalSpent)", "avgSpent")
    //     .addSelect("MAX(user.totalSpent)", "maxSpent")
    //     .where("user.isActive = :isActive", { isActive: true })
    //     .getRawOne();
    // console.log(`📈 User stats:`, userStats);    
}

// SELECT * 
// FROM users user
// ORDER BY "totalSpent" DESC 
// | id | firstName | lastName | email                                         | isActive |
// | -- | --------- | -------- | --------------------------------------------- | -------- |
// | 1  | John      | Doe      | [john@example.com](mailto:john@example.com)   | ✅ true   |
// | 2  | Alice     | Smith    | [alice@example.com](mailto:alice@example.com) | ✅ true   |
// | 3  | Bob       | Brown    | [bob@example.com](mailto:bob@example.com)     | ❌ false  |

// [
//   { id: 1, firstName: "John", lastName: "Doe", isActive: true },
//   { id: 2, firstName: "Alice", lastName: "Smith", isActive: true }
// ]
