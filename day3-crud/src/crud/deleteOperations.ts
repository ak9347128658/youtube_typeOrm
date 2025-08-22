import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

export async function deleteOperations() {
    const userRepository = AppDataSource.getRepository(User);

    // Method 1: Load and remove
    // const userToDelete = await userRepository.findOne({
    //     where: { email: "charlie@example.com" }
    // });

    // if (userToDelete) {
    //     await userRepository.remove(userToDelete);
    //     console.log("🗑️ User removed:", userToDelete.fullName);
    // }

    // Method 2: Direct delete by condition
    // const deleteResult = await userRepository.delete({
    //     email: "edward@example.com"
    // });
    // console.log("⚡ Direct delete affected rows:", deleteResult.affected);

    // // Method 3: Delete by ID
    // const deleteByIdResult = await userRepository.delete(5);
    // console.log("🔍 Delete by ID affected rows:", deleteByIdResult.affected);

    // // Method 4: Bulk delete with conditions
    // const bulkDeleteResult = await userRepository.delete({
    //     isActive: false
    // });
    // console.log("🔄 Bulk delete affected rows:", bulkDeleteResult.affected);

    // // Method 5: Conditional delete using QueryBuilder
    // await userRepository
    //     .createQueryBuilder()
    //     .delete()
    //     .from(User)
    //     .where("age < :minAge", { minAge: 18 })
    //     .execute();
    // console.log("🎯 Conditional delete completed");

    // Method 6: Soft delete (if you add @DeleteDateColumn to entity)
    // This doesn't actually delete, just marks as deleted
    // const softDeleteResult = await userRepository.softDelete({ id: 1 });

    // return deleteResult;
}