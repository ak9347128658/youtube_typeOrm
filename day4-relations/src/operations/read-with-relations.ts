import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Post } from "../entities/Post";

export async function readWithRelations() {
    const userRepository = AppDataSource.getRepository(User);
    const postRepository = AppDataSource.getRepository(Post);

    // Method 1: useing relations option
    // const usersWithProfiles = await userRepository.find({
    //     relations: ['profile']
    // })

    // // Select * from user Left Join profile on profile.userId = user.id
    // console.log("👥 Users with profiles:", usersWithProfiles.length);
    // usersWithProfiles.forEach(user => {
    //     console.log(`  ${user.fullName} - ${user.profile?.occupation || 'No occupation'}`);
    // });

    // Method 2: Using Sepicific realtions
    // const userWithPosts = await userRepository.find({
    //     relations: ["posts"]
    // })
    // console.log(userWithPosts[0].posts)

    // Method 3: Loading everything
    // const userWithEverything = await userRepository.find({
    //     relations: ['profile','posts']
    // })
    // console.log(userWithEverything)

    // Method 4: Finding specific user with relations
    // const specificUser = await userRepository.findOne({
    //     where: {
    //        email:"alice@example.com" 
    //     },
    //     relations: ["profile",'posts']
    // })

    // if (specificUser) {
    //     console.log(`📋 ${specificUser.fullName}:`);
    //     console.log(`  dob: ${specificUser.profile?.dateOfBirth || 'Unknown'}`);
    //     console.log(`  Posts: ${specificUser.postCount}`);
    //     console.log(`  Bio: ${specificUser.profile?.bio || 'No bio'}`);
    // }    

    // Method 5: Loading relations selectively
    // const postsWithAuthors = await postRepository.find({
    //     relations: ["author"],
    //     where: {
    //         isPublished: true
    //     }
    // })
    // console.log("📖 Published posts with authors:");
    // postsWithAuthors.forEach(post => {
    //     console.log(`  "${post.title}" by ${post.author.fullName}`);
    // });

   // Method 6: Using QueryBuilder for complex queries
//    const authorWithPostsCounts = await userRepository
//                                         .createQueryBuilder("user")           // select * from user as user
//                                         .leftJoinAndSelect("user.posts","post")
//                                         .leftJoinAndSelect("user.profile","profile")
//                                         .where("user.isActive = :isActive", {isActive: true})
//                                         .getMany();
                
//     console.log(`Active authors with detailed info: `);
    
//     authorWithPostsCounts.forEach(user => {
//         const publishedPosts = user.posts?.filter(p => p.isPublished).length || 0;
//      console.log(`  ${user.fullName} - ${publishedPosts} published posts`);    
//     })
}