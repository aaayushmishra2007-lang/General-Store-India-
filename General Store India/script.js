// Global state
let allProducts = [];
let filteredProducts = [];
let cart = [];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const categoryChips = document.querySelectorAll('.category-chip');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const aiAssistantBtn = document.getElementById('aiAssistantBtn');
const aiModal = document.getElementById('aiModal');
const cartModal = document.getElementById('cartModal');
const closeAiModal = document.getElementById('closeAiModal');
const closeCartModal = document.getElementById('closeCartModal');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChatBtn');
const chatContainer = document.getElementById('chatContainer');
const cartItems = document.getElementById('cartItems');
const totalAmount = document.getElementById('totalAmount');
const checkoutBtn = document.getElementById('checkoutBtn');
const toast = document.getElementById('toast');

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadCart();
    initEventListeners();
});

// Load products from backend
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        allProducts = await response.json();
        filteredProducts = [...allProducts];
        renderProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Failed to load products', 'error');
    }
}

// Render products
function renderProducts() {
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<div class="empty-cart"><i class="fas fa-box-open"></i><p>No products found</p></div>';
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-testid="product-card-${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image" data-testid="product-image-${product.id}">
            <div class="product-info">
                <div class="product-category" data-testid="product-category-${product.id}">${product.category}</div>
                <h3 class="product-title" data-testid="product-title-${product.id}">${product.name}</h3>
                <div class="product-price" data-testid="product-price-${product.id}">₹${product.price.toLocaleString()}</div>
                <button class="btn-add-cart" onclick="addToCart(${product.id})" data-testid="add-to-cart-btn-${product.id}">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Add to cart
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showToast('Added to cart!');
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    renderCart();
    showToast('Removed from cart');
}

// Update cart UI
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Render cart
function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart"></i><p>Your cart is empty</p></div>';
        document.getElementById('cartFooter').style.display = 'none';
        return;
    }

    document.getElementById('cartFooter').style.display = 'block';

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-testid="cart-item-${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-title" data-testid="cart-item-title-${item.id}">${item.name}</div>
                <div class="cart-item-price" data-testid="cart-item-price-${item.id}">₹${item.price.toLocaleString()} × ${item.quantity}</div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})" data-testid="remove-cart-item-${item.id}">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmount.textContent = `₹${total.toLocaleString()}`;
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Search products
function searchProducts(query) {
    const lowerQuery = query.toLowerCase();
    filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
    );
    renderProducts();
}

// Filter by category
function filterByCategory(category) {
    if (category === 'all') {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter(p => p.category.toLowerCase() === category);
    }
    renderProducts();
}

// Sort products
function sortProducts(sortType) {
    switch (sortType) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            filteredProducts = [...allProducts];
    }
    renderProducts();
}

// AI Assistant - Mock intelligent responses
async function handleAIQuery(query) {
    const lowerQuery = query.toLowerCase();

    // Price-based queries
    if (lowerQuery.includes('under') || lowerQuery.includes('below') || lowerQuery.includes('cheap')) {
        const priceMatch = lowerQuery.match(/\d+/);
        if (priceMatch) {
            const maxPrice = parseInt(priceMatch[0]);
            const results = allProducts.filter(p => p.price <= maxPrice);
            return formatAIResponse(results, `Found ${results.length} products under ₹${maxPrice}`);
        }
    }

    // Category-based queries
    if (lowerQuery.includes('phone') || lowerQuery.includes('mobile')) {
        const results = allProducts.filter(p => p.name.toLowerCase().includes('phone') || p.name.toLowerCase().includes('mobile'));
        return formatAIResponse(results, 'Here are some phones for you:');
    }

    if (lowerQuery.includes('laptop') || lowerQuery.includes('computer')) {
        const results = allProducts.filter(p => p.name.toLowerCase().includes('laptop') || p.name.toLowerCase().includes('computer'));
        return formatAIResponse(results, 'Check out these laptops:');
    }

    if (lowerQuery.includes('shirt') || lowerQuery.includes('ethnic') || lowerQuery.includes('wear') || lowerQuery.includes('fashion')) {
        const results = allProducts.filter(p => p.category.toLowerCase() === 'fashion');
        return formatAIResponse(results, 'Here are some fashion items:');
    }

    if (lowerQuery.includes('home') || lowerQuery.includes('chair') || lowerQuery.includes('furniture')) {
        const results = allProducts.filter(p => p.category.toLowerCase() === 'home');
        return formatAIResponse(results, 'Found these home & living items:');
    }

    // General search
    const searchResults = allProducts.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    );

    if (searchResults.length > 0) {
        return formatAIResponse(searchResults, `Found ${searchResults.length} matching products:`);
    }

    return "I couldn't find products matching that description. Try asking about phones, laptops, fashion, or home items. You can also specify a price range!";
}

function formatAIResponse(products, message) {
    if (products.length === 0) {
        return "Sorry, no products found matching that criteria. Try adjusting your search!";
    }

    const productList = products.slice(0, 5).map(p =>
        `• ${p.name} - ₹${p.price.toLocaleString()}`
    ).join('\n');

    return `${message}\n\n${productList}${products.length > 5 ? '\n\n...and more!' : ''}`;
}

// Add chat message
function addChatMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
    messageDiv.setAttribute('data-testid', isUser ? 'user-message' : 'bot-message');
    messageDiv.innerHTML = `<div class="message-content">${message.replace(/\n/g, '<br>')}</div>`;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Show toast notification
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Event listeners
function initEventListeners() {
    // Search
    searchInput.addEventListener('input', (e) => {
        searchProducts(e.target.value);
    });

    // Sort
    sortSelect.addEventListener('change', (e) => {
        sortProducts(e.target.value);
    });

    // Categories
    categoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            categoryChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            filterByCategory(chip.dataset.category);
        });
    });

    // Cart modal
    cartBtn.addEventListener('click', () => {
        cartModal.classList.add('show');
        renderCart();
    });

    closeCartModal.addEventListener('click', () => {
        cartModal.classList.remove('show');
    });

    // AI Assistant modal
    aiAssistantBtn.addEventListener('click', () => {
        aiModal.classList.add('show');
    });

    closeAiModal.addEventListener('click', () => {
        aiModal.classList.remove('show');
    });

    // Send chat
    sendChatBtn.addEventListener('click', async () => {
        const query = chatInput.value.trim();
        if (!query) return;

        addChatMessage(query, true);
        chatInput.value = '';

        const response = await handleAIQuery(query);
        setTimeout(() => {
            addChatMessage(response);
        }, 500);
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatBtn.click();
        }
    });

    // Checkout
    checkoutBtn.addEventListener('click', () => {
        showToast('Checkout feature coming soon!', 'info');
    });

    // Close modals on outside click
    [aiModal, cartModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
}