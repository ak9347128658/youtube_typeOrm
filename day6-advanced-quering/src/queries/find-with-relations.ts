import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Post } from "../entities/Post";



export async function findWithRelations() {
    const userRepository = AppDataSource.getRepository(User);
    const postRepository = AppDataSource.getRepository(Post);

    
    console.log("=== Find with Relations ===");
    // 1. Load single relation
    // const usersWithProfiles = await userRepository.find({
    //     relations: ["profile"]
    // });
    // console.log(`👤 Users with profiles loaded: ${usersWithProfiles.length}`);    


    // 2. Load multiple relations
    // const usersWithEverything = await userRepository.find({
    //     relations: ["profile", "posts", "comments"]
    // });
    // console.log(`🌟 Users with all relations: ${JSON.stringify(usersWithEverything[0], null, 2)}`);    

        // 3. Nested relations
    const postsWithAuthorProfiles = await postRepository.find({
        relations: ["author", "author.profile", "comments", "comments.author"]
    });
    console.log(`📖 Posts with nested relations: ${JSON.stringify(postsWithAuthorProfiles[0], null, 2)}`);
}