import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

export async function updateOperations() {
    const userRepository = AppDataSource.getRepository(User);

    // Method 1: Load, modify, and save
    // const userToUpdate = await userRepository.findOne({
    //     where: { email: "alice@example.com" }
    // });

    // if (userToUpdate) {
    //     userToUpdate.age = 29;
    //     userToUpdate.bio = "Updated bio: Marketing specialist";
        
    //     const updatedUser = await userRepository.save(userToUpdate);
    //     console.log("✏️ User updated:", updatedUser.fullName);
    // }

    // // Method 2: Direct update (more efficient, doesn't trigger hooks)
    // const updateResult = await userRepository.update(
    //     { email: "bob@example.com" }, // conditions
    //     { 
    //         isActive: true,
    //         bio: "Updated via direct update method"
    //     } // new values
    // );
    // console.log("⚡ Direct update affected rows:", updateResult.affected);

    // // Method 3: Update multiple records
    // const bulkUpdateResult = await userRepository.update(
    //     { isActive: false }, // condition: all inactive users
    //     { 
    //         isActive: true,  // set them to active
    //         bio: "Reactivated user"
    //     }
    // );
    // console.log("🔄 Bulk update affected rows:", bulkUpdateResult.affected);

    // // Method 4: Conditional updates
    // await userRepository
    //     .createQueryBuilder()
    //     .update(User)
    //     .set({ 
    //         bio: "Senior member",
    //         isActive: true 
    //     })
    //     .where("age > :age", { age: 30 })
    //     .execute();
    // console.log("🎯 Conditional update completed");

    // // Method 5: Increment/Decrement
    // await userRepository.increment({ id: 3 }, "age", 1);
    // console.log("🔢 Incremented age for user 1");

    // return updateResult;
}