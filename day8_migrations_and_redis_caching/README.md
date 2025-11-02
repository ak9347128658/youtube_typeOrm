# TypeORM Day 8: Migrations and Redis Caching

A comprehensive demonstration of TypeORM migrations, entity events, and advanced Redis caching strategies.

## 🚀 Features Covered

### 🎭 TypeORM Events
- **BeforeInsert/AfterInsert**: Triggered during entity creation
- **BeforeUpdate/AfterUpdate**: Triggered during entity updates
- **BeforeRemove/AfterRemove**: Triggered during entity deletion
- **AfterLoad**: Triggered when entity is loaded from database
- **Practical Uses**:
  - Data validation and transformation
  - Cache invalidation
  - Audit logging
  - Calculated fields

### 📦 TypeORM Migrations
- **Database Version Control**: Manage schema changes incrementally
- **Three Migration Files**:
  1. `InitialSchema`: Creates all tables with relationships and constraints
  2. `AddIndexes`: Adds performance indexes and full-text search capabilities
  3. `AddCachingOptimizations`: Adds cache monitoring and materialized views
- **Advanced Features**:
  - Foreign key relationships
  - JSONB field optimization
  - Full-text search indexes
  - Partial indexes for filtered queries
  - Materialized views for aggregations
  - Database triggers and stored procedures

### 🚀 Redis Caching
- **Comprehensive CacheService**: Advanced Redis client with multiple caching patterns
- **Caching Strategies**:
  - **Cache-Aside**: Load from cache, fallback to database
  - **Write-Through**: Write to cache and database simultaneously
  - **Write-Behind**: Write to cache first, database later
- **Advanced Features**:
  - Tag-based cache invalidation
  - Pattern-based cache invalidation
  - Namespace isolation
  - Distributed locking
  - Performance monitoring
  - Queue-based operations
  - Cache warming strategies
  - Bulk operations (mget/mset)

## 📁 Project Structure

```
src/
├── entities/           # TypeORM entities with events
│   ├── User.ts        # User entity with events and relations
│   ├── Post.ts        # Post entity with author relationship
│   ├── Product.ts     # Product entity with category
│   ├── Category.ts    # Category entity with tree structure
│   ├── Order.ts       # Order entity with customer relation
│   ├── OrderItem.ts   # Order items with product snapshot
│   └── index.ts       # Entity exports
├── migrations/         # Database migration files
│   ├── InitialSchema.ts      # Initial database setup
│   ├── AddIndexes.ts         # Performance indexes
│   └── AddCachingOptimizations.ts # Cache monitoring
├── operations/         # Caching operation examples
│   └── caching-operations.ts # All caching patterns
├── services/          # Service layer
│   └── CacheService.ts # Advanced Redis cache service
├── data-source.ts     # TypeORM configuration with Redis cache
├── seed-data.ts       # Sample data generation
└── app.ts            # Main application with demonstrations
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- Redis server

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database
Update `src/data-source.ts` with your PostgreSQL connection details:
```typescript
export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "your_username",
    password: "your_password",
    database: "typeorm_course",
    // ... other settings
});
```

### 3. Start Redis Server
```bash
# Using Docker
docker run -p 6379:6379 redis:alpine

# Or install locally and run
redis-server
```

### 4. Run Migrations
```bash
# Run all pending migrations
npm run migration:run

# Check migration status
npm run migration:show

# Revert last migration
npm run migration:revert
```

### 5. Start Application
```bash
# Run once
npm start

# Development mode with auto-reload
npm run dev
```

## 🎯 Key Learning Objectives

### TypeORM Events
```typescript
@Entity()
export class User {
    @BeforeInsert()
    beforeInsert() {
        console.log('Before inserting user');
        this.email = this.email.toLowerCase();
    }

    @AfterUpdate()
    afterUpdate() {
        console.log('User updated');
        // Trigger cache invalidation
    }
}
```

### Migration Examples
```typescript
export class AddIndexes implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create performance index
        await queryRunner.query(`
            CREATE INDEX "IDX_USERS_EMAIL" ON "users" ("email")
        `);
        
        // Create full-text search index
        await queryRunner.query(`
            CREATE INDEX IDX_USERS_FULLTEXT ON users 
            USING gin(to_tsvector('english', username || ' ' || email))
        `);
    }
}
```

### Caching Patterns
```typescript
// Cache-Aside Pattern
export async function cachedFindUserById(id: number): Promise<User | null> {
    const cacheKey = `user:${id}`;
    
    // Try cache first
    let user = await cacheService.get<User>(cacheKey);
    
    if (!user) {
        // Fallback to database
        user = await userRepository.findOne({ where: { id } });
        if (user) {
            // Store in cache
            await cacheService.set(cacheKey, user, { ttl: 600 });
        }
    }
    
    return user;
}

// Write-Through Pattern
export async function createUserWithCache(userData: Partial<User>): Promise<User> {
    const user = await userRepository.save(userData);
    
    // Immediately cache
    await cacheService.set(`user:${user.id}`, user, {
        ttl: 600,
        tags: ['user', `user:${user.id}`]
    });
    
    return user;
}
```

## 📊 Performance Features

### Database Optimizations
- **Indexes**: B-tree, GIN, and partial indexes for optimal query performance
- **Full-Text Search**: PostgreSQL text search capabilities
- **Materialized Views**: Pre-computed aggregations for statistics
- **Connection Pooling**: Optimized database connections

### Cache Optimizations
- **Multi-Level Caching**: Entity, query, and aggregation caching
- **Tag-Based Invalidation**: Invalidate related cache entries efficiently
- **Performance Monitoring**: Hit ratios, memory usage, and operation tracking
- **Distributed Locking**: Prevent race conditions in concurrent operations

## 🔧 Available Scripts

```bash
# Application
npm start              # Run the application
npm run dev           # Development mode with auto-reload

# Migrations
npm run migration:run      # Run pending migrations
npm run migration:revert   # Revert last migration
npm run migration:show     # Show migration status
npm run migration:generate # Generate migration from entity changes
npm run migration:create   # Create new empty migration

# Schema Management
npm run schema:sync   # Synchronize database schema (development only)
npm run schema:drop   # Drop all database tables
```

## 🎓 Educational Topics

### 1. TypeORM Events
Learn how to use entity lifecycle events for:
- Data validation and transformation
- Audit logging
- Cache invalidation
- Business logic triggers

### 2. Database Migrations
Master database version control with:
- Incremental schema changes
- Data transformations
- Index creation and optimization
- Cross-environment consistency

### 3. Redis Caching Strategies
Implement enterprise-grade caching:
- Multiple caching patterns
- Cache invalidation strategies
- Performance monitoring
- Distributed operations

### 4. Performance Optimization
Apply real-world optimizations:
- Database indexing strategies
- Query optimization
- Connection pooling
- Memory management

## 🌟 Real-World Applications

This project demonstrates patterns used in:
- **E-commerce Platforms**: Product catalogs, user sessions, cart management
- **Content Management**: Article caching, user-generated content
- **Social Media**: User profiles, post feeds, notification systems
- **Analytics Dashboards**: Real-time metrics, aggregated statistics
- **API Services**: Response caching, rate limiting, session management

## 🚨 Important Notes

### Development vs Production
- **Development**: Uses synchronize: true for automatic schema updates
- **Production**: Always use migrations for schema changes
- **Caching**: Configure Redis clustering for high availability

### Performance Considerations
- Monitor cache hit ratios regularly
- Use appropriate TTL values for different data types
- Implement cache warming for critical data
- Set up proper database indexes before production

### Security
- Never expose Redis to the internet without authentication
- Use environment variables for sensitive configuration
- Implement proper error handling and logging

## 🔗 Advanced Topics

For production deployments, consider:
- Redis Cluster setup for high availability
- Database read replicas for scaling
- Connection pooling optimization
- Monitoring and alerting systems
- Automated backup strategies

## 📝 License

This project is for educational purposes. Feel free to use and modify for learning TypeORM, Redis, and database optimization techniques.