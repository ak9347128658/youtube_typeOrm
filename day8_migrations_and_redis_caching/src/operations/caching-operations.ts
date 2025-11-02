import { AppDataSource } from "../data-source";
import { Post } from "../entities/Post";
import { CacheService } from "../services/CacheService";

const cacheService = new CacheService();
const postRepository = AppDataSource.getRepository(Post);

export class CachingOperations {
    // Create a new post with cache invalidation
    static async createPost(title: string, content: string): Promise<Post> {
        const post = new Post();
        post.title = title;
        post.content = content;
        
        const savedPost = await postRepository.save(post);
        // Invalidate the posts list cache
        await cacheService.delete('posts:all');
        return savedPost;
    }

    // Get all posts with caching
    static async getAllPosts(): Promise<Post[]> {
        // Try to get from cache first
        const cachedPosts = await cacheService.get<Post[]>('posts:all');
        if (cachedPosts) {
            console.log('Returning posts from cache');
            return cachedPosts;
        }

        // If not in cache, get from database
        console.log('Fetching posts from database');
        const posts = await postRepository.find();
        
        // Store in cache for future requests
        await cacheService.set('posts:all', posts);
        return posts;
    }

    // Get single post with caching
    static async getPostById(id: number): Promise<Post | null> {
        const cacheKey = cacheService.generateKey('post', id);
        
        // Try to get from cache
        const cachedPost = await cacheService.get<Post>(cacheKey);
        if (cachedPost) {
            console.log('Returning post from cache');
            return cachedPost;
        }

        // If not in cache, get from database
        console.log('Fetching post from database');
        const post = await postRepository.findOne({ where: { id } });
        if (post) {
            await cacheService.set(cacheKey, post);
        }
        return post;
    }

    // Update post with cache invalidation
    static async updatePost(id: number, title: string, content: string): Promise<Post | null> {
        const post = await postRepository.findOne({ where: { id } });
        if (!post) return null;

        post.title = title;
        post.content = content;
        
        const updatedPost = await postRepository.save(post);
        
        // Invalidate both individual post cache and posts list cache
        const cacheKey = cacheService.generateKey('post', id);
        await Promise.all([
            cacheService.delete(cacheKey),
            cacheService.delete('posts:all')
        ]);

        return updatedPost;
    }

    // Delete post with cache invalidation
    static async deletePost(id: number): Promise<boolean> {
        const result = await postRepository.delete(id);
        
        if (result.affected && result.affected > 0) {
            // Invalidate both individual post cache and posts list cache
            const cacheKey = cacheService.generateKey('post', id);
            await Promise.all([
                cacheService.delete(cacheKey),
                cacheService.delete('posts:all')
            ]);
            return true;
        }
        return false;
    }
}
