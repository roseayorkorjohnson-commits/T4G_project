// ===============================
// HAMBURGER MENU
// ===============================

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}



document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop();

    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach(link => {
        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });
});



// ===============================
// SHOP SEARCH & VIEW MORE
// ===============================

const searchInput = document.getElementById("searchInput");
const categoryBtns = document.querySelectorAll(".category-btn");
const hiddenWrapper = document.querySelector(".hidden-products");
const viewMoreBtn = document.querySelector(".view-more-btn");
const noResultsEl = document.querySelector(".no-results");

const allCards = [
    ...document.querySelectorAll(".products .card"),
    ...document.querySelectorAll(".hidden-products .card")
];

function getCardName(card) {
    return (
        card.dataset.name ||
        card.querySelector("h3").textContent
    ).toLowerCase();
}

function getCardCategory(card) {
    return (card.dataset.category || "").toLowerCase();
}

function updateNoResults(show) {
    if (noResultsEl) {
        noResultsEl.style.display = show ? "block" : "none";
    }
}

function filterProducts() {

    const query = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const activeBtn = document.querySelector(".category-btn.active");

    const activeCategory = activeBtn
        ? activeBtn.dataset.category
        : "all";

    let hiddenVisible = false;

    allCards.forEach(card => {

        const name = getCardName(card);
        const category = getCardCategory(card);

        const matchesCategory =
            activeCategory === "all" ||
            category === activeCategory;

        const matchesSearch =
            !query ||
            name.includes(query) ||
            category.includes(query);

        const show = matchesCategory && matchesSearch;

        card.classList.toggle("filtered-out", !show);

        if (
            show &&
            card.closest(".hidden-products")
        ) {
            hiddenVisible = true;
            card.classList.add("visible");
        } else if (
            card.closest(".hidden-products")
        ) {
            card.classList.remove("visible");
        }

    });

    if (hiddenWrapper) {
        hiddenWrapper.classList.toggle(
            "open",
            hiddenVisible
        );
    }

    if (viewMoreBtn && hiddenWrapper) {
        viewMoreBtn.textContent =
            hiddenWrapper.classList.contains("open")
                ? "Show Less"
                : "View More Products";
    }

    const visibleCards = allCards.filter(
        card => !card.classList.contains("filtered-out")
    );

    updateNoResults(visibleCards.length === 0);

}

categoryBtns.forEach(btn => {

    btn.addEventListener("click", () => {

        categoryBtns.forEach(button =>
            button.classList.remove("active")
        );

        btn.classList.add("active");

        filterProducts();

    });

});

if (searchInput) {
    searchInput.addEventListener("input", filterProducts);
}

if (viewMoreBtn && hiddenWrapper) {

    viewMoreBtn.addEventListener("click", () => {

        hiddenWrapper.classList.toggle("open");

        viewMoreBtn.textContent =
            hiddenWrapper.classList.contains("open")
                ? "Show Less"
                : "View More Products";

    });

}

const searchBtn = document.querySelector(".shop-controls button");

if (searchBtn) {
    searchBtn.addEventListener("click", filterProducts);
}

filterProducts();

// ===============================
// CART STORAGE
// ===============================

const cartStorageKey = "whiskBloomCart";

function loadCart() {

    try {

        return JSON.parse(
            localStorage.getItem(cartStorageKey)
        ) || [];

    } catch {

        return [];

    }

}

function saveCart(cart) {

    localStorage.setItem(
        cartStorageKey,
        JSON.stringify(cart)
    );

}

function getCartItemId(product) {

    return (
        product.id ||
        product.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
    );

}

function updateCartCount() {

    const cart = loadCart();

    const count = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const cartCount = document.getElementById("cart-count");

    if (cartCount) {
        cartCount.textContent = count;
    }

}

function addToCart(product) {

    const cart = loadCart();

    const id = getCartItemId(product);

    const existing = cart.find(
        item => item.id === id
    );

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });

    }

    saveCart(cart);

    updateCartCount();

}






// ===============================
// CART FUNCTIONS
// ===============================

function formatPrice(value) {
    return `GHS ${value.toFixed(2)}`;
}

function calculateTotals(cart) {
    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const delivery = subtotal > 0 ? 15 : 0;

    return {
        subtotal,
        delivery,
        total: subtotal + delivery
    };
}

function renderCartItems() {

    const cartItemsContainer = document.getElementById("cartItems");

    if (!cartItemsContainer) return;

    const emptyMessage =
        document.querySelector(".empty-cart-message");

    const clearCartBtn =
        document.getElementById("clearCart");

    const cart = loadCart();

    const totals = calculateTotals(cart);

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {

        if (emptyMessage)
            emptyMessage.style.display = "block";

        if (clearCartBtn)
            clearCartBtn.disabled = true;

        document.getElementById("summarySubtotal").textContent = formatPrice(0);
        document.getElementById("summaryDelivery").textContent = formatPrice(0);
        document.getElementById("summaryTotal").textContent = formatPrice(0);

        updateCartCount();

        return;

    }

    if (emptyMessage)
        emptyMessage.style.display = "none";

    if (clearCartBtn)
        clearCartBtn.disabled = false;

    cart.forEach(item => {

        const card = document.createElement("div");

        card.className = "cart-item-card";

        card.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>

            <div class="cart-item-details">

                <h4>${item.name}</h4>

                <p>${formatPrice(item.price)}</p>

                <div class="quantity-controls">

                    <button class="quantity-btn"
                        data-action="decrease"
                        data-id="${item.id}">-</button>

                    <span>${item.quantity}</span>

                    <button class="quantity-btn"
                        data-action="increase"
                        data-id="${item.id}">+</button>

                </div>

            </div>

            <div class="cart-item-remove">

                <button class="btn-outline remove-item"
                    data-id="${item.id}">
                    Remove
                </button>

            </div>
        `;

        cartItemsContainer.appendChild(card);

    });

    document.getElementById("summarySubtotal").textContent =
        formatPrice(totals.subtotal);

    document.getElementById("summaryDelivery").textContent =
        formatPrice(totals.delivery);

    document.getElementById("summaryTotal").textContent =
        formatPrice(totals.total);

    document.querySelectorAll(".quantity-btn").forEach(button => {

        button.addEventListener("click", () => {

            const id = button.dataset.id;

            const action = button.dataset.action;

            const cart = loadCart();

            const item = cart.find(
                product => product.id === id
            );

            if (!item) return;

            if (action === "increase") {

                item.quantity++;

            } else if (
                action === "decrease" &&
                item.quantity > 1
            ) {

                item.quantity--;

            }

            saveCart(cart);

            updateCartCount();

            renderCartItems();

        });

    });

    document.querySelectorAll(".remove-item").forEach(button => {

        button.addEventListener("click", () => {

            const id = button.dataset.id;

            const updatedCart = loadCart().filter(
                item => item.id !== id
            );

            saveCart(updatedCart);

            updateCartCount();

            renderCartItems();

        });

    });

}

function initCartPage() {

    if (!document.getElementById("cartItems"))
        return;

    renderCartItems();

    const clearCartBtn =
        document.getElementById("clearCart");

    if (clearCartBtn) {

        clearCartBtn.addEventListener("click", () => {

            saveCart([]);

            updateCartCount();

            renderCartItems();

        });

    }

    const placeOrderBtn =
        document.getElementById("placeOrderBtn");

    if (placeOrderBtn) {

        placeOrderBtn.addEventListener("click", () => {

            const cart = loadCart();

            if (cart.length === 0) {

                alert("Your cart is empty.");

                return;

            }

            const name = document.getElementById("customerName").value;
             const email = document.getElementById("customerEmail").value;
            const address = document.getElementById("customerAddress").value;

          const payment = document.querySelector(
    'input[name="paymentMethod"]:checked'
).value;


let message = `Hello Whisks & Bloom Bakery 👋\n\n`;
message += `I would like to place an order.\n\n`;

message += `Name: ${name}\n`;
message += `Email: ${email}\n`;
message += `Address: ${address}\n`;
message += `Payment: ${payment}\n\n`;

message += `Thank you.`;


const phoneNumber = "233208247186";  

const whatsappURL =
    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

window.open(whatsappURL, "_blank");

                    

        });

    }

}

function initShopPage() {

    const cards = document.querySelectorAll(
        ".products .card, .hidden-products .card"
    );

    cards.forEach(card => {

        const button = card.querySelector("button");

        if (!button) return;

        button.addEventListener("click", () => {

            const product = {

                name: card.querySelector("h3").textContent.trim(),

                price: parseFloat(
                    card.querySelector("p").textContent.replace(/[^0-9.]/g, "")
                ),

                image: card.querySelector("img").src

            };

            addToCart(product);

            button.textContent = "Added ✓";

            button.disabled = true;

            setTimeout(() => {

                button.textContent = "Add to Cart";

                button.disabled = false;

            }, 1000);

        });

    });

}

// ===============================
// CUSTOM IMAGE UPLOAD
// ===============================

const uploadZone = document.getElementById("uploadZone");

if (uploadZone) {

    const orderImageInput = document.getElementById("orderImageInput");
    const uploadPreview = document.getElementById("uploadPreview");
    const previewThumb = document.getElementById("previewThumb");
    const previewName = document.getElementById("previewName");
    const removeImageBtn = document.getElementById("removeImageBtn");

    function updatePreview(file) {

        const reader = new FileReader();

        reader.onload = () => {

            previewThumb.style.backgroundImage =
                `url(${reader.result})`;

            previewName.textContent = file.name;

            uploadPreview.classList.remove("hidden");

        };

        reader.readAsDataURL(file);

    }

    uploadZone.addEventListener("click", () => {
        orderImageInput.click();
    });

    orderImageInput.addEventListener("change", () => {

        if (orderImageInput.files.length > 0) {

            updatePreview(orderImageInput.files[0]);

        }

    });

    removeImageBtn.addEventListener("click", () => {

        orderImageInput.value = "";

        uploadPreview.classList.add("hidden");

        previewThumb.style.backgroundImage = "";

        previewName.textContent = "";

    });

}

function sendOrder() {

    const customerName = document.getElementById("customerName").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const product = document.getElementById("product").value;
    const flavor = document.getElementById("flavor").value;
    const size = document.getElementById("size").value;
    const shape = document.getElementById("shape").value;
    const quantity = document.getElementById("quantity").value;
    const occasion = document.getElementById("occasion").value;
    const theme = document.getElementById("theme").value;
    const eventDate = document.getElementById("eventDate").value;
    const deliveryMethod = document.getElementById("deliveryMethod").value;
    const deliveryAddress = document.getElementById("deliveryAddress").value;
    const budget = document.getElementById("budget").value;
    const specialRequest = document.getElementById("specialRequest").value;

    if (
        !customerName ||
        !phoneNumber ||
        !product ||
        !flavor ||
        !size ||
        !shape ||
        !quantity ||
        !occasion ||
        !eventDate ||
        !deliveryMethod
    ) {
        alert("Please fill in all required fields.");
        return;
    }

    let message = `🎂 *NEW CUSTOM ORDER* 🎂\n\n`;

    message += `👤 Name: ${customerName}\n`;
    message += `📞 Phone: ${phoneNumber}\n\n`;

    message += `🧁 Product: ${product}\n`;
    message += `🍫 Flavor: ${flavor}\n`;
    message += `📏 Size: ${size}\n`;
    message += `🔷 Shape: ${shape}\n`;
    message += `🔢 Quantity: ${quantity}\n`;
    message += `🎉 Occasion: ${occasion}\n`;

    if (theme)
        message += `🎨 Theme/Colours: ${theme}\n`;

    message += `📅 Event Date: ${eventDate}\n`;
    message += `🚚 Order Type: ${deliveryMethod}\n`;

    if (deliveryMethod === "Delivery" && deliveryAddress)
        message += `📍 Delivery Address: ${deliveryAddress}\n`;

    if (budget)
        message += `💰 Budget: ${budget}\n`;

    if (specialRequest)
        message += `📝 Special Request: ${specialRequest}\n`;

    message += `\nThank you!`;

    const bakeryNumber = "233208247186"; // Replace with your WhatsApp number

    const whatsappURL =
        `https://wa.me/${bakeryNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
}




// ===============================
// LOGIN & SIGNUP
// ===============================

// SIGN UP
function signUp(event) {
    event.preventDefault();

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Check if passwords match
    if (password !== confirmPassword) {
        alert("❌ Passwords do not match. Please try again.");
        return;
    }

    // Successful signup message
    alert("🎉 You have successfully signed up! Welcome to Whisks & Bloom.");

    // Take user to homepage after 2 seconds
    setTimeout(() => {
        window.location.href = "../index.html";
    }, 2000);
}


// LOGIN
function login(event) {
    event.preventDefault();

    // Successful login message
    alert("👋 Welcome back to Whisks & Bloom!");

    // Take user to homepage after 2 seconds
    setTimeout(() => {
        window.location.href = "../index.html";
    }, 2000);
}





// ===============================
// START EVERYTHING
// ===============================

updateCartCount();
initShopPage();
initCartPage();



