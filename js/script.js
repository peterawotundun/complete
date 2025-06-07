// Make sure to load 'auth.js' before this script in your HTML!
// This file protects cart/wishlist actions, uses styled notifications, and still handles your UI logic.

function showInfoBox(message, type = "info") {
    // Remove any existing infobox
    const existing = document.querySelector('.info-box');
    if (existing) existing.remove();

    const box = document.createElement('div');
    box.className = `info-box ${type}`;
    box.textContent = message;
    document.body.appendChild(box);
    setTimeout(() => {
        box.classList.add('visible');
    }, 10);

    setTimeout(() => {
        box.classList.remove('visible');
        setTimeout(() => box.remove(), 400);
    }, 1800);
}

// Utility function to format numbers with leading zero
function formatNumber(number) {
    return number < 10 ? `0${number}` : number;
}

// Countdown and slider logic (unchanged from your script)
function updateCountdown(endTime, elements) {
    const now = new Date().getTime();
    const timeLeft = endTime - now;
    if (timeLeft <= 0) {
        const newEndTime = new Date().getTime() + (3 * 24 * 60 * 60 * 1000);
        updateCountdown(newEndTime, elements);
        return;
    }
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    elements.days.textContent = formatNumber(days);
    elements.hours.textContent = formatNumber(hours);
    elements.minutes.textContent = formatNumber(minutes);
    elements.seconds.textContent = formatNumber(seconds);
}

function initFlashSalesCountdown() {
    const countdown = document.getElementById('countdown');
    if (!countdown) return;
    const elements = {
        days: countdown.querySelector('.time-unit:nth-child(1) .number'),
        hours: countdown.querySelector('.time-unit:nth-child(3) .number'),
        minutes: countdown.querySelector('.time-unit:nth-child(5) .number'),
        seconds: countdown.querySelector('.time-unit:nth-child(7) .number')
    };
    const endTime = new Date().getTime() + (3 * 24 * 60 * 60 * 1000);
    setInterval(() => updateCountdown(endTime, elements), 1000);
    updateCountdown(endTime, elements);
}

function initHeroCountdown() {
    const countdown = document.querySelector('.hero .countdown');
    if (!countdown) return;
    const elements = {
        days: countdown.querySelector('.countdown-item:nth-child(1) .number'),
        hours: countdown.querySelector('.countdown-item:nth-child(2) .number'),
        minutes: countdown.querySelector('.countdown-item:nth-child(3) .number'),
        seconds: countdown.querySelector('.countdown-item:nth-child(4) .number')
    };
    const endTime = new Date().getTime() + (23 * 24 * 60 * 60 * 1000);
    setInterval(() => updateCountdown(endTime, elements), 1000);
    updateCountdown(endTime, elements);
}

document.addEventListener('DOMContentLoaded', () => {
    initFlashSalesCountdown();
    initHeroCountdown();

    // Mobile menu logic
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        mobileMenuClose.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
        document.addEventListener('click', (e) => {
            if (!mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Product slider navigation
    const sliders = document.querySelectorAll('.products-slider');
    sliders.forEach(slider => {
        const prevBtn = slider.parentElement.querySelector('.nav-btn.prev');
        const nextBtn = slider.parentElement.querySelector('.nav-btn.next');
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                slider.scrollBy({ left: -280, behavior: 'smooth' });
            });
            nextBtn.addEventListener('click', () => {
                slider.scrollBy({ left: 280, behavior: 'smooth' });
            });
        }
    });

    // Cart/Wishlist logic with login protection
    attachProductActionListeners();

    // Initialize nav badge and wishlist badge
    updateNavBadge();
    updateWishlistBadge();
});

// Cart logic with login protection
function addToCart(product) {
    const cartItems = getCartItems();
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price.replace('₦', '').replace(',', '')),
            image: product.image,
            quantity: 1,
            color: product.color || null
        });
    }
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateNavBadge();
    showInfoBox("Product added to cart!", "success");
}

function getCartItems() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function updateNavBadge() {
    const cartItems = getCartItems();
    const cartBadge = document.querySelector('.cart .nav-badge');
    if (cartItems.length > 0) {
        if (cartBadge) {
            cartBadge.textContent = cartItems.length;
        } else {
            const badge = document.createElement('span');
            badge.className = 'nav-badge';
            badge.textContent = cartItems.length;
            document.querySelector('.cart').appendChild(badge);
        }
    } else if (cartBadge) {
        cartBadge.remove();
    }
}

// Wishlist logic with login protection
function addToWishlist(product) {
    const wishlistItems = getWishlistItems();
    const existingItem = wishlistItems.find(item => item.id === product.id);
    if (!existingItem) {
        wishlistItems.push({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price.replace('₦', '').replace(',', '')),
            image: product.image,
            discount: product.discount ? parseFloat(product.discount.replace('%', '')) : null,
            originalPrice: product.originalPrice ? parseFloat(product.originalPrice.replace('₦', '').replace(',', '')) : null,
            rating: product.rating || null,
            reviews: product.reviews || null
        });
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
        updateWishlistBadge();
        showInfoBox(`${product.name} added to wishlist!`, "success");
        return true;
    }
    showInfoBox(`${product.name} is already in wishlist!`, "info");
    return false;
}

function getWishlistItems() {
    const wishlist = localStorage.getItem('wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
}

function updateWishlistBadge() {
    const wishlistItems = getWishlistItems();
    const wishlistBadge = document.querySelector('.wishlist .nav-badge');
    if (wishlistItems.length > 0) {
        if (wishlistBadge) {
            wishlistBadge.textContent = wishlistItems.length;
        } else {
            const badge = document.createElement('span');
            badge.className = 'nav-badge';
            badge.textContent = wishlistItems.length;
            document.querySelector('.wishlist').appendChild(badge);
        }
    } else if (wishlistBadge) {
        wishlistBadge.remove();
    }
}

// Attach event listeners to Add to Cart and Wishlist buttons WITH login checks!
function attachProductActionListeners() {
    // Add to Cart
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
                showInfoBox("Login required to add to cart!", "error");
                setTimeout(() => window.location.href = "auth.html", 1200);
                return;
            }
            const productCard = button.closest('.product-card');
            if (!productCard) return;
            const product = {
                id: productCard.dataset.id || Date.now().toString(),
                name: productCard.querySelector('h3').textContent,
                price: productCard.querySelector('.current').textContent,
                image: productCard.querySelector('img').src,
                color: productCard.querySelector('.product-info p')?.textContent.replace('Color: ', '') || null
            };
            addToCart(product);
        });
    });

    // Add to Wishlist
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
                showInfoBox("Login required to add to wishlist!", "error");
                setTimeout(() => window.location.href = "auth.html", 1200);
                return;
            }
            const productCard = button.closest('.product-card');
            if (!productCard) return;
            const product = {
                id: productCard.dataset.id || Date.now().toString(),
                name: productCard.querySelector('h3').textContent,
                price: productCard.querySelector('.current').textContent,
                image: productCard.querySelector('.product-image img').src,
                discount: productCard.querySelector('.discount')?.textContent || null,
                originalPrice: productCard.querySelector('.original')?.textContent || null,
                rating: productCard.querySelector('.stars')?.innerHTML || null,
                reviews: productCard.querySelector('.reviews')?.textContent || null
            };
            const added = addToWishlist(product);

            // Visual feedback
            const icon = button.querySelector('i');
            if (icon && added) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#043D79';
            }
        });
    });

    // Highlight already wishlisted products on page load
    const wishlistItems = getWishlistItems();
    wishlistItems.forEach(item => {
        const button = document.querySelector(`.product-card[data-id="${item.id}"] .wishlist-btn`);
        if (button) {
            const icon = button.querySelector('i');
            if (icon) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#043D79';
            }
        }
    });
}

// Optional: Logout handler (if you add a logout button with id="logoutBtn")
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.onclick = function() {
        if (typeof logout === 'function') {
            logout();
            window.location.href = "index.html";
        }
    };
}
