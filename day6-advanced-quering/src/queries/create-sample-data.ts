import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { UserProfile } from "../entities/UserProfile";
import { Post } from "../entities/Post";
import { Comment } from "../entities/Comment";
import { faker } from "@faker-js/faker";

export async function createSampleData() {
    console.log("🚀 Starting sample data generation...");

    const userRepo = AppDataSource.getRepository(User);
    const profileRepo = AppDataSource.getRepository(UserProfile);
    const postRepo = AppDataSource.getRepository(Post);
    const commentRepo = AppDataSource.getRepository(Comment);

    // Clean up old data
    // console.log("🧹 Clearing old data...");
    // await commentRepo.delete({});
    // await postRepo.delete({});
    // await profileRepo.delete({});
    // await userRepo.delete({});

    // --- Create Users ---
    console.log("👥 Creating users...");
    const roles: Array<"admin" | "editor" | "author" | "reader"> = ["admin", "editor", "author", "reader"];

    const users: User[] = [];

    for (let i = 0; i < 20; i++) {
        const user = new User();
        user.firstName = faker.person.firstName();
        user.lastName = faker.person.lastName();
        user.email = faker.internet.email({ firstName: user.firstName, lastName: user.lastName });
        user.username = faker.internet.username({ firstName: user.firstName, lastName: user.lastName });
        user.role = faker.helpers.arrayElement(roles);
        user.isActive = faker.datatype.boolean();
        user.reputation = parseFloat((Math.random() * 100).toFixed(2));
        user.postCount = 0;
        user.lastLoginDate = faker.datatype.boolean() ? faker.date.recent({ days: 60 }) : undefined;
        users.push(user);
    }

    await userRepo.save(users);

    // --- Create Profiles ---
    console.log("🧾 Creating profiles...");
    const profiles: UserProfile[] = [];

    for (const user of users) {
        const profile = new UserProfile();
        profile.bio = faker.lorem.sentences(2);
        profile.website = faker.internet.url();
        profile.location = faker.location.city();
        profile.birthDate = faker.date.birthdate({ min: 1970, max: 2005, mode: "year" });
        profile.company = faker.company.name();
        profile.jobTitle = faker.person.jobTitle();
        profile.socialLinks = {
            twitter: `https://twitter.com/${user.username}`,
            linkedin: `https://linkedin.com/in/${user.username}`,
            github: `https://github.com/${user.username}`,
        };
        profile.avatarUrl = faker.image.avatar();
        profile.user = user;

        profiles.push(profile);
    }

    await profileRepo.save(profiles);

    // --- Create Posts ---
    console.log("📝 Creating posts...");
    const posts: Post[] = [];

    const categories = ["Technology", "Programming", "Lifestyle", "Travel", "Education"];
    const tags = ["typescript", "javascript", "node", "react", "aws", "cloud", "devops"];

    for (const user of users.filter(u => ["admin", "editor", "author"].includes(u.role))) {
        const postCount = faker.number.int({ min: 2, max: 6 });
        user.postCount = postCount;

        for (let i = 0; i < postCount; i++) {
            const post = new Post();
            post.title = faker.lorem.sentence(5);
            post.slug = faker.helpers.slugify(post.title.toLowerCase()) + "-" + faker.string.alphanumeric(6).toLowerCase();
            post.content = faker.lorem.paragraphs(3);
            post.excerpt = faker.lorem.sentences(2);
            post.category = faker.helpers.arrayElement(categories);
            post.tags = faker.helpers.arrayElements(tags, faker.number.int({ min: 1, max: 3 }));
            post.isPublished = faker.datatype.boolean();
            post.isFeatured = faker.datatype.boolean();
            post.viewCount = faker.number.int({ min: 0, max: 5000 });
            post.likeCount = faker.number.int({ min: 0, max: 500 });
            post.commentCount = 0;
            post.rating = parseFloat((Math.random() * 5).toFixed(2));
            post.publishedAt = post.isPublished ? faker.date.recent({ days: 90 }) : undefined;
            post.author = user;

            posts.push(post);
        }
    }

    await postRepo.save(posts);
    await userRepo.save(users);

    // --- Create Comments ---
    console.log("💬 Creating comments...");
    const comments: Comment[] = [];

    for (const post of posts) {
        const commentCount = faker.number.int({ min: 1, max: 5 });
        post.commentCount = commentCount;

        for (let i = 0; i < commentCount; i++) {
            const comment = new Comment();
            comment.content = faker.lorem.sentences(2);
            comment.isApproved = faker.datatype.boolean();
            comment.likeCount = faker.number.int({ min: 0, max: 20 });
            comment.post = post;
            comment.author = faker.helpers.arrayElement(users);
            comments.push(comment);
        }
    }

    await commentRepo.save(comments);
    await postRepo.save(posts);

    console.log("✅ Sample data created successfully!");
    console.log(`👥 Users: ${users.length}, 📝 Posts: ${posts.length}, 💬 Comments: ${comments.length}`);
}

// Run directly with `npx ts-node src/seeds/create-sample-data.ts`
if (require.main === module) {
    createSampleData().catch(err => {
        console.error("❌ Error creating sample data:", err);
        process.exit(1);
    });
}
