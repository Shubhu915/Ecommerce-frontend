const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for Seed...');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const categories = [
    { name: 'Electronics', description: 'Gadgets and gear' },
    { name: 'Clothing', description: 'Fashionable apparel' },
    { name: 'Home & Kitchen', description: 'Everything for your home' },
    { name: 'Books', description: 'Read and learn' },
    { name: 'Beauty', description: 'Skincare and makeup' },
    { name: 'Sports', description: 'Fitness and outdoor gear' },
    { name: 'Toys', description: 'Games and fun' },
    { name: 'Groceries', description: 'Daily essentials' }
];

const axios = require('axios');

const seedData = async () => {
    try {
        await connectDB();

        console.log('Clearing existing data...');
        await Product.deleteMany();
        await Category.deleteMany();

        console.log('Fetching real products from DummyJSON...');
        const response = await axios.get('https://dummyjson.com/products?limit=500');
        const externalProducts = response.data.products;

        const categoryMap = {}; // To store created category IDs

        console.log('Processing products and categories...');
        const productsToInsert = [];
        const itemsByCategory = {};

        // Group external products by category
        for (const item of externalProducts) {
            const catName = item.category.charAt(0).toUpperCase() + item.category.slice(1);
            if (!itemsByCategory[catName]) itemsByCategory[catName] = [];
            itemsByCategory[catName].push(item);
        }

        for (const [catName, items] of Object.entries(itemsByCategory)) {
            // 1. Ensure category exists
            if (!categoryMap[catName]) {
                let category = await Category.findOne({ name: catName });
                if (!category) {
                    category = await Category.create({ 
                        name: catName, 
                        description: `Premium ${catName} products` 
                    });
                }
                categoryMap[catName] = category._id;
            }

            // 2. We need at least 50 products per category
            // If we have fewer, we will duplicate them with variations to reach the target
            const targetPerCategory = 50;
            for (let i = 0; i < targetPerCategory; i++) {
                const item = items[i % items.length]; // Cycle through available items
                const variation = i >= items.length ? ` (Model ${Math.floor(i / items.length) + 1})` : '';

                productsToInsert.push({
                    name: item.title + variation,
                    slug: (item.title + variation).split(' ').join('-').toLowerCase() + '-' + Math.floor(Math.random() * 10000),
                    description: item.description,
                    price: Math.max(1, item.price + (Math.floor(Math.random() * 20) - 10)), // Ensure price >= 1
                    stock: Math.floor(Math.random() * 200) + 20,
                    ratings: item.rating,
                    category: categoryMap[catName],
                    images: item.images.map(img => ({ url: img, alt: item.title })),
                    aiMetadata: {
                        primaryColor: ['Black', 'Silver', 'White', 'Blue', 'Gold', 'Red', 'Grey'][Math.floor(Math.random() * 7)],
                        style: ['Modern', 'Premium', 'Ergonomic', 'Slim', 'Classic'][Math.floor(Math.random() * 5)],
                        season: 'All-Year',
                        keywords: [catName.toLowerCase(), item.brand, 'real-product', 'v1.1'],
                        embedding: Array.from({ length: 1536 }, () => Math.random())
                    }
                });
            }
        }

        // Logic to reach total 500 if categories * 50 isn't enough
        // Based on DummyJSON categories (~20), 20 * 50 = 1000 products, which covers the 500 requirement.

        console.log(`Inserting ${productsToInsert.length} real-based products...`);
        await Product.insertMany(productsToInsert);

        console.log(`✅ Successfully seeded ${productsToInsert.length} products with at least 50 per category!`);
        process.exit();
    } catch (error) {
        console.error(`Error seeding real products: ${error.message}`);
        process.exit(1);
    }
};

seedData();
