import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

export async function readOperations() {
    const userRepository = AppDataSource.getRepository(User);

    // 1. Find all users
    // const allUsers = await userRepository.find();
    // console.log("📋 All users:", allUsers.length);

    // // 2. Find with specific conditions
    // const activeUsers = await userRepository.find({
    //     where: { isActive: true }
    // });
    // console.log("🟢 Active users:", activeUsers.length);

    // // 3. Find one user by ID
    // const userById = await userRepository.findOne({
    //     where: { id: 3 }
    // });
    // console.log("🔍 User by ID:", userById?.fullName);

    // // 4. Find by unique field
    // const userByEmail = await userRepository.findOne({
    //     where: { email: "alice@example.com" }
    // });
    // console.log("📧 User by email:", userByEmail?.fullName);

    // // 5. Find with multiple conditions (AND)
    // const specificUser = await userRepository.findOne({
    //     where: {
    //         isActive: true,
    //         age: 28
    //     }
    // });
    // console.log("🎯 Specific user:", specificUser?.fullName);

    // // 6. Find with ordering
    // const sortedUsers = await userRepository.find({
    //     order: {
    //         createdAt: "DESC",
    //         lastName: "ASC"
    //     }
    // });
    // console.log("📊 First sorted user:", sortedUsers[0]?.fullName);

    // // 7. Find with pagination
    // const paginatedUsers = await userRepository.find({
    //     skip: 3,  // Offset
    //     take: 3   // Limit
    // });
    // console.log("📄 Paginated users:", paginatedUsers.length);

    // // 8. Find and count
    // const [users, count] = await userRepository.findAndCount({
    //     where: { isActive: true }
    // });
    // console.log(`📊 Found ${count} active users, showing ${users.length}`);

    // // 9. Check if exists
    // const userExists = await userRepository.exists({
    //     where: { email: "alice@example.com" }
    // });
    // console.log("❓ User exists:", userExists);

    // // 10. Count records
    // const totalUsers = await userRepository.count();
    // const activeCount = await userRepository.count({
    //     where: { isActive: true }
    // });
    // console.log(`📈 Total: ${totalUsers}, Active: ${activeCount}`);

    // return { allUsers, activeUsers, userById };
}