import { Repository, SelectQueryBuilder } from "typeorm";
import { User } from "../entities/User";
import { Role } from "../entities/Role";
import { AppDataSource } from "../data-source";


export class UserRepository extends Repository<User> {
    constructor() {
        super(User, AppDataSource.manager);
    }

    // Find users by role
    async findByRole(roleName: string): Promise<User[]> {
        return await this.createQueryBuilder("user")
            .leftJoinAndSelect("user.roles", "role")
            .where("role.name = :role", { role: roleName })
            .getMany();
    }

    //   SELECT * FROM users as user
    // LEFT JOIN user_roles ON user.id = user_roles.user_id
    // LEFT JOIN roles ON roles.id = user_roles.role_id
    // WHERE roles.name = 'Admin';

    // Get user statistics by role
    // [
    //   { role: "Admin", count: 5 },
    //   { role: "Agent", count: 12 },
    //   { role: "Lead", count: 3 },
    //   { role: "No Role", count: 2 }
    // ]
    async getUserStatsByRole(): Promise<Array<{ role: string; count: number }>> {
        const result = await this.createQueryBuilder("user")
            .leftJoin("user.roles", "role")
            .select("role.name", "role")
            .addSelect("COUNT(DISTINCT user.id)", "count")   // admin = 50, lead = 25, agent = 25  =100
            .groupBy("role.name")
            .orderBy("count", "DESC")
            .getRawMany();

        return result.map(row => ({
            role: row.role || "No Role",
            count: parseInt(row.count)
        }));
    }

    // Find active users with specific permission
    async findUsersWithPermission(permission: string): Promise<User[]> {
        return this.createQueryBuilder("user")
            .leftJoin("user.roles", "role")
            .where("user.isActive = :isActive", { isActive: true })
            .andWhere(":permission = ANY(role.permissions)", { permission })    //CREATE_USER, DELETE_USER, UPDATE_USER
            .getMany();
    }
    // SELECT DISTINCT user.*
    // FROM users user
    // LEFT JOIN user_roles ur ON user.id = ur.user_id
    // LEFT JOIN roles role ON ur.role_id = role.id
    // WHERE user.is_active = true
    //   AND 'DELETE_USER' = ANY(role.permissions);

    // Advance search with filters
    async advancedSearch(options: {
        searchTerm?: string;
        roles?: string[];
        isActive?: boolean;
        limit?: number;
        offset?: number
    }): Promise<{ users: User[], total: number }> {
        let query = this.createQueryBuilder("user")
            .leftJoinAndSelect("user.roles", "role");
           
        if(options.searchTerm){
            query = query.andWhere(
                "(user.firstName ILIKE :search OR user.lastName ILIKE : search OR user.email ILIKE :search)", {search: `%${options.searchTerm}%`}
            )
        }

        if(options.roles && options.roles.length > 0){   // ["ADMIN","LEAD","AGENT"]  
            query = query.andWhere("role.name IN (:...roles)",{roles: options.roles})
        }

        if(options.isActive !== undefined){
           query = query.andWhere("user.isActive = :isActive", {isActive: options.isActive})   
        }

        const total = await query.getCount();

        if(options.limit){
            query = query.limit(options.limit)
        }
        if(options.offset){
            query = query.offset(options.offset)
        }

        const users = await query.getMany();
 
        return {users, total};
  // asif --> Asif  123Asif@gmail.com  %Asif%
    }

    // advancedSearch({searchTerm,roles,isActive,limit,offset})

}

// SELECT user.*, role.*
// FROM users user
// LEFT JOIN user_roles ur ON user.id = ur.user_id
// LEFT JOIN roles role ON ur.role_id = role.id


// select role.name, Count(Distnct user.id)


// new UserRepository().getUserStatsByRole

// class Repository {
//     constructor(Entity, AppDatasocur.manager)
// } 
