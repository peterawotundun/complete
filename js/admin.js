let products = [];
let orders = []; // Keep using localStorage or move to backend as needed

function fetchProducts() {
    return fetch('get_products.php')
        .then(res => res.json())
        .then(data => {
            products = data;
            updateProductsTable();
            updateDashboardStats();
        });
}

function saveProducts() {
    return fetch('save_products.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(products)
    }).then(res => res.json());
}

// Tab Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        if (e.currentTarget.getAttribute('href') === 'index.html') return;
        e.preventDefault();
        const tabId = e.currentTarget.dataset.tab;
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        e.currentTarget.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
    });
});

function openProductModal() {
    document.getElementById('productModal').style.display = 'block';
}
function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
    document.getElementById('productForm').reset();
}

document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const sections = [];
    if (document.getElementById('section-flash-sales').checked) sections.push('flash-sales');
    if (document.getElementById('section-best-selling').checked) sections.push('best-selling');
    if (document.getElementById('section-explore').checked) sections.push('explore');
    const newProduct = {
        id: Date.now().toString(),
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        discount: parseInt(document.getElementById('productDiscount').value) || 0,
        stock: parseInt(document.getElementById('productStock').value),
        image: document.getElementById('productImage').value,
        description: document.getElementById('productDescription').value,
        sections
    };
    products.push(newProduct);
    saveProducts().then(fetchProducts);
    closeProductModal();
});

function updateProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = products.map(product => `
        <tr>
            <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;"></td>
            <td>${product.name}</td>
            <td>${product.category || ''}</td>
            <td>₦${product.price}</td>
            <td>${product.discount}%</td>
            <td>${product.stock}</td>
            <td>
                <button onclick="editProduct('${product.id}')" class="action-btn edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteProduct('${product.id}')" class="action-btn delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

window.editProduct = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category || '';
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productDiscount').value = product.discount;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('section-flash-sales').checked = Array.isArray(product.sections) && product.sections.includes('flash-sales');
    document.getElementById('section-best-selling').checked = Array.isArray(product.sections) && product.sections.includes('best-selling');
    document.getElementById('section-explore').checked = Array.isArray(product.sections) && product.sections.includes('explore');
    const form = document.getElementById('productForm');
    form.onsubmit = (e) => {
        e.preventDefault();
        const updatedSections = [];
        if (document.getElementById('section-flash-sales').checked) updatedSections.push('flash-sales');
        if (document.getElementById('section-best-selling').checked) updatedSections.push('best-selling');
        if (document.getElementById('section-explore').checked) updatedSections.push('explore');
        product.name = document.getElementById('productName').value;
        product.category = document.getElementById('productCategory').value;
        product.price = parseFloat(document.getElementById('productPrice').value);
        product.discount = parseInt(document.getElementById('productDiscount').value) || 0;
        product.stock = parseInt(document.getElementById('productStock').value);
        product.image = document.getElementById('productImage').value;
        product.description = document.getElementById('productDescription').value;
        product.sections = updatedSections;
        saveProducts().then(fetchProducts);
        closeProductModal();
        form.onsubmit = null;
    };
    openProductModal();
}

window.deleteProduct = function(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        saveProducts().then(fetchProducts);
    }
}

function updateDashboardStats() {
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalOrders').textContent = orders.length;
    const revenue = orders
        .filter(order => order.status === 'Delivered')
        .reduce((total, order) => total + (order.total || 0), 0);
    document.getElementById('totalRevenue').textContent = `₦${revenue.toLocaleString()}`;
}

document.addEventListener('DOMContentLoaded', fetchProducts);