import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Post } from "../entities/Post";

export async function updateWithRelations() {
    const userRepository = AppDataSource.getRepository(User);
    const postRepository = AppDataSource.getRepository(Post);


    // Method 1: Update profile through user

    // const userWithProfile = await userRepository.findOne({
    //     where: {email: "alice@example.com"},
    //     relations: ["profile"]
    // })

    // if(userWithProfile && userWithProfile.profile){
    //      userWithProfile.profile.bio = "Senior Full-stack Developer with 5+ years experience";
    //     userWithProfile.profile.website = "https://senior-alice-codes.com";
    //     userWithProfile.profile.socialLinks = {
    //         ...userWithProfile.profile.socialLinks,
    //         twitter: "@senior_alice_codes"
    //     };       

    //     await userRepository.save(userWithProfile)
    //       console.log("✏️ Profile updated through user");
    // }

    // Method 2: Add new posts to existing user
    // const author = await userRepository.findOne({
    //     where: {
    //         email: "bob@example.com"
    //     },
    //     relations: ["posts"]
    // })

    // if (author) {
    //     const newPost = new Post();
    //     newPost.title = "TypeORM Relations Explained";
    //     newPost.content = "Understanding how to work with relations in TypeORM...";
    //     newPost.excerpt = "Master TypeORM relations with practical examples.";
    //     newPost.tags = ["typeorm", "relations", "tutorial"];
    //     newPost.author = author;
    //     await postRepository.save(newPost);
    //     console.log("📝 New post added to existing author");
    // }

    // Method 3: Update post and change author
    const postToUpdate = await postRepository.findOne({
        where: {
            title: "Getting Started with TypeORM"
        },
        relations: ["author"]
    })

    const newAuthor = await userRepository.findOne({
        where: {
            email: "charlie@example.com"
        }
    })

    if (postToUpdate && newAuthor) {
        postToUpdate.title = "Getting Started with TypeORM (Updated)";
        postToUpdate.content += "\n\nUpdate: Added new examples and best practices.";
        postToUpdate.author = newAuthor;

        await postRepository.save(postToUpdate);
        console.log("🔄 Post updated and author changed")
    }
}