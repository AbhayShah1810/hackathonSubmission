// Cart management
let cart = [];

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartDisplay();
    saveCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    saveCart();
}

function updateCartDisplay() {
    const cartItemCount = document.getElementById('cart-item-count');
    const cartTotal = document.getElementById('cart-total');
    const cartDropdownItems = document.querySelector('.cart-dropdown-items');
    const cartCount = document.querySelector('.dropdown-cart .nav-link');

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    if (cartItemCount) cartItemCount.textContent = totalItems;
    if (cartTotal) cartTotal.textContent = '$' + totalPrice.toFixed(2);
    if (cartCount) cartCount.textContent = `Bag (${totalItems})`;

    if (cartDropdownItems) {
        cartDropdownItems.innerHTML = '';
        cart.forEach(item => {
            const itemElement = createCartItemElement(item);
            cartDropdownItems.appendChild(itemElement);
        });
    }
    populateCartPage();
}

function createCartItemElement(item) {
    const itemElement = document.createElement('div');
    itemElement.classList.add('row', 'mx-0', 'py-4', 'g-0', 'border-bottom');
    itemElement.innerHTML = `
        <div class="col-2 position-relative">
            <picture class="d-block ">
                <img class="img-fluid" src="${item.img}" alt="Product">
            </picture>
        </div>
        <div class="col-9 offset-1">
            <div>
                <h6 class="justify-content-between d-flex align-items-start mb-2">
                    ${item.name}
                    <i class="ri-close-line ms-3" onclick="removeFromCart('${item.id}')"></i>
                </h6>
                <span class="d-block text-muted fw-bolder text-uppercase fs-9">Qty: ${item.quantity}</span>
            </div>
            <p class="fw-bolder text-end text-muted m-0">$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
    `;
    return itemElement;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

function populateCartPage() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const itemElement = document.createElement('tr');
            itemElement.innerHTML = `
                <td class="ps-0 py-3">
                    <div class="d-flex align-items-center">
                        <a href="#">
                            <picture class="d-block bg-light">
                                <img class="img-fluid" src="${item.img}" alt="Product Image">
                            </picture>
                        </a>
                        <div class="ms-3">
                            <h6 class="mb-0">${item.name}</h6>
                        </div>
                    </div>
                </td>
                <td class="pe-0 py-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <span class="d-block text-muted fw-bolder">Qty: ${item.quantity}</span>
                        </div>
                        <div class="d-flex justify-content-end align-items-center">
                            <p class="mb-0 fw-bolder">$${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                </td>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });

        if (cartTotalElement) {
            cartTotalElement.textContent = `$${total.toFixed(2)}`;
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadCart();
    updateCartDisplay();

    const addToCartButton = document.getElementById('add-to-cart-button');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function () {
            const productId = new URLSearchParams(window.location.search).get('id');
            const productName = document.querySelector('h1').textContent;
            const productPrice = parseFloat(document.querySelector('.fs-4').textContent.replace('$', ''));
            const productImg = document.querySelector('.card-img img').src;

            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                img: productImg
            };

            addToCart(product);
        });
    }
});