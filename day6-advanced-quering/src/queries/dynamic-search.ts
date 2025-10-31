import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Post } from "../entities/Post";
import { SelectQueryBuilder, Brackets } from "typeorm";
import { Like, ILike, MoreThan, Between, In } from "typeorm";

export interface UserSearchOptions {
    searchTerm?: string;
    roles?: string[];
    isActive?: boolean;
    minReputation?: number;
    createdAfter?: Date;
    createdBefore?: Date;
    hasProfile?: boolean;
    sortBy?: "name" | "reputation" | "created" | "posts";
    sortOrder?: "ASC" | "DESC";
    page?: number;
    limit?: number;
}

export interface PostSearchOptions {
    searchTerm?: string;
    categories?: string[];
    tags?: string[];
    isPublished?: boolean;
    isFeatured?: boolean;
    minViews?: number;
    authorId?: number;
    dateRange?: {
        start: Date;
        end: Date;
    };
    sortBy?: "date" | "views" | "likes" | "title";
    sortOrder?: "ASC" | "DESC";
    page?: number;
    limit?: number;
}


export async function dynamicUserSearch(options: UserSearchOptions) {
    const userRepository = AppDataSource.getRepository(User);

    let query = userRepository.createQueryBuilder("user")
        .leftJoinAndSelect("user.profile", "profile")
        .leftJoinAndSelect("user.posts", "posts");

    // SELECT "user".*, "profile".*
    // FROM "users" "user"
    // LEFT JOIN "user_profiles" as  "profile"
    //   ON "profile"."userId" = "user"."id";

    // SELECT 
    //   "user".*,
    //   "profile".*,
    //   "posts".*
    // FROM "users" "user"
    // LEFT JOIN "user_profiles" "profile"
    //   ON "profile"."userId" = "user"."id"
    // LEFT JOIN "posts" "posts"
    //   ON "posts"."authorId" = "user"."id";

    // TExt search across mutiple fields
    if (options.searchTerm) {
        query = query.andWhere(new Brackets(qb => {
            qb.where("user.firstName ILIKE :search", { search: `%${options.searchTerm}%` })
                .orWhere("user.lastName ILIKE :search", { search: `%${options.searchTerm}%` })
                .orWhere("user.email ILIKE :search", { search: `%${options.searchTerm}%` })
                .orWhere("user.username ILIKE :search", { search: `%${options.searchTerm}%` });
        }));
    }
    // AND (
    //     user.firstName ILIKE '%searchTerm%' OR
    //     user.lastName ILIKE '%searchTerm%' OR
    //     user.email ILIKE '%searchTerm%' OR
    //     user.username ILIKE '%searchTerm%'
    // )
    // Role filter
    if (options.roles && options.roles.length > 0) {
        query = query.andWhere("user.role IN (:...roles)", { roles: options.roles });  //["admin", "editor"]
    }

    // Active status filter
    if (options.isActive !== undefined) {
        query = query.andWhere("user.isActive = :isActive", { isActive: options.isActive });
    }

    // Reputation filter
    if (options.minReputation !== undefined) {
        query = query.andWhere("user.reputation >= :minRep", { minRep: options.minReputation });
    }

    // Date range filters
    if (options.createdAfter) {
        query = query.andWhere("user.createdAt >= :createdAfter", { createdAfter: options.createdAfter });  // new Date("2024-01-01")
    }

    if (options.createdBefore) {
        query = query.andWhere("user.createdAt <= :createdBefore", { createdBefore: options.createdBefore });
    }

    // Profile existence filter
    if (options.hasProfile !== undefined) {
        if (options.hasProfile) {
            query = query.andWhere("profile.id IS NOT NULL");
        } else {
            query = query.andWhere("profile.id IS NULL");
        }
    }

    // Sorting
    const sortBy = options.sortBy || "created";
    const sortOrder = options.sortOrder || "DESC";

    switch (sortBy) {
        case "name":
            query = query.orderBy("user.lastName", sortOrder)
                .addOrderBy("user.firstName", sortOrder);
            break;
        case "reputation":
            query = query.orderBy("user.reputation", sortOrder);
            break;
        case "posts":
            query = query.orderBy("user.postCount", sortOrder);
            break;
        default:
            query = query.orderBy("user.createdAt", sortOrder);
    }

    // Get total count before pagination
    const totalCount = await query.getCount();
    // Pagination
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;  // (1 - 1) * 10 = 0, (2 - 1) * 10 = 10 ,(3 -1) * 10 = 20


    query = query.skip(skip).take(limit);

    const users = await query.getMany();

    return {
        users,
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
    };
}

export async function dynamicPostSearch(options: PostSearchOptions) {
    const postRepository = AppDataSource.getRepository(Post);
    
    let query = postRepository.createQueryBuilder("post")
        .leftJoinAndSelect("post.author", "author")
        .leftJoinAndSelect("author.profile", "profile");

    // Text search across title and content
    if (options.searchTerm) {
        query = query.andWhere(new Brackets(qb => {
            qb.where("post.title ILIKE :search", { search: `%${options.searchTerm}%` })
              .orWhere("post.content ILIKE :search", { search: `%${options.searchTerm}%` })
              .orWhere("post.excerpt ILIKE :search", { search: `%${options.searchTerm}%` });
        }));
    }
// AND (
//   post.title ILIKE '%AI trends%' OR
//   post.content ILIKE '%AI trends%' OR
//   post.excerpt ILIKE '%AI trends%'
// )

    // Category filter
    if (options.categories && options.categories.length > 0) {
        query = query.andWhere("post.category IN (:...categories)", { categories: options.categories });
    }

    // Tag filter (PostgreSQL array operations)
    if (options.tags && options.tags.length > 0) {
        query = query.andWhere("post.tags && :tags", { tags: options.tags });
    }
// options.tags = [ 'ai']
// post.tags && ARRAY['tech', 'ai']
// 🟢 Matches:

// Post 1 → {ai, machine-learning} ✅

// Post 3 → {tech, ai} ✅

// Post 2 → {plants, outdoor} ❌
    // Published status
    if (options.isPublished !== undefined) {
        query = query.andWhere("post.isPublished = :isPublished", { isPublished: options.isPublished });
    }

    // Featured status
    if (options.isFeatured !== undefined) {
        query = query.andWhere("post.isFeatured = :isFeatured", { isFeatured: options.isFeatured });
    }

    // Minimum views
    if (options.minViews !== undefined) {
        query = query.andWhere("post.viewCount >= :minViews", { minViews: options.minViews });
    }

    // Author filter
    if (options.authorId) {
        query = query.andWhere("author.id = :authorId", { authorId: options.authorId });
    }

    // Date range
    if (options.dateRange) {
        query = query.andWhere("post.publishedAt BETWEEN :start AND :end", {
            start: options.dateRange.start,
            end: options.dateRange.end
        });
    }

    // Sorting
    const sortBy = options.sortBy || "date";
    const sortOrder = options.sortOrder || "DESC";

    switch (sortBy) {
        case "views":
            query = query.orderBy("post.viewCount", sortOrder);
            break;
        case "likes":
            query = query.orderBy("post.likeCount", sortOrder);
            break;
        case "title":
            query = query.orderBy("post.title", sortOrder);
            break;
        default:
            query = query.orderBy("post.publishedAt", sortOrder);
    }

    // Get total count
    const totalCount = await query.getCount();

    // Pagination
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).take(limit);

    const posts = await query.getMany();

    return {
        posts,
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
    };
}


export async function demonstrateDynamicSearch() {
 console.log("=== Dynamic Search Demonstrations ===");
     // User search examples
    // const userSearch1 = await dynamicUserSearch({
    //     searchTerm: "Cortez",
    //     roles: ["author", "editor"],
    //     isActive: true,
    //     minReputation: 10,
    //     sortBy: "reputation",
    //     page: 1,
    //     limit: 5
    // });
    // console.log(userSearch1)
    //     console.log(`🔍 User search 1: ${userSearch1.users.length} results, ${userSearch1.total} total`);

    // const userSearch2 = await dynamicUserSearch({
    //     hasProfile: true,
    //     createdAfter: new Date("2025-11-01"),
    //     sortBy: "name",
    //     sortOrder: "ASC",
    //     limit: 100
    // });
    // console.log(`🔍 User search 2: ${userSearch2.users.length} results`);

    // Post search examples
    const postSearch1 = await dynamicPostSearch({
        searchTerm: "Defleo vulariter subnecto sunt ut.",
        // isPublished: true,
        minViews: 100,
        sortBy: "views",
        sortOrder: "DESC",
        page: 1,
        limit: 10
    });
    console.log(`📖 Post search 1: ${postSearch1.posts.length} results, ${postSearch1.total} total`);

    const postSearch2 = await dynamicPostSearch({
        categories: ["Technology", "Programming"],
        tags: ["javascript", "node"],
        isFeatured: true,
        dateRange: {
            start: new Date("2024-01-01"),
            end: new Date("2024-12-31")
        }
    });
    console.log(`📖 Post search 2: ${postSearch2.posts.length} results`);        
}