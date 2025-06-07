let currentStep = 1;
const totalSteps = 3;

// Cart functionality
function addToCart(item) {
    const cartItems = getCartItems();
    const existingItem = cartItems.find(i => i.id === item.id);
    
    if (existingItem) {
        existingItem.quantity += item.quantity;
    } else {
        cartItems.push(item);
    }
    
    localStorage.setItem('cart', JSON.stringify(cartItems));
    renderCart();
}

function getCartItems() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    const items = getCartItems();
    
    cartContainer.innerHTML = items.length === 0 
        ? '<div class="cart-empty">Your cart is empty</div>'
        : items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    ${item.color ? `<p>Color: ${item.color}</p>` : ''}
                    <div class="quantity">
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>
                <div class="item-actions">
                    <div class="item-price">₦${item.price.toLocaleString()}</div>
                    <button class="delete-btn" onclick="deleteItem('${item.id}')" title="Remove item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    
    updateTotal();
}

function deleteItem(itemId) {
    const item = document.querySelector(`.cart-item[data-id="${itemId}"]`);
    if (!item) return;

    item.classList.add('removing');
    
    setTimeout(() => {
        const cartItems = getCartItems().filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        renderCart();
    }, 300);
}

function updateQuantity(itemId, change) {
    const cartItems = getCartItems();
    const item = cartItems.find(i => i.id === itemId);
    
    if (item) {
        item.quantity = Math.max(1, item.quantity + change);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        renderCart();
    }
}

function updateTotal() {
    const cartItems = getCartItems();
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    
    const selectedShipping = document.querySelector('input[name="delivery"]:checked').id;
    let shipping = 0;
    
    switch(selectedShipping) {
        case 'basic': shipping = 4000; break;
        case 'express': shipping = 5000; break;
        case 'premium': shipping = 4000; break;
        case 'last': shipping = 5000; break;
    }
    
    const total = subtotal + tax + shipping;

    document.getElementById('subtotal').textContent = `₦${subtotal.toLocaleString()}`;
    document.getElementById('tax').textContent = `₦${tax.toLocaleString()}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'Free' : `₦${shipping.toLocaleString()}`;
    document.getElementById('total').textContent = `₦${total.toLocaleString()}`;
}

function nextStep() {
    if (currentStep < totalSteps) {
        currentStep++;
        updateSteps();
        if (currentStep === 2) {
            showPaymentSection();
        }
    }
}

function updateSteps() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index + 1 <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function showPaymentSection() {
    document.querySelector('.checkout-content').style.display = 'none';
    document.getElementById('payment-section').style.display = 'block';
}

function makePayment() {
    const total = parseFloat(document.getElementById('total').textContent.replace('₦', '').replace(',', ''));
    
    FlutterwaveCheckout({
        public_key: "YOUR_FLUTTERWAVE_PUBLIC_KEY",
        tx_ref: "DREX_" + Math.floor(Math.random() * 1000000000 + 1),
        amount: total,
        currency: "NGN",
        payment_options: "card,ussd,banktransfer",
        customer: {
            email: document.getElementById('email').value,
            phone_number: document.getElementById('phone').value,
            name: document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
        },
        customizations: {
            title: "DrRex Gadgets",
            description: "Payment for items in cart",
            logo: "https://i.imgur.com/nfkEjkA.png",
        },
        callback: function(response) {
            if(response.status === "successful") {
                alert("Payment successful! Order will be processed.");
                localStorage.removeItem('cart');
                window.location.href = '/order-confirmation.html';
            } else {
                alert("Payment failed. Please try again.");
            }
        },
        onclose: function() {
            // Handle payment modal closed
        },
    });
}

// Handle delivery method change
document.querySelectorAll('input[name="delivery"]').forEach(input => {
    input.addEventListener('change', updateTotal);
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    updateSteps();
});




function nextStep() {
    const requiredFields = [
        'firstName',
        'lastName',
        'email',
        'address',
        'city',
        'state',
        'zipCode',
        'phone'
    ];

    let isValid = true;

    // Validate input fields
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.classList.add('input-error');
            isValid = false;
        } else {
            field.classList.remove('input-error');
        }
    });

    // Validate delivery option
    const deliverySelected = document.querySelector('input[name="delivery"]:checked');
    if (!deliverySelected) {
        alert("Please select a delivery method.");
        isValid = false;
    }

    // If everything is valid, show payment section
    if (isValid) {
        document.querySelector('.checkout-content').style.display = 'none';
        document.getElementById('payment-section').style.display = 'block';
    }
}
