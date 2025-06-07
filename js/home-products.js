let products = [];

function fetchProductsAndRenderSections() {
    fetch('get_products.php')
        .then(res => res.json())
        .then(data => {
            products = data;
            renderSection('flash-sales', 'flash-sales-products', 10);
            renderSection('best-selling', 'best-selling-products', 10);
            renderSection('explore', 'explore-products', 20);
        });
}

function generateProductCard(product) {
    return `
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
                    <span class="current">₦${Number(product.price).toLocaleString()}</span>
                </div>
                <button class="add-to-cart">Add To Cart</button>
            </div>
        </div>
    `;
}

function renderSection(sectionName, containerId, limit = 10) {
    const sectionProducts = products
        .filter(p => Array.isArray(p.sections) && p.sections.includes(sectionName))
        .slice(0, limit);
    const container = document.getElementById(containerId);
    if (!container) return;
    if (sectionProducts.length === 0) {
        container.innerHTML = `<p class="empty-message">No products found in this section.</p>`;
        return;
    }
    container.innerHTML = sectionProducts.map(generateProductCard).join('');
    // Fix: Attach event listeners to the newly rendered buttons
    if (typeof attachProductActionListeners === "function") {
        attachProductActionListeners();
    }
}

document.addEventListener('DOMContentLoaded', fetchProductsAndRenderSections);