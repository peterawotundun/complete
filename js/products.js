let products = [];
let currentCategory = 'all';
let currentPage = 1;
const itemsPerPage = 12;
let filteredProducts = [];

const productsGrid = document.getElementById('productsGrid');
const categoryTabs = document.querySelectorAll('.tab-btn');
const sortSelect = document.getElementById('sortSelect');
const minPriceInput = document.getElementById('minPrice');
const maxPriceInput = document.getElementById('maxPrice');
const priceFilterBtn = document.getElementById('priceFilterBtn');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageNumbers = document.getElementById('pageNumbers');

function fetchProducts() {
    return fetch('get_products.php')
        .then(res => res.json())
        .then(data => {
            products = data;
            filteredProducts = products;
            updateProductsDisplay();
        });
}

function setupEventListeners() {
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.dataset.category;
            currentPage = 1;
            filterProducts();
        });
    });
    sortSelect.addEventListener('change', filterProducts);
    priceFilterBtn.addEventListener('click', filterProducts);
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateProductsDisplay();
        }
    });
    nextPageBtn.addEventListener('click', () => {
        const maxPages = Math.ceil(filteredProducts.length / itemsPerPage);
        if (currentPage < maxPages) {
            currentPage++;
            updateProductsDisplay();
        }
    });
}

function filterProducts() {
    let filtered = products.slice();
    if (currentCategory !== 'all') {
        filtered = filtered.filter(product => product.category === currentCategory);
    }
    const minPrice = parseFloat(minPriceInput.value) || 0;
    const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
    filtered = filtered.filter(product =>
        product.price >= minPrice && product.price <= maxPrice
    );
    const sortValue = sortSelect.value;
    switch (sortValue) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    filteredProducts = filtered;
    currentPage = 1;
    updateProductsDisplay();
}

function updateProductsDisplay() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    productsGrid.innerHTML = currentProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.discount ? `<span class="discount">-${product.discount}%</span>` : ""}
                <button class="wishlist-btn"><i class="far fa-heart"></i></button>
                <button class="quick-view-btn"><i class="far fa-eye"></i></button>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="price">
                    <span class="current">₦${formatPrice(product.price)}</span>
                    <span class="original">₦${formatPrice(product.price * (1 + (product.discount || 0)/100))}</span>
                </div>
                <button class="add-to-cart">Add To Cart</button>
            </div>
        </div>
    `).join('');
    updatePagination();
    attachProductActionListeners();
}

function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    pageNumbers.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const pageNumber = document.createElement('div');
        pageNumber.className = `page-number${i === currentPage ? ' active' : ''}`;
        pageNumber.textContent = i;
        pageNumber.addEventListener('click', () => {
            currentPage = i;
            updateProductsDisplay();
        });
        pageNumbers.appendChild(pageNumber);
    }
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
}

function formatPrice(price) {
    return parseInt(price).toLocaleString();
}

function showInfoBox(message, type = "info") {
    const existing = document.querySelector('.info-box');
    if (existing) existing.remove();
    const box = document.createElement('div');
    box.className = `info-box ${type}`;
    box.textContent = message;
    document.body.appendChild(box);
    setTimeout(() => { box.classList.add('visible'); }, 10);
    setTimeout(() => {
        box.classList.remove('visible');
        setTimeout(() => box.remove(), 400);
    }, 1800);
}

function attachProductActionListeners() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.onclick = function (e) {
            const card = btn.closest('.product-card');
            const productId = card.getAttribute('data-id');
            const product = products.find(p => p.id === productId);
            if (!product) return;
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existing = cart.find(item => item.id === product.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            showInfoBox("Product added to cart!", "success");
        };
    });
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.onclick = function (e) {
            const card = btn.closest('.product-card');
            const productId = card.getAttribute('data-id');
            const product = products.find(p => p.id === productId);
            if (!product) return;
            let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
            if (!wishlist.some(item => item.id === product.id)) {
                wishlist.push(product);
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
                showInfoBox("Product added to wishlist!", "success");
            }
            const icon = btn.querySelector('i');
            if (icon) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#043D79';
            }
        };
        const card = btn.closest('.product-card');
        const productId = card.getAttribute('data-id');
        let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        if (wishlist.some(item => item.id === productId)) {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#043D79';
            }
        }
    });
    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.onclick = function (e) {
            const card = btn.closest('.product-card');
            const productId = card.getAttribute('data-id');
            const product = products.find(p => p.id === productId);
            if (!product) return;
            showInfoBox(`Quick view for ${product.name}`, "info");
        };
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts().then(setupEventListeners);
});