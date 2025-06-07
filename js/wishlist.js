// Initialize wishlist data from localStorage or empty array
let wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];

// DOM Elements
const productGrid = document.getElementById('productGrid');
const emptyWishlist = document.querySelector('.empty-wishlist');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenuCloseBtn = document.querySelector('.mobile-menu-close');
const mobileNav = document.querySelector('.mobile-nav');

// Load wishlist from localStorage and update display
function loadWishlist() {
    updateWishlistDisplay();
    updateWishlistBadge();
}

// Save wishlist to localStorage
function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    updateWishlistBadge();
}

// Remove item from wishlist with animation
function removeFromWishlist(productId) {
    const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
    if (productCard) {
        productCard.classList.add('removing');
        
        setTimeout(() => {
            wishlistItems = wishlistItems.filter(item => item.id !== productId);
            saveWishlist();
            updateWishlistDisplay();
        }, 300);
    }
}

// Create product card HTML for wishlist
function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.discount ? `<span class="discount">${product.discount}%</span>` : ''}
                <button class="wishlist-btn" onclick="removeFromWishlist('${product.id}')" title="Remove from wishlist">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="quick-view-btn" onclick="quickView('${product.id}')" title="Quick view">
                    <i class="far fa-eye"></i>
                </button>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="price">
                    <span class="current">₦${product.price}</span>
                    ${product.originalPrice ? `<span class="original">${product.originalPrice}</span>` : ''}
                </div>
                <div class="rating">
                    <div class="stars">
                        ${product.rating || '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>'}
                    </div>
                    <span class="reviews">${product.reviews || '0'}</span>
                </div>
                <button class="add-to-cart" onclick="addToCartFromWishlist('${product.id}')">Add To Cart</button>
            </div>
        </div>
    `;
}

// Update wishlist display
function updateWishlistDisplay() {
    if (wishlistItems.length === 0) {
        if (productGrid) productGrid.innerHTML = '';
        if (emptyWishlist) emptyWishlist.style.display = 'block';
    } else {
        if (emptyWishlist) emptyWishlist.style.display = 'none';
        if (productGrid) productGrid.innerHTML = wishlistItems.map(item => createProductCard(item)).join('');
    }
}

// Update wishlist badge in navigation
function updateWishlistBadge() {
    const wishlistBadge = document.querySelector('.wishlist .nav-badge');
    if (wishlistBadge) {
        wishlistBadge.textContent = wishlistItems.length;
        wishlistBadge.style.display = wishlistItems.length > 0 ? 'block' : 'none';
    }
}

// Quick view functionality
function quickView(productId) {
    const product = wishlistItems.find(item => item.id === productId);
    if (product) {
        alert(`Quick view for ${product.name}`);
        // Implement your quick view modal here
    }
}

// Add to cart from wishlist
function addToCartFromWishlist(productId) {
    const product = wishlistItems.find(item => item.id === productId);
    if (product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if product already in cart
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.name} added to cart!`);
        
        // Update cart badge
        const cartBadge = document.querySelector('.cart .nav-badge');
        if (cartBadge) {
            cartBadge.textContent = cart.length;
        } else if (cart.length > 0) {
            const badge = document.createElement('span');
            badge.className = 'nav-badge';
            badge.textContent = cart.length;
            document.querySelector('.cart').appendChild(badge);
        }
    }
}

// Mobile menu handlers
if (mobileMenuBtn && mobileNav && mobileMenuCloseBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.style.display = 'block';
    });

    mobileMenuCloseBtn.addEventListener('click', () => {
        mobileNav.style.display = 'none';
    });
}

// Search functionality
const searchInput = document.querySelector('.search-container input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredItems = wishlistItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm)
        );
        
        if (filteredItems.length === 0) {
            productGrid.innerHTML = '<p class="no-results">No products found matching your search.</p>';
        } else {
            productGrid.innerHTML = filteredItems.map(item => createProductCard(item)).join('');
        }
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileNav) {
        mobileNav.style.display = 'none';
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadWishlist);