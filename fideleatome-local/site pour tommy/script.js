// =====================
// Products Data
// =====================
const products = [
    {
        id: 1,
        name: "Figurine Dragon",
        description: "Figurine de dragon détaillée, parfaite pour décoration ou collection.",
        price: 25.00,
        image: null // Remplacer par le chemin de l'image: "images/dragon.jpg"
    },
    {
        id: 2,
        name: "Pot de fleur géométrique",
        description: "Design moderne avec motifs géométriques, idéal pour plantes succulentes.",
        price: 18.00,
        image: null
    },
    {
        id: 3,
        name: "Support téléphone",
        description: "Support ergonomique et élégant pour smartphone, plusieurs angles.",
        price: 12.00,
        image: null
    },
    {
        id: 4,
        name: "Lampe décorative",
        description: "Abat-jour imprimé en 3D avec motifs lumineux uniques.",
        price: 35.00,
        image: null
    },
    {
        id: 5,
        name: "Porte-clés personnalisé",
        description: "Porte-clés sur mesure avec le design de votre choix.",
        price: 8.00,
        image: null
    },
    {
        id: 6,
        name: "Organisateur de bureau",
        description: "Rangement modulaire pour stylos, cartes et petits objets.",
        price: 22.00,
        image: null
    }
];

// =====================
// Cart State
// =====================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// =====================
// DOM Elements
// =====================
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeModal = document.getElementById('closeModal');
const checkoutForm = document.getElementById('checkoutForm');
const orderSummary = document.getElementById('orderSummary');
const contactForm = document.getElementById('contactForm');

// =====================
// Initialize
// =====================
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCart();
    setupEventListeners();
});

// =====================
// Render Products
// =====================
function renderProducts() {
    productsGrid.innerHTML = products.map(product => `
        <article class="product-card">
            <div class="product-image">
                ${product.image
                    ? `<img src="${product.image}" alt="${product.name}">`
                    : `<span class="product-placeholder">◈</span>`
                }
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">${formatPrice(product.price)}</span>
                    <button class="add-to-cart" data-id="${product.id}">
                        Ajouter
                    </button>
                </div>
            </div>
        </article>
    `).join('');

    // Add click events to add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.dataset.id);
            addToCart(productId);
        });
    });
}

// =====================
// Cart Functions
// =====================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    saveCart();
    updateCart();
    showNotification(`${product.name} ajouté au panier`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCart();
}

function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCart();
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Votre panier est vide</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <span class="product-placeholder" style="font-size: 1.5rem;">◈</span>
                </div>
                <div class="cart-item-details">
                    <p class="cart-item-title">${item.name}</p>
                    <p class="cart-item-price">${formatPrice(item.price)}</p>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" data-id="${item.id}" data-action="decrease">−</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" data-id="${item.id}" data-action="increase">+</button>
                        <button class="remove-item" data-id="${item.id}">Supprimer</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners
        cartItems.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const delta = btn.dataset.action === 'increase' ? 1 : -1;
                updateQuantity(id, delta);
            });
        });

        cartItems.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                removeFromCart(id);
            });
        });
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = formatPrice(total);
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// =====================
// UI Functions
// =====================
function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function openCheckout() {
    if (cart.length === 0) {
        showNotification('Votre panier est vide', 'error');
        return;
    }

    closeCartSidebar();

    // Update order summary
    orderSummary.innerHTML = `
        <h4>Récapitulatif</h4>
        <ul class="order-items">
            ${cart.map(item => `
                <li>
                    <span>${item.name} × ${item.quantity}</span>
                    <span>${formatPrice(item.price * item.quantity)}</span>
                </li>
            `).join('')}
        </ul>
        <div class="order-total">
            <span>Total</span>
            <span>${formatPrice(getCartTotal())}</span>
        </div>
    `;

    checkoutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
    checkoutModal.classList.remove('active');
    document.body.style.overflow = '';
}

function showNotification(message, type = 'default') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// =====================
// Utility Functions
// =====================
function formatPrice(price) {
    return price.toFixed(2).replace('.', ',') + ' €';
}

// =====================
// Event Listeners
// =====================
function setupEventListeners() {
    // Cart toggle
    cartBtn.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartSidebar);
    cartOverlay.addEventListener('click', closeCartSidebar);

    // Checkout
    checkoutBtn.addEventListener('click', openCheckout);
    closeModal.addEventListener('click', closeCheckoutModal);
    checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) closeCheckoutModal();
    });

    // Checkout form submission
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(checkoutForm);
        const orderData = {
            customer: {
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address')
            },
            items: cart,
            total: getCartTotal(),
            date: new Date().toISOString()
        };

        // Here you would typically send this to a server
        console.log('Order submitted:', orderData);

        // Clear cart and close modal
        cart = [];
        saveCart();
        updateCart();
        closeCheckoutModal();
        checkoutForm.reset();

        showNotification('Commande envoyée avec succès !', 'success');
    });

    // Contact form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const contactData = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        // Here you would typically send this to a server
        console.log('Contact form submitted:', contactData);

        contactForm.reset();
        showNotification('Message envoyé !', 'success');
    });

    // Close cart with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCartSidebar();
            closeCheckoutModal();
        }
    });
}
