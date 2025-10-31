import { faker } from '@faker-js/faker';
import { AppDataSource } from './data-source';
import { User } from './entities/User';
import { Category } from './entities/Category';
import { Product } from './entities/Product';
import { Order } from './entities/Order';
import { OrderItem } from './entities/OrderItem';
import { Review } from './entities/Review';

export async function seedData() {
    const userRepository = AppDataSource.getRepository(User);
    const categoryRepository = AppDataSource.getRepository(Category);
    const productRepository = AppDataSource.getRepository(Product);
    const orderRepository = AppDataSource.getRepository(Order);
    const orderItemRepository = AppDataSource.getRepository(OrderItem);
    const reviewRepository = AppDataSource.getRepository(Review);

    // Clear existing data
    // await reviewRepository.clear();
    // await orderItemRepository.clear();
    // await orderRepository.clear();
    // await productRepository.clear();
    // await categoryRepository.clear();
    // await userRepository.clear();

    // Seed Categories
    const categories: Category[] = [];
    const usedNames = new Set<string>();
    for (let i = 0; i < 10; i++) {
        let name: string;
        do {
            name = faker.commerce.department();
        } while (usedNames.has(name));
        usedNames.add(name);

        const category = new Category();
        category.name = name;
        category.description = faker.lorem.sentence();
        category.slug = faker.helpers.slugify(category.name);
        category.isActive = faker.datatype.boolean();
        categories.push(category);
    }
    await categoryRepository.save(categories);

    // Seed Products
    const products: Product[] = [];
    const usedSkus = new Set<string>();
    for (let i = 0; i < 50; i++) {
        let sku: string;
        do {
            sku = faker.string.alphanumeric(10).toUpperCase();
        } while (usedSkus.has(sku));
        usedSkus.add(sku);

        const product = new Product();
        product.name = faker.commerce.productName();
        product.description = faker.lorem.paragraph();
        product.sku = sku;
        product.price = parseFloat(faker.commerce.price());
        product.compareAtPrice = faker.datatype.boolean() ? parseFloat(faker.commerce.price({ min: product.price + 10, max: product.price + 50 })) : undefined;
        product.stockQuantity = faker.number.int({ min: 0, max: 100 });
        product.isActive = faker.datatype.boolean();
        product.averageRating = parseFloat(faker.number.float({ min: 0, max: 5, fractionDigits: 1 }).toFixed(1));
        product.reviewCount = faker.number.int({ min: 0, max: 100 });
        product.salesCount = faker.number.int({ min: 0, max: 1000 });
        product.brand = faker.company.name().substring(0, 100);
        product.weight = faker.datatype.boolean() ? parseFloat(faker.number.float({ min: 0.1, max: 10, fractionDigits: 2 }).toFixed(2)) : undefined;
        product.category = faker.helpers.arrayElement(categories);
        products.push(product);
    }
    await productRepository.save(products);

    // Seed Users
    const users: User[] = [];
    const usedEmails = new Set<string>();
    for (let i = 0; i < 100; i++) {
        let email: string;
        do {
            email = faker.internet.email();
        } while (usedEmails.has(email));
        usedEmails.add(email);

        const user = new User();
        user.firstName = faker.person.firstName();
        user.lastName = faker.person.lastName();
        user.email = email;
        user.city = faker.location.city().substring(0, 100);
        user.country = faker.location.country().substring(0, 50);
        user.birthDate = faker.datatype.boolean() ? faker.date.birthdate() : undefined;
        user.isActive = faker.datatype.boolean();
        user.totalSpent = parseFloat(faker.commerce.price({ min: 0, max: 10000 }));
        users.push(user);
    }
    await userRepository.save(users);

    // Seed Orders
    const orders: Order[] = [];
    const usedOrderNumbers = new Set<string>();
    for (let i = 0; i < 200; i++) {
        let orderNumber: string;
        do {
            orderNumber = faker.string.alphanumeric(10).toUpperCase();
        } while (usedOrderNumbers.has(orderNumber));
        usedOrderNumbers.add(orderNumber);

        const order = new Order();
        order.orderNumber = orderNumber;
        order.status = faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']);
        order.totalAmount = parseFloat(faker.commerce.price({ min: 10, max: 1000 }));
        order.shippingCost = parseFloat(faker.commerce.price({ min: 0, max: 50 }));
        order.taxAmount = parseFloat((order.totalAmount * 0.1).toFixed(2));
        order.shippingAddress = faker.location.streetAddress().substring(0, 200);
        order.shippingCity = faker.location.city().substring(0, 100);
        order.shippingCountry = faker.location.country().substring(0, 50);
        order.shippedAt = order.status === 'shipped' || order.status === 'delivered' ? faker.date.recent() : undefined;
        order.deliveredAt = order.status === 'delivered' ? faker.date.recent() : undefined;
        order.customer = faker.helpers.arrayElement(users);
        orders.push(order);
    }
    await orderRepository.save(orders);

    // Seed OrderItems
    const orderItems: OrderItem[] = [];
    for (const order of orders) {
        const itemCount = faker.number.int({ min: 1, max: 5 });
        const selectedProducts = faker.helpers.arrayElements(products, itemCount);
        for (const product of selectedProducts) {
            const orderItem = new OrderItem();
            orderItem.quantity = faker.number.int({ min: 1, max: 10 });
            orderItem.unitPrice = product.price;
            orderItem.totalPrice = parseFloat((orderItem.quantity * orderItem.unitPrice).toFixed(2));
            orderItem.order = order;
            orderItem.product = product;
            orderItems.push(orderItem);
        }
    }
    await orderItemRepository.save(orderItems);

    // Seed Reviews
    const reviews: Review[] = [];
    const usedReviewPairs = new Set<string>();
    for (let i = 0; i < 150; i++) {
        let user: User;
        let product: Product;
        let pairKey: string;
        do {
            user = faker.helpers.arrayElement(users);
            product = faker.helpers.arrayElement(products);
            pairKey = `${user.id}-${product.id}`;
        } while (usedReviewPairs.has(pairKey));
        usedReviewPairs.add(pairKey);

        const review = new Review();
        review.rating = faker.number.int({ min: 1, max: 5 });
        review.comment = faker.lorem.sentences(2);
        review.isVerified = faker.datatype.boolean();
        review.helpfulCount = faker.number.int({ min: 0, max: 100 });
        review.user = user;
        review.product = product;
        reviews.push(review);
    }
    await reviewRepository.save(reviews);

    console.log('Seeding completed successfully!');
}
