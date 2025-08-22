import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { UserRepository } from "../respositories/UserRepository";

export async function createOperations() {
    const userRepository = AppDataSource.getRepository(User);
    
    const extendedUserRepository = new UserRepository();
    // const user1 = await extendedUserRepository.save({
    //     firstName: "Alice",
    //     lastName: "Johnson",
    //     email: "alice@example.com",
    //     age: 28,
    //     isActive: true,
    //     phone: "+1-555-0123"
    // });
    // console.log("👤 User1 created:", user1);

    const user = await extendedUserRepository.findByAgeRange(10,30);
    console.log("getmany user :",user);

    // // Method 1: Create and save in one step
    // const user1 = await userRepository.save({
    //     firstName: "Alice",
    //     lastName: "Johnson",
    //     email: "alice@example.com",
    //     age: 28,
    //     isActive: true,
    //     phone: "+1-555-0123"
    // });
    // console.log("👤 User1 created:", user1);

    // // Method 2: Create instance first, then save
    // const user2 = new User();
    // user2.firstName = "Bob";
    // user2.lastName = "Smith";
    // user2.email = "bob@example.com";
    // user2.age = 35;
    // user2.bio = "Software engineer with 10 years of experience";
    
    // const savedUser2 = await userRepository.save(user2);
    // console.log("👤 User2 created:", savedUser2);

    // // Method 3: Create using repository.create() + save()
    // const user3 = userRepository.create({
    //     firstName: "Charlie",
    //     lastName: "Brown",
    //     email: "charlie@example.com",
    //     age: 22,
    //     isActive: true
    // });
    // await userRepository.save(user3);
    // console.log("👤 User3 created:", user3);

    // // Method 4: Bulk insert (efficient for multiple records)
    // const usersToCreate = [
    //     {
    //         firstName: "Diana",
    //         lastName: "Prince",
    //         email: "diana@example.com",
    //         age: 30,
    //         isActive: true
    //     },
    //     {
    //         firstName: "Edward",
    //         lastName: "Norton",
    //         email: "edward@example.com",
    //         age: 45,
    //         isActive: false
    //     }
    // ];

    // const bulkUsers = await userRepository.save(usersToCreate);
    // console.log("👥 Bulk users created:", bulkUsers.length);

    // return { user1, savedUser2, user3, bulkUsers };
}