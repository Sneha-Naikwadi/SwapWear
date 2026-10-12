
// ==========================================================
// SWAPWEAR - LISTINGS.JS
// Complete Frontend + Render Backend Integration
// ==========================================================

const API_URL = "https://swapwear-backend-6jix.onrender.com";

// ==========================================================
// DOM ELEMENTS
// ==========================================================

const productsGrid = document.getElementById("productsGrid");
const listingCount = document.getElementById("listingCount");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sizeFilter = document.getElementById("sizeFilter");
const clearBtn = document.getElementById("clearBtn");
const menuBtn = document.getElementById("menuBtn");
const nav = document.querySelector("nav");

// ==========================================================
// GLOBAL DATA
// ==========================================================

let allProducts = [];
let filteredProducts = [];
const sendingRequests = new Set();

// ==========================================================
// GET CURRENT USER
// ==========================================================

function getCurrentUser() {
    const possibleKeys = [
        "user",
        "swapwearUser"
    ];

    for (const key of possibleKeys) {
        try {
            const user = JSON.parse(
                localStorage.getItem(key)
            );

            if (user && (user.email || user._id || user.id)) {
                return user;
            }
        } catch (error) {
            console.warn("Unable to read user:", key);
        }
    }

    const email =
        localStorage.getItem("userEmail") || "";

    const username =
        localStorage.getItem("username") || "";

    if (email) {
        return {
            email,
            name: username || "User"
        };
    }

    return null;
}

// ==========================================================
// HTML ESCAPE
// ==========================================================

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ==========================================================
// IMAGE URL
// ==========================================================

function getProductImage(product) {
    const image =
        product.image ||
        product.imageUrl ||
        product.productImage ||
        product.photo ||
        (Array.isArray(product.images)
            ? product.images[0]
            : "");

    if (!image) {
        return "images/hero.png";
    }

    if (
        image.startsWith("http://") ||
        image.startsWith("https://") ||
        image.startsWith("data:")
    ) {
        return image;
    }

    return image.replace(/^\.\//, "");
}

// ==========================================================
// NORMALIZE PRODUCT DATA
// ==========================================================

function normalizeProduct(product) {
    const owner =
        product.owner && typeof product.owner === "object"
            ? product.owner
            : {};

    return {
        ...product,

        _id: String(
            product._id || product.id || ""
        ),

        productName:
            product.productName ||
            product.title ||
            product.name ||
            "Clothing Item",

        category:
            product.category ||
            product.type ||
            "Other",

        size:
            product.size ||
            "Not specified",

        condition:
            product.condition ||
            "Good",

        brand:
            product.brand ||
            "Unbranded",

        location:
            product.location ||
            "Not specified",

        ownerEmail:
            product.ownerEmail ||
            owner.email ||
            product.email ||
            "",

        ownerId:
            product.ownerId ||
            owner._id ||
            product.userId ||
            "",

        ownerName:
            product.ownerName ||
            owner.name ||
            "Item Owner"
    };
}

// ==========================================================
// LOAD PRODUCTS FROM RENDER BACKEND
// ==========================================================

async function loadProducts() {
    if (productsGrid) {
        productsGrid.innerHTML =
            "<p>Loading clothing items...</p>";
    }

    try {
        // server.js mounts itemRoutes at /api/items
        const response = await fetch(
            `${API_URL}/api/items`
        );

        if (!response.ok) {
            throw new Error(
                `Products API failed: HTTP ${response.status}`
            );
        }

        const result = await response.json();

        console.log("Backend products:", result);

        let products = [];

        if (Array.isArray(result)) {
            products = result;
        } else if (Array.isArray(result.data)) {
            products = result.data;
        } else if (Array.isArray(result.items)) {
            products = result.items;
        } else if (Array.isArray(result.products)) {
            products = result.products;
        }

        allProducts = products.map(normalizeProduct);
        filteredProducts = [...allProducts];

        updateFilterOptions();
        renderProducts();

    } catch (error) {
        console.error("LOAD PRODUCTS ERROR:", error);

        if (productsGrid) {
            productsGrid.innerHTML = `
                <p>
                    Unable to load clothing items.
                    Please refresh the page and try again.
                </p>
            `;
        }

        if (listingCount) {
            listingCount.textContent = "0 items";
        }
    }
}

// ==========================================================
// FILTER OPTIONS
// ==========================================================

function updateFilterOptions() {
    if (categoryFilter) {
        const selectedCategory = categoryFilter.value;

        const categories = [
            ...new Set(
                allProducts
                    .map(product => product.category)
                    .filter(Boolean)
            )
        ];

        categoryFilter.innerHTML =
            '<option value="">All Categories</option>';

        categories.forEach(category => {
            const option = document.createElement("option");

            option.value = category;
            option.textContent = category;

            categoryFilter.appendChild(option);
        });

        if (categories.includes(selectedCategory)) {
            categoryFilter.value = selectedCategory;
        }
    }

    if (sizeFilter) {
        const selectedSize = sizeFilter.value;

        const sizes = [
            ...new Set(
                allProducts
                    .map(product => product.size)
                    .filter(Boolean)
            )
        ];

        sizeFilter.innerHTML =
            '<option value="">All Sizes</option>';

        sizes.forEach(size => {
            const option = document.createElement("option");

            option.value = size;
            option.textContent = size;

            sizeFilter.appendChild(option);
        });

        if (sizes.includes(selectedSize)) {
            sizeFilter.value = selectedSize;
        }
    }
}

// ==========================================================
// SEARCH AND FILTER
// ==========================================================

function filterProducts() {
    const search =
        (searchInput?.value || "")
            .trim()
            .toLowerCase();

    const category = categoryFilter?.value || "";
    const size = sizeFilter?.value || "";

    filteredProducts = allProducts.filter(product => {
        const searchableText = [
            product.productName,
            product.description,
            product.category,
            product.brand,
            product.location
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        const matchesSearch =
            searchableText.includes(search);

        const matchesCategory =
            !category ||
            product.category === category;

        const matchesSize =
            !size ||
            product.size === size;

        return (
            matchesSearch &&
            matchesCategory &&
            matchesSize
        );
    });

    renderProducts();
}

// ==========================================================
// RENDER PRODUCTS
// ==========================================================

function renderProducts() {
    if (!productsGrid) {
        console.error(
            'Element with id="productsGrid" was not found.'
        );
        return;
    }

    if (listingCount) {
        listingCount.textContent =
            `${filteredProducts.length} items`;
    }

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <h3>No clothing items found</h3>
                <p>Try another search or clear your filters.</p>
            </div>
        `;

        return;
    }

    productsGrid.innerHTML = filteredProducts
        .map(createProductCard)
        .join("");
}

// ==========================================================
// CREATE PRODUCT CARD
// ==========================================================

function createProductCard(product) {
    const id = escapeHTML(product._id);
    const name = escapeHTML(product.productName);
    const category = escapeHTML(product.category);
    const size = escapeHTML(product.size);
    const condition = escapeHTML(product.condition);
    const brand = escapeHTML(product.brand);
    const location = escapeHTML(product.location);
    const image = escapeHTML(getProductImage(product));

    return `
        <article class="product-card">
            <div class="product-image">
                <img
                    src="${image}"
                    alt="${name}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='images/hero.png';"
                >
            </div>

            <div class="product-details">
                <h3>${name}</h3>

                <p>
                    <strong>Category:</strong>
                    ${category}
                </p>

                <p>
                    <strong>Size:</strong>
                    ${size}
                </p>

                <p>
                    <strong>Condition:</strong>
                    ${condition}
                </p>

                <p>
                    <strong>Brand:</strong>
                    ${brand}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${location}
                </p>

                <button
                    type="button"
                    class="swap-now-btn"
                    data-product-id="${id}"
                >
                    Swap Now
                </button>
            </div>
        </article>
    `;
}

// ==========================================================
// FIND PRODUCT
// ==========================================================

function findProduct(productId) {
    return allProducts.find(
        product => String(product._id) === String(productId)
    );
}

// ==========================================================
// SEND SWAP REQUEST
// ==========================================================

async function sendSwapRequest(product) {
    if (!product) {
        alert("Product information not found.");
        return;
    }

    const user = getCurrentUser();

    if (!user) {
        alert("Please login first to send a swap request.");
        window.location.href = "login.html";
        return;
    }

    const userEmail = String(user.email || "")
        .trim()
        .toLowerCase();

    const userId = user._id || user.id || "";

    if (!userEmail && !userId) {
        alert("Please login again.");
        window.location.href = "login.html";
        return;
    }

    // Do not send requests for the user's own item.
    const ownerEmail = String(
        product.ownerEmail || ""
    ).trim().toLowerCase();

    const ownerId = String(
        product.ownerId || ""
    );

    if (
        (userEmail && ownerEmail &&
            userEmail === ownerEmail) ||
        (userId && ownerId &&
            String(userId) === ownerId)
    ) {
        alert("You cannot send a swap request for your own item.");
        return;
    }

    if (
        !product._id ||
        product._id.startsWith("local-")
    ) {
        alert(
            "This is not a database item. " +
            "Please select a clothing item saved in the backend."
        );
        return;
    }

    if (sendingRequests.has(product._id)) {
        alert("Your swap request is already being sent.");
        return;
    }

    const confirmed = confirm(
        `Send a swap request for "${product.productName}"?`
    );

    if (!confirmed) {
        return;
    }

    sendingRequests.add(product._id);

    try {
        const requestData = {
            item: product,
            itemId: product._id,
            productName: product.productName,

            requester: userEmail,
            requesterId: userId,
            requesterName:
                user.name ||
                user.username ||
                localStorage.getItem("username") ||
                "User",
            requesterEmail: userEmail,

            owner: ownerEmail,
            ownerId: ownerId,
            ownerEmail: ownerEmail,
            ownerName: product.ownerName || "",

            offeredItem: null,
            status: "pending",
            message: ""
        };

        console.log("Swap request payload:", requestData);

        const response = await fetch(
            `${API_URL}/api/swap-requests`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(requestData)
            }
        );

        const responseText = await response.text();

        let result = {};

        try {
            result = JSON.parse(responseText);
        } catch (error) {
            console.error(
                "Backend returned a non-JSON response:",
                responseText
            );
        }

        console.log("Swap request status:", response.status);
        console.log("Swap request result:", result);

        if (!response.ok) {
            throw new Error(
                result.message ||
                result.error ||
                `Request failed with status ${response.status}`
            );
        }

        alert(
            result.message ||
            "Swap request sent successfully!"
        );

    } catch (error) {
        console.error("SEND SWAP REQUEST ERROR:", error);

        alert(
            "Unable to send swap request.\n\n" +
            error.message
        );

    } finally {
        sendingRequests.delete(product._id);
    }
}

// ==========================================================
// BUTTON CLICK HANDLER
// ==========================================================

if (productsGrid) {
    productsGrid.addEventListener("click", event => {
        const button = event.target.closest(
            ".swap-now-btn"
        );

        if (!button) {
            return;
        }

        const product = findProduct(
            button.dataset.productId
        );

        sendSwapRequest(product);
    });
}

// ==========================================================
// CLEAR FILTERS
// ==========================================================

if (clearBtn) {
    clearBtn.addEventListener("click", () => {
        if (searchInput) {
            searchInput.value = "";
        }

        if (categoryFilter) {
            categoryFilter.value = "";
        }

        if (sizeFilter) {
            sizeFilter.value = "";
        }

        filteredProducts = [...allProducts];
        renderProducts();
    });
}

// ==========================================================
// SEARCH EVENT
// ==========================================================

if (searchInput) {
    searchInput.addEventListener(
        "input",
        filterProducts
    );
}

// ==========================================================
// CATEGORY EVENT
// ==========================================================

if (categoryFilter) {
    categoryFilter.addEventListener(
        "change",
        filterProducts
    );
}

// ==========================================================
// SIZE EVENT
// ==========================================================

if (sizeFilter) {
    sizeFilter.addEventListener(
        "change",
        filterProducts
    );
}

// ==========================================================
// MOBILE MENU
// ==========================================================

if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
        nav.classList.toggle("show");
    });
}

// ==========================================================
// START APPLICATION
// ==========================================================

loadProducts();
