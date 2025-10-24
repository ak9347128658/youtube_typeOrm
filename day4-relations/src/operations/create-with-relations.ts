import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Profile } from "../entities/Profile";
import { Post } from "../entities/Post";

export async function createWithRelations() {
    const userRepository = AppDataSource.getRepository(User);
    const profileRepository = AppDataSource.getRepository(Profile);
    const postRepository = AppDataSource.getRepository(Post);

  
    // Method 1: create user with profile using cascade
    // const userWithProfile = new User();

    // userWithProfile.firstName = "Alice";
    // userWithProfile.lastName = "Johnson";
    // userWithProfile.email = "alice@example.com";

    // const profile = new Profile();

    // profile.bio = "Full-stack developer passionate about TypeScript";
    // profile.website = "https://alice-codes.com";
    // profile.phone = "+1-555-0123";
    // profile.dateOfBirth = new Date("1995-06-15");
    // profile.occupation = "Software Engineer";
    // profile.socialLinks = {
    //     twitter: "@alice_codes",
    //     linkedin: "linkedin.com/in/alice-johnson",
    //     github: "github.com/alice-johnson"
    // };

    // userWithProfile.profile = profile;

    // const savedUser = await userRepository.save(userWithProfile);
    //   console.log("👤 User with profile created:", savedUser.fullName);

    // Method 2: create user and posts together
    // const authorUser = new User();
    // authorUser.firstName = "Bob";
    // authorUser.lastName = "Writer";
    // authorUser.email = "bob@example.com";

    //     // Create multiple posts
    // const post1 = new Post();
    // post1.title = "Getting Started with TypeORM";
    // post1.content = "TypeORM is a powerful Object-Relational Mapping library for TypeScript and JavaScript...";
    // post1.excerpt = "Learn the basics of TypeORM in this comprehensive guide.";
    // post1.isPublished = true;
    // post1.tags = ["typescript", "database", "orm"];
    // post1.publishedAt = new Date();

    // const post2 = new Post();
    // post2.title = "Advanced PostgreSQL Features";
    // post2.content = "PostgreSQL offers many advanced features that can boost your application performance...";
    // post2.excerpt = "Explore advanced PostgreSQL features for better performance.";
    // post2.isPublished = false;
    // post2.tags = ["postgresql", "database", "performance"];

    // authorUser.posts = [post1,post2]

    // const savedAuthor = await userRepository.save(authorUser);
    // console.log("✍️ Author with posts created:", savedAuthor.fullName);

    // Method 3: create relations separately (more control)
    const standaloneUser = await userRepository.save({
        firstName: "Charlie",
        lastName: "Developer",
        email: "charlie@example.com"
    })   

    const standlaloneProfile = await profileRepository.save({
        bio: "Mobile app devloper in React Native",
        occupation: "Mobile Developer",
        user: standaloneUser
    })

     console.log("📱 Standalone user and profile created");
}