import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Post } from "../entities/Post";
import { LessThan, MoreThan, Between, Like, In, Not, IsNull } from "typeorm";


export async function basicFindOptions() {
    const userRepository = AppDataSource.getRepository(User);
    const postRepository = AppDataSource.getRepository(Post);
    console.log("=== Find with Relations ===");
    // const usersWithProfiles = await userRepository.find({
    //     relations: ["profile"]
    // });
    // console.log(`👤 Users with profiles loaded: ${usersWithProfiles.length}`);

    // 2. Load multiple relations
    // const usersWithEverything = await userRepository.find({
    //     relations: ["profile", "posts", "comments"]
    // });
    // console.log(`🌟 Users with all relations: ${JSON.stringify(usersWithEverything[0], null, 2)}`);

        // 4. Conditional loading of relations
    // const publishedPostsWithAuthors = await postRepository.find({
    //     where: { isPublished: true },
    //     relations: ["author", "author.profile"],
    //     order: { publishedAt: "DESC" }
    // });
    // console.log(`📚 Published posts with authors: ${JSON.stringify(publishedPostsWithAuthors[0], null, 2)}`);
// SELECT 
//   "Post"."id" AS "Post_id",
//   "Post"."title" AS "Post_title",
//   "Post"."slug" AS "Post_slug",
//   "Post"."content" AS "Post_content",
//   "Post"."excerpt" AS "Post_excerpt",
//   "Post"."category" AS "Post_category",
//   "Post"."tags" AS "Post_tags",
//   "Post"."isPublished" AS "Post_isPublished",
//   "Post"."isFeatured" AS "Post_isFeatured",
//   "Post"."viewCount" AS "Post_viewCount",
//   "Post"."likeCount" AS "Post_likeCount",
//   "Post"."commentCount" AS "Post_commentCount",
//   "Post"."rating" AS "Post_rating",
//   "Post"."publishedAt" AS "Post_publishedAt",
//   "Post"."createdAt" AS "Post_createdAt",
//   "Post"."updatedAt" AS "Post_updatedAt",
  
//   -- Author (User) fields
//   "author"."id" AS "author_id",
//   "author"."firstName" AS "author_firstName",
//   "author"."lastName" AS "author_lastName",
//   "author"."email" AS "author_email",
//   "author"."username" AS "author_username",
//   "author"."role" AS "author_role",
//   "author"."isActive" AS "author_isActive",
//   "author"."createdAt" AS "author_createdAt",

//   -- Author profile fields
//   "profile"."id" AS "profile_id",
//   "profile"."bio" AS "profile_bio",
//   "profile"."website" AS "profile_website",
//   "profile"."location" AS "profile_location"

// FROM "posts" "Post"
// LEFT JOIN "users" "author" ON "author"."id" = "Post"."authorId"
// LEFT JOIN "user_profiles" "profile" ON "profile"."userId" = "author"."id"
// WHERE "Post"."isPublished" = true
// ORDER BY "Post"."publishedAt" DESC;

    // 5. Select specific fields from relations
    // const postsWithAuthorNames = await postRepository.find({
    //     select: {
    //         id: true,
    //         title: true,
    //         viewCount: true,
    //         author: {
    //             id: true,
    //             firstName: true,
    //             lastName: true,
    //             username: true
    //         }
    //     },
    //     relations: ["author"],
    //     where: { isPublished: true }
    // });
    // console.log(`📋 Posts with author names only: ${JSON.stringify(postsWithAuthorNames[0], null, 2)}`);

// SELECT
//   "Post"."id" AS "Post_id",
//   "Post"."title" AS "Post_title",
//   "Post"."viewCount" AS "Post_viewCount",

//   "author"."id" AS "author_id",
//   "author"."firstName" AS "author_firstName",
//   "author"."lastName" AS "author_lastName",
//   "author"."username" AS "author_username"

// FROM "posts" "Post"
// LEFT JOIN "users" "author"
//   ON "author"."id" = "Post"."authorId"
// WHERE "Post"."isPublished" = true;
 
// 6. Load relations with conditions
    // const authorsWithPopularPosts = await userRepository.find({
    //     relations: ["posts"],
    //     where: {
    //         posts: {
    //             viewCount: LessThan(500)
    //         }
    //     }
    // });
    // console.log(`🔥 Authors with popular posts: ${JSON.stringify(authorsWithPopularPosts[0], null, 2)}`);
// SELECT DISTINCT "User"."id" AS "User_id",
//        "User"."firstName" AS "User_firstName",
//        "User"."lastName" AS "User_lastName",
//        "User"."email" AS "User_email",
//        "User"."username" AS "User_username",
//        "User"."role" AS "User_role",
//        "User"."isActive" AS "User_isActive",
//        "User"."createdAt" AS "User_createdAt",
//        "User"."updatedAt" AS "User_updatedAt",
//        "posts"."id" AS "posts_id",
//        "posts"."title" AS "posts_title",
//        "posts"."viewCount" AS "posts_viewCount",
//        "posts"."isPublished" AS "posts_isPublished",
//        "posts"."authorId" AS "posts_authorId"
// FROM "users" "User"
// LEFT JOIN "posts" "posts" 
//   ON "posts"."authorId" = "User"."id"
// WHERE "posts"."viewCount" > 500;

}


// other operations

// export async function basicFindOptions() {
//     const userRepository = AppDataSource.getRepository(User);
//     const postRepository = AppDataSource.getRepository(Post);

//     // Example: Between
//     const postsBetweenDates = await postRepository.find({
//         where: {
//             publishedAt: Between(new Date('2024-01-01'), new Date('2024-06-01'))
//         }
//     });
//     console.log("Posts published between dates:", postsBetweenDates);

//     // Example: Like
//     const usersWithNameLike = await userRepository.find({
//         where: {
//             firstName: Like('%John%')
//         }
//     });
//     console.log("Users with firstName like 'John':", usersWithNameLike);

//     // Example: In
//     const postsWithIds = await postRepository.find({
//         where: {
//             id: In([1, 2, 3])
//         }
//     });
//     console.log("Posts with IDs 1, 2, 3:", postsWithIds);

//     // Example: Not
//     const usersNotAdmin = await userRepository.find({
//         where: {
//             role: Not('admin')
//         }
//     });
//     console.log("Users not admin:", usersNotAdmin);

//     // Example: IsNull
//     const postsWithoutCategory = await postRepository.find({
//         where: {
//             category: IsNull()
//         }
//     });
//     console.log("Posts without category:", postsWithoutCategory);
// }
