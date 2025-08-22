import { Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";

export class UserRepository extends Repository<User> {
    constructor() {
        super(User, AppDataSource.manager)
    }

    // custom method : find user by age range
    async findByAgeRange(minAge: number, maxAge: number): Promise<User[]> {
        return this.createQueryBuilder("user")
        .where("user.age >= :minAge",{minAge:minAge})
        .andWhere("user.age <= :maxAge", {maxAge: maxAge})
        .getMany();   
    }

    async findActiveUser(): Promise<User[]> {
        return this.find({
            where: {
                isActive: true
            }
        })
    }

    // Customer method: Search users by name
    async searchByName(searchTerm: string): Promise<User[]>{
        return this.createQueryBuilder("user")
                   .where("user.firstName ILIKE :search OR user.lastName ILIKE : search",{search: `%${searchTerm}%`})
                   .getMany();
    }

    // customer method: Get User statistics
    async getUserStats() {
        const [totalUsers,activeUsers,avgAge] = await Promise.all([
            this.count(),
            this.count({where: {isActive: true}}),
            this.createQueryBuilder("user").select("AVG(user.age)","avgAge").getRawOne()
        ])

        return {
            total: totalUsers,
            active: activeUsers,
            inactive: totalUsers - activeUsers,
            averageAge : parseFloat((avgAge).avgAge) || 0
        }
    }
}