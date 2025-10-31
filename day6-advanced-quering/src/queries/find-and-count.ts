import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Post } from "../entities/Post";
import { MoreThan, Like } from "typeorm";

export async function findAndCountOperations() {
    const userRepository = AppDataSource.getRepository(User);
    const postRepository = AppDataSource.getRepository(Post);

    console.log("=== Find and Count Operations ===");
    // 1. Basic find and count
    // const [allUsers, totalUsers] = await userRepository.findAndCount()
    // console.log(`📊 Found ${JSON.stringify(allUsers[0], null, 2)} users, total: ${totalUsers}`);


    // // 2. Find and count with conditions
    // const [activeUsers, activeCount] = await userRepository.findAndCount({
    //     where: { isActive: true }
    // });
    // console.log(`🟢 Active users: ${activeUsers.length}/${totalUsers}`);

    // 3. Paginated find and count
    // const [paginatedPosts, totalPosts] = await postRepository.findAndCount({
    //     where: { isPublished: true },
    //     relations: ["author"],
    //     order: { publishedAt: "DESC" },
    //     skip: 0,
    //     take: 10
    // });
    // console.log(`📖 Posts page 1: ${paginatedPosts.length} of ${totalPosts} total`);    

    // 4. Count only (no data loading)
    // const authorCount = await userRepository.count({
    //     where: { role: "author" }
    // });
    // console.log(`✍️ Total authors: ${authorCount}`);

    // 5. Count with complex conditions
    // const popularPostCount = await postRepository.count({
    //     where: {
    //         isPublished: true,
    //         viewCount: MoreThan(1000)
    //     }
    // });
    // console.log(`🔥 Popular posts: ${popularPostCount}`);    

    // 6. Exists check
    // const hasAdmins = await userRepository.exists({
    //     where: { role: "admin" }
    // });
    // console.log(`👑 Has admins: ${hasAdmins}`);    

    // 7. Find by IDs
    // const specificUsers = await userRepository.findByIds([1, 2, 3]);
    // console.log(`🎯 Specific users found: ${specificUsers.length}`);    

    // 8. Find one or fail
    // try {
    //     const adminUser = await userRepository.findOneOrFail({
    //         where: { role: "admin" }
    //     });
    //     console.log(`👑 Admin found: ${adminUser.fullName}`);
    // } catch (error) {
    //     console.log("❌ No admin found");
    // }
}