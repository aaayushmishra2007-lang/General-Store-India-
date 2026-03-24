const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// In-memory product database
const products = [
    {
        id: 1,
        name: "Samsung Galaxy S24",
        category: "Electronics",
        price: 74999,
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500"
    },
    {
        id: 2,
        name: "Apple iPhone 15",
        category: "Electronics",
        price: 79999,
        image: "https://images.unsplash.com/photo-1592286927505-b0d6e6a59a60?w=500"
    },
    {
        id: 3,
        name: "OnePlus Nord 3",
        category: "Electronics",
        price: 33999,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500"
    },
    {
        id: 4,
        name: "Dell XPS 15 Laptop",
        category: "Electronics",
        price: 124999,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500"
    },
    {
        id: 5,
        name: "HP Pavilion Gaming",
        category: "Electronics",
        price: 65999,
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500"
    },
    {
        id: 6,
        name: "MacBook Air M2",
        category: "Electronics",
        price: 114999,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500"
    },
    {
        id: 7,
        name: "Men's Cotton Shirt",
        category: "Fashion",
        price: 899,
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500"
    },
    {
        id: 8,
        name: "Women's Ethnic Kurta",
        category: "Fashion",
        price: 1499,
        image: "https://images.unsplash.com/photo-1583391733981-5babce6fda2e?w=500"
    },
    {
        id: 9,
        name: "Men's Denim Jeans",
        category: "Fashion",
        price: 1299,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500"
    },
    {
        id: 10,
        name: "Women's Summer Dress",
        category: "Fashion",
        price: 1799,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500"
    },
    {
        id: 11,
        name: "Leather Handbag",
        category: "Fashion",
        price: 2499,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500"
    },
    {
        id: 12,
        name: "Sports Sneakers",
        category: "Fashion",
        price: 2999,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
    },
    {
        id: 13,
        name: "Ergonomic Office Chair",
        category: "Home",
        price: 8999,
        image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500"
    },
    {
        id: 14,
        name: "LED Table Lamp",
        category: "Home",
        price: 1299,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500"
    },
    {
        id: 15,
        name: "Cotton Bed Sheet Set",
        category: "Home",
        price: 1999,
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500"
    },
    {
        id: 16,
        name: "Wall Clock Modern",
        category: "Home",
        price: 799,
        image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500"
    },
    {
        id: 17,
        name: "Decorative Cushion Set",
        category: "Home",
        price: 1499,
        image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500"
    },
    {
        id: 18,
        name: "Kitchen Cookware Set",
        category: "Home",
        price: 3999,
        image: "https://images.unsplash.com/photo-1584990347449-39b4aa2d2b8f?w=500"
    },
    {
        id: 19,
        name: "Realme Narzo 60",
        category: "Electronics",
        price: 18999,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500"
    },
    {
        id: 20,
        name: "Xiaomi Smart TV 43",
        category: "Electronics",
        price: 28999,
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500"

    }
    {
        id: 21,  // Use next available ID
        name: "Iphone 17 Pro max",
        category: "Electronics",  // or "Fashion" or "Home"
        price: 159999,  // Price in rupees
        image: "https://images.unsplash.com/photo-xxxxx?w=500"
    },
];

// API Routes
app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(` General Store India server running on http://localhost:${PORT}`);
    console.log(`📦 Serving ${products.length} products`);
});

module.exports = app;