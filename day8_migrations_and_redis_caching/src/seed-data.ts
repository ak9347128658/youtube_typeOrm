import { faker } from '@faker-js/faker';
import { AppDataSource } from './data-source';
import { User } from './entities/User';
import { Post } from './entities/Post';
import { Product } from './entities/Product';
import { Category } from './entities/Category';
import { Order } from './entities/Order';
import { OrderItem } from './entities/OrderItem';

export async function seedData() {
    try {
        console.log('🌱 Starting data seeding...');

        // Clear all tables
        const repositories = [
            AppDataSource.getRepository(OrderItem),
            AppDataSource.getRepository(Order),
            AppDataSource.getRepository(Post),
            AppDataSource.getRepository(Product),
            AppDataSource.getRepository(Category),
            AppDataSource.getRepository(User),
        ];

        for (const repo of repositories) {
            await repo.query(`TRUNCATE TABLE ${repo.metadata.tableName} CASCADE`);
        }

        // Seed Categories
        const categoryRepository = AppDataSource.getRepository(Category);
        const categories = [];
        
        // Create root category
        const rootCategory = categoryRepository.create({
            name: 'All Categories',
            slug: 'all-categories',
            description: 'Root category for all products',
            isActive: true,
            sortOrder: 0,
            imageUrl: faker.image.url(),
            metadata: {
                seoTitle: 'All Categories',
                seoDescription: 'Browse all product categories',
                keywords: ['categories', 'products']
            }
        });
        const savedRoot = await categoryRepository.save(rootCategory);
        categories.push(savedRoot);
        
        const categoryNames = [
            'Electronics', 'Clothing', 'Books', 'Home & Garden', 
            'Sports', 'Toys', 'Beauty', 'Automotive'
        ];

        for (const name of categoryNames) {
            const category = categoryRepository.create({
                name,
                slug: name.toLowerCase().replace(/\s+/g, '-'),
                description: faker.lorem.paragraph(),
                isActive: true,
                sortOrder: faker.number.int({ min: 1, max: 100 }),
                imageUrl: faker.image.url(),
                metadata: {
                    seoTitle: `${name} - Best Products`,
                    seoDescription: faker.lorem.sentence(),
                    keywords: [name.toLowerCase(), 'products', 'sale']
                },
                parent: savedRoot
            });
            categories.push(await categoryRepository.save(category));
        }

        console.log(`✅ Created ${categories.length} categories`);

        // Seed Users
        const userRepository = AppDataSource.getRepository(User);
        const users = [];

        for (let i = 0; i < 100; i++) {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const user = userRepository.create({
                username: faker.internet.username(),
                email: faker.internet.email(),
                firstName,
                lastName,
                bio: faker.lorem.paragraph(),
                isActive: faker.datatype.boolean(0.9), // 90% active
                dateOfBirth: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }),
                role: faker.helpers.arrayElement(['admin', 'user', 'moderator']),
                balance: faker.number.float({ min: 0, max: 1000, multipleOf: 0.01 }),
                preferences: {
                    theme: faker.helpers.arrayElement(['light', 'dark', 'auto']),
                    notifications: faker.datatype.boolean(),
                    language: faker.helpers.arrayElement(['en', 'es', 'fr', 'de'])
                }
            });
            users.push(await userRepository.save(user));
        }

        console.log(`✅ Created ${users.length} users`);

        // Seed Products
        const productRepository = AppDataSource.getRepository(Product);
        const products = [];

        for (let i = 0; i < 200; i++) {
            const product = productRepository.create({
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                sku: faker.string.alphanumeric(10).toUpperCase(),
                price: faker.number.float({ min: 10, max: 1000, multipleOf: 0.01 }),
                compareAtPrice: faker.datatype.boolean(0.3) ? faker.number.float({ min: 1000, max: 1500, multipleOf: 0.01 }) : undefined,
                stockQuantity: faker.number.int({ min: 0, max: 100 }),
                isActive: faker.datatype.boolean(0.95), // 95% active
                weight: faker.number.float({ min: 0.1, max: 50, multipleOf: 0.01 }),
                dimensions: {
                    length: faker.number.float({ min: 1, max: 100, multipleOf: 0.1 }),
                    width: faker.number.float({ min: 1, max: 100, multipleOf: 0.1 }),
                    height: faker.number.float({ min: 1, max: 100, multipleOf: 0.1 })
                },
                images: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.image.url()),
                tags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.commerce.productAdjective()),
                attributes: {
                    color: faker.color.human(),
                    size: faker.helpers.arrayElement(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
                    material: faker.commerce.productMaterial()
                },
                categoryId: faker.helpers.arrayElement(categories).id
            });
            products.push(await productRepository.save(product));
        }

        console.log(`✅ Created ${products.length} products`);

        // Seed Posts
        const postRepository = AppDataSource.getRepository(Post);
        const posts = [];

        for (let i = 0; i < 150; i++) {
            const title = faker.lorem.sentence({ min: 3, max: 8 });
            const post = postRepository.create({
                title,
                content: faker.lorem.paragraphs(faker.number.int({ min: 3, max: 10 })),
                slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
                isPublished: faker.datatype.boolean(0.8), // 80% published
                status: faker.helpers.arrayElement(['draft', 'published', 'archived']),
                viewCount: faker.number.int({ min: 0, max: 10000 }),
                likeCount: faker.number.int({ min: 0, max: 1000 }),
                tags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.lorem.word()),
                metadata: {
                    seoTitle: title,
                    seoDescription: faker.lorem.sentence(),
                    featuredImageUrl: faker.image.url()
                },
                authorId: faker.helpers.arrayElement(users).id,
                publishedAt: faker.datatype.boolean(0.8) ? faker.date.recent({ days: 365 }) : undefined
            });
            posts.push(await postRepository.save(post));
        }

        console.log(`✅ Created ${posts.length} posts`);

        // Seed Orders
        const orderRepository = AppDataSource.getRepository(Order);
        const orderItemRepository = AppDataSource.getRepository(OrderItem);
        const orders = [];

        for (let i = 0; i < 300; i++) {
            const orderProducts = faker.helpers.arrayElements(products, { min: 1, max: 5 });
            let totalAmount = 0;

            const order = orderRepository.create({
                orderNumber: `ORD-${Date.now()}-${faker.number.int({ min: 100, max: 999 })}`,
                status: faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
                taxAmount: 0,
                shippingAmount: faker.number.float({ min: 0, max: 50, multipleOf: 0.01 }),
                discountAmount: faker.number.float({ min: 0, max: 100, multipleOf: 0.01 }),
                shippingAddress: {
                    street: faker.location.streetAddress(),
                    city: faker.location.city(),
                    state: faker.location.state(),
                    zipCode: faker.location.zipCode(),
                    country: faker.location.country()
                },
                billingAddress: {
                    street: faker.location.streetAddress(),
                    city: faker.location.city(),
                    state: faker.location.state(),
                    zipCode: faker.location.zipCode(),
                    country: faker.location.country()
                },
                notes: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : undefined,
                customerId: faker.helpers.arrayElement(users).id,
                totalAmount: 0 // Will be calculated after order items
            });

            const savedOrder = await orderRepository.save(order);

            // Create order items
            for (const product of orderProducts) {
                const quantity = faker.number.int({ min: 1, max: 3 });
                const unitPrice = product.price;
                const orderItem = orderItemRepository.create({
                    quantity,
                    unitPrice,
                    totalPrice: quantity * unitPrice,
                    productSnapshot: {
                        name: product.name,
                        description: product.description || '',
                        image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : undefined
                    },
                    orderId: savedOrder.id,
                    productId: product.id
                });
                await orderItemRepository.save(orderItem);
                totalAmount += orderItem.totalPrice;
            }

            // Update order with total amount
            savedOrder.totalAmount = totalAmount + savedOrder.shippingAmount - savedOrder.discountAmount;
            savedOrder.taxAmount = totalAmount * 0.08; // 8% tax
            savedOrder.totalAmount += savedOrder.taxAmount;
            
            orders.push(await orderRepository.save(savedOrder));
        }

        console.log(`✅ Created ${orders.length} orders`);
        console.log('🎉 Data seeding completed successfully!');

        return {
            categories: categories.length,
            users: users.length,
            products: products.length,
            posts: posts.length,
            orders: orders.length
        };

    } catch (error) {
        console.error('❌ Error seeding data:', error);
        throw error;
    }
}
