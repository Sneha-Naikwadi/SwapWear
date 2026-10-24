// ==========================================================
// SWAPWEAR - LISTINGS.JS
// ==========================================================

const API_URL = "https://swapwear-backend-3zzv.onrender.com";


// ==========================================================
// ELEMENTS
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
// LOCAL PRODUCTS - 48 IMAGES
// ==========================================================

const localProducts = [

    // ======================================================
    // CAPS - 6
    // ======================================================

    {
        _id: "local-cap",
        productName: "Stylish Cap",
        category: "Accessories",
        size: "Free Size",
        condition: "Good",
        brand: "Fashion",
        location: "Nearby",
        image: "images/cap.jpg",
        ownerEmail: "cap@swapwear.com"
    },

    {
        _id: "local-cap1",
        productName: "Casual Cap",
        category: "Accessories",
        size: "Free Size",
        condition: "Excellent",
        brand: "Jack & Jones",
        location: "Nearby",
        image: "images/cap1.jpg",
        ownerEmail: "cap1@swapwear.com"
    },

    {
        _id: "local-cap2",
        productName: "Classic Cap",
        category: "Accessories",
        size: "Free Size",
        condition: "Good",
        brand: "Sports",
        location: "Nearby",
        image: "images/cap2.jpg",
        ownerEmail: "cap2@swapwear.com"
    },

    {
        _id: "local-cap3",
        productName: "Sport Cap",
        category: "Accessories",
        size: "Free Size",
        condition: "Excellent",
        brand: "Sports",
        location: "Nearby",
        image: "images/cap3.jpg",
        ownerEmail: "cap3@swapwear.com"
    },

    {
        _id: "local-cap4",
        productName: "Fashion Cap",
        category: "Accessories",
        size: "Free Size",
        condition: "Good",
        brand: "Fashion",
        location: "Nearby",
        image: "images/cap4.jpg",
        ownerEmail: "cap4@swapwear.com"
    },

    {
        _id: "local-cap5",
        productName: "Premium Cap",
        category: "Accessories",
        size: "Free Size",
        condition: "Excellent",
        brand: "Premium",
        location: "Nearby",
        image: "images/cap5.jpg",
        ownerEmail: "cap5@swapwear.com"
    },


    // ======================================================
    // DRESSES - 6
    // ======================================================

    {
        _id: "local-dress",
        productName: "Elegant Dress",
        category: "Dresses",
        size: "M",
        condition: "Excellent",
        brand: "Fashion",
        location: "Nearby",
        image: "images/dress.jpg",
        ownerEmail: "dress@swapwear.com"
    },

    {
        _id: "local-dress1",
        productName: "Summer Dress",
        category: "Dresses",
        size: "M",
        condition: "Good",
        brand: "Style",
        location: "Nearby",
        image: "images/dress1.jpg",
        ownerEmail: "dress1@swapwear.com"
    },

    {
        _id: "local-dress2",
        productName: "Party Dress",
        category: "Dresses",
        size: "L",
        condition: "Excellent",
        brand: "Fashion",
        location: "Nearby",
        image: "images/dress2.jpg",
        ownerEmail: "dress2@swapwear.com"
    },

    {
        _id: "local-dress3",
        productName: "Floral Dress",
        category: "Dresses",
        size: "M",
        condition: "Good",
        brand: "Floral",
        location: "Nearby",
        image: "images/dress3.jpg",
        ownerEmail: "dress3@swapwear.com"
    },

    {
        _id: "local-dress4",
        productName: "Long Dress",
        category: "Dresses",
        size: "L",
        condition: "Excellent",
        brand: "Style",
        location: "Nearby",
        image: "images/dress4.jpg",
        ownerEmail: "dress4@swapwear.com"
    },

    {
        _id: "local-dress5",
        productName: "Classic Dress",
        category: "Dresses",
        size: "M",
        condition: "Good",
        brand: "Classic",
        location: "Nearby",
        image: "images/dress5.jpg",
        ownerEmail: "dress5@swapwear.com"
    },


    // ======================================================
    // HOODIES - 6
    // ======================================================

    {
        _id: "local-hoodie",
        productName: "Classic Hoodie",
        category: "Hoodies",
        size: "M",
        condition: "Good",
        brand: "Casual",
        location: "Nearby",
        image: "images/hoodie.jpg",
        ownerEmail: "hoodie@swapwear.com"
    },

    {
        _id: "local-hoodie1",
        productName: "Black Hoodie",
        category: "Hoodies",
        size: "L",
        condition: "Excellent",
        brand: "Urban",
        location: "Nearby",
        image: "images/hoodie1.jpg",
        ownerEmail: "hoodie1@swapwear.com"
    },

    {
        _id: "local-hoodie3",
        productName: "Casual Hoodie",
        category: "Hoodies",
        size: "M",
        condition: "Good",
        brand: "Casual",
        location: "Nearby",
        image: "images/hoodie3.jpg",
        ownerEmail: "hoodie3@swapwear.com"
    },

    {
        _id: "local-hoodie6",
        productName: "Winter Hoodie",
        category: "Hoodies",
        size: "L",
        condition: "Excellent",
        brand: "Winter",
        location: "Nearby",
        image: "images/hoodie6.jpg",
        ownerEmail: "hoodie6@swapwear.com"
    },

    {
        _id: "local-hoodie4",
        productName: "Sports Hoodie",
        category: "Hoodies",
        size: "M",
        condition: "Good",
        brand: "Sports",
        location: "Nearby",
        image: "images/hoodie4.jpg",
        ownerEmail: "hoodie4@swapwear.com"
    },

    {
        _id: "local-hoodie5",
        productName: "Premium Hoodie",
        category: "Hoodies",
        size: "L",
        condition: "Excellent",
        brand: "Premium",
        location: "Nearby",
        image: "images/hoodie5.jpg",
        ownerEmail: "hoodie5@swapwear.com"
    },


    // ======================================================
    // JACKETS - 6
    // ======================================================

    {
        _id: "local-jacket",
        productName: "Classic Jacket",
        category: "Jackets",
        size: "M",
        condition: "Good",
        brand: "Classic",
        location: "Nearby",
        image: "images/jacket.jpg",
        ownerEmail: "jacket@swapwear.com"
    },

    {
        _id: "local-jacket1",
        productName: "Denim Jacket",
        category: "Jackets",
        size: "L",
        condition: "Excellent",
        brand: "Denim",
        location: "Nearby",
        image: "images/jacket1.jpg",
        ownerEmail: "jacket1@swapwear.com"
    },

    {
        _id: "local-jacket2",
        productName: "Casual Jacket",
        category: "Jackets",
        size: "M",
        condition: "Good",
        brand: "Casual",
        location: "Nearby",
        image: "images/jacket2.jpg",
        ownerEmail: "jacket2@swapwear.com"
    },

    {
        _id: "local-jacket3",
        productName: "Stylish Jacket",
        category: "Jackets",
        size: "L",
        condition: "Excellent",
        brand: "Style",
        location: "Nearby",
        image: "images/jacket3.webp",
        ownerEmail: "jacket3@swapwear.com"
    },

    {
        _id: "local-jacket4",
        productName: "Winter Jacket",
        category: "Jackets",
        size: "M",
        condition: "Good",
        brand: "Winter",
        location: "Nearby",
        image: "images/jacket4.jpg",
        ownerEmail: "jacket4@swapwear.com"
    },

    {
        _id: "local-jacket5",
        productName: "Premium Jacket",
        category: "Jackets",
        size: "L",
        condition: "Excellent",
        brand: "Premium",
        location: "Nearby",
        image: "images/jacket5.jpg",
        ownerEmail: "jacket5@swapwear.com"
    },


    // ======================================================
    // JEANS - 6
    // ======================================================

    {
        _id: "local-jeans",
        productName: "Classic Jeans",
        category: "Jeans",
        size: "M",
        condition: "Good",
        brand: "Denim",
        location: "Nearby",
        image: "images/jeans.jpg",
        ownerEmail: "jeans@swapwear.com"
    },

    {
        _id: "local-jeans1",
        productName: "Blue Jeans",
        category: "Jeans",
        size: "M",
        condition: "Excellent",
        brand: "Denim",
        location: "Nearby",
        image: "images/jeans1.jpg",
        ownerEmail: "jeans1@swapwear.com"
    },

    {
        _id: "local-jeans2",
        productName: "Slim Fit Jeans",
        category: "Jeans",
        size: "L",
        condition: "Good",
        brand: "Fashion",
        location: "Nearby",
        image: "images/jeans2.jpg",
        ownerEmail: "jeans2@swapwear.com"
    },

    {
        _id: "local-jeans3",
        productName: "Casual Jeans",
        category: "Jeans",
        size: "M",
        condition: "Excellent",
        brand: "Casual",
        location: "Nearby",
        image: "images/jeans3.jpg",
        ownerEmail: "jeans3@swapwear.com"
    },

    {
        _id: "local-jeans4",
        productName: "Dark Jeans",
        category: "Jeans",
        size: "L",
        condition: "Good",
        brand: "Denim",
        location: "Nearby",
        image: "images/jeans4.jpg",
        ownerEmail: "jeans4@swapwear.com"
    },

    {
        _id: "local-jeans5",
        productName: "Premium Jeans",
        category: "Jeans",
        size: "M",
        condition: "Excellent",
        brand: "Premium",
        location: "Nearby",
        image: "images/jeans5.jpg",
        ownerEmail: "jeans5@swapwear.com"
    },


    // ======================================================
    // SHIRTS - 6
    // ======================================================

    {
        _id: "local-shirt",
        productName: "Classic Shirt",
        category: "Shirts",
        size: "M",
        condition: "Good",
        brand: "Classic",
        location: "Nearby",
        image: "images/shirt.jpg",
        ownerEmail: "shirt@swapwear.com"
    },

    {
        _id: "local-shirt1",
        productName: "Casual Shirt",
        category: "Shirts",
        size: "L",
        condition: "Excellent",
        brand: "Casual",
        location: "Nearby",
        image: "images/shirt1.jpg",
        ownerEmail: "shirt1@swapwear.com"
    },

    {
        _id: "local-shirt2",
        productName: "Formal Shirt",
        category: "Shirts",
        size: "M",
        condition: "Good",
        brand: "Formal",
        location: "Nearby",
        image: "images/shirt2.jpg",
        ownerEmail: "shirt2@swapwear.com"
    },

    {
        _id: "local-shirt3",
        productName: "Printed Shirt",
        category: "Shirts",
        size: "L",
        condition: "Excellent",
        brand: "Fashion",
        location: "Nearby",
        image: "images/shirt3.jpg",
        ownerEmail: "shirt3@swapwear.com"
    },

    {
        _id: "local-shirt4",
        productName: "Cotton Shirt",
        category: "Shirts",
        size: "M",
        condition: "Good",
        brand: "Cotton",
        location: "Nearby",
        image: "images/shirt4.jpg",
        ownerEmail: "shirt4@swapwear.com"
    },

    {
        _id: "local-shirt5",
        productName: "Premium Shirt",
        category: "Shirts",
        size: "L",
        condition: "Excellent",
        brand: "Premium",
        location: "Nearby",
        image: "images/shirt5.jpg",
        ownerEmail: "shirt5@swapwear.com"
    },


    // ======================================================
    // SNEAKERS / FOOTWEAR - 6
    // ======================================================

    {
        _id: "local-sneakers",
        productName: "Classic Sneakers",
        category: "Footwear",
        size: "8",
        condition: "Good",
        brand: "Sports",
        location: "Nearby",
        image: "images/sneakers.jpg",
        ownerEmail: "sneakers@swapwear.com"
    },

    {
        _id: "local-sneakers1",
        productName: "White Sneakers",
        category: "Footwear",
        size: "9",
        condition: "Excellent",
        brand: "Sports",
        location: "Nearby",
        image: "images/sneakers1.jpg",
        ownerEmail: "sneakers1@swapwear.com"
    },

    {
        _id: "local-sneakers2",
        productName: "Running Shoes",
        category: "Footwear",
        size: "8",
        condition: "Good",
        brand: "Running",
        location: "Nearby",
        image: "images/sneakers2.jpg",
        ownerEmail: "sneakers2@swapwear.com"
    },

    {
        _id: "local-sneakers3",
        productName: "Casual Sneakers",
        category: "Footwear",
        size: "9",
        condition: "Excellent",
        brand: "Casual",
        location: "Nearby",
        image: "images/sneakers3.jpg",
        ownerEmail: "sneakers3@swapwear.com"
    },

    {
        _id: "local-sneakers4",
        productName: "Sport Shoes",
        category: "Footwear",
        size: "8",
        condition: "Good",
        brand: "Sports",
        location: "Nearby",
        image: "images/sneakers4.jpg",
        ownerEmail: "sneakers4@swapwear.com"
    },

    {
        _id: "local-sneakers5",
        productName: "Premium Sneakers",
        category: "Footwear",
        size: "9",
        condition: "Excellent",
        brand: "Premium",
        location: "Nearby",
        image: "images/sneakers5.jpg",
        ownerEmail: "sneakers5@swapwear.com"
    },


    // ======================================================
    // T-SHIRTS - 6
    // ======================================================

    {
        _id: "local-tshirt",
        productName: "Classic T-Shirt",
        category: "T-Shirts",
        size: "M",
        condition: "Good",
        brand: "Casual",
        location: "Nearby",
        image: "images/tshirt.jpg",
        ownerEmail: "tshirt@swapwear.com"
    },

    {
        _id: "local-tshirt1",
        productName: "Black T-Shirt",
        category: "T-Shirts",
        size: "L",
        condition: "Excellent",
        brand: "Casual",
        location: "Nearby",
        image: "images/tshirt1.jpg",
        ownerEmail: "tshirt1@swapwear.com"
    },

    {
        _id: "local-tshirt2",
        productName: "White T-Shirt",
        category: "T-Shirts",
        size: "M",
        condition: "Good",
        brand: "Casual",
        location: "Nearby",
        image: "images/tshirt2.jpg",
        ownerEmail: "tshirt2@swapwear.com"
    },

    {
        _id: "local-tshirt3",
        productName: "Printed T-Shirt",
        category: "T-Shirts",
        size: "L",
        condition: "Excellent",
        brand: "Fashion",
        location: "Nearby",
        image: "images/tshirt3.jpg",
        ownerEmail: "tshirt3@swapwear.com"
    },

    {
        _id: "local-tshirt4",
        productName: "Cotton T-Shirt",
        category: "T-Shirts",
        size: "M",
        condition: "Good",
        brand: "Cotton",
        location: "Nearby",
        image: "images/tshirt4.jpg",
        ownerEmail: "tshirt4@swapwear.com"
    },

    {
        _id: "local-tshirt5",
        productName: "Premium T-Shirt",
        category: "T-Shirts",
        size: "L",
        condition: "Excellent",
        brand: "Premium",
        location: "Nearby",
        image: "images/tshirt5.jpg",
        ownerEmail: "tshirt5@swapwear.com"
    }

];


// ==========================================================
// CURRENT PRODUCTS
// ==========================================================

let allProducts = [...localProducts];

let filteredProducts = [...localProducts];


// ==========================================================
// CATEGORY OPTIONS
// ==========================================================

function updateCategoryOptions() {

    if (!categoryFilter) {
        return;
    }

    categoryFilter.innerHTML = `

        <option value="">
            All Categories
        </option>

        <option value="Accessories">
            Accessories
        </option>

        <option value="Dresses">
            Dresses
        </option>

        <option value="Hoodies">
            Hoodies
        </option>

        <option value="Jackets">
            Jackets
        </option>

        <option value="Jeans">
            Jeans
        </option>

        <option value="Shirts">
            Shirts
        </option>

        <option value="Footwear">
            Footwear
        </option>

        <option value="T-Shirts">
            T-Shirts
        </option>

    `;
}


// ==========================================================
// SIZE OPTIONS
// ==========================================================

function updateSizeOptions() {

    if (!sizeFilter) {
        return;
    }

    const sizes = [
        "Free Size",
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL",
        "8",
        "9"
    ];

    sizeFilter.innerHTML = `
        <option value="">All Sizes</option>
    `;

    sizes.forEach(size => {

        const option =
            document.createElement("option");

        option.value = size;
        option.textContent = size;

        sizeFilter.appendChild(option);
    });
}


// ==========================================================
// GET CURRENT USER
// ==========================================================

function getCurrentUser() {

    try {

        const user =
            JSON.parse(
                localStorage.getItem("user")
            );

        if (user) {
            return user;
        }

    } catch (error) {

        console.log(
            "User JSON error:",
            error
        );
    }

    const email =
        localStorage.getItem("userEmail");

    const username =
        localStorage.getItem("username");

    if (email || username) {

        return {

            email:
                email || "",

            name:
                username || "User",

            username:
                username || "User"

        };
    }

    return null;
}


// ==========================================================
// PRODUCT IMAGE
// ==========================================================

function getProductImage(product) {

    if (!product) {
        return "images/hero.png";
    }

    if (product.image) {
        return product.image;
    }

    if (product.imageUrl) {
        return product.imageUrl;
    }

    if (product.photo) {
        return product.photo;
    }

    if (product.productImage) {
        return product.productImage;
    }

    if (
        Array.isArray(product.images) &&
        product.images.length > 0
    ) {

        return product.images[0];
    }

    return "images/hero.png";
}


// ==========================================================
// ESCAPE HTML
// ==========================================================

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==========================================================
// LOAD PRODUCTS
// ==========================================================

async function loadProducts() {

    // First show local products immediately

    allProducts = [
        ...localProducts
    ];

    filteredProducts = [
        ...allProducts
    ];

    updateCategoryOptions();

    updateSizeOptions();

    renderProducts();


    // Then try backend products

    try {

        const response =
            await fetch(
                `${API_URL}/api/products`
            );


        if (!response.ok) {

            throw new Error(
                "Product API failed"
            );
        }


        const result =
            await response.json();


        console.log(
            "Backend Products:",
            result
        );


        let databaseProducts = [];


        if (
            Array.isArray(result)
        ) {

            databaseProducts =
                result;

        } else if (
            Array.isArray(result.data)
        ) {

            databaseProducts =
                result.data;

        } else if (
            Array.isArray(result.products)
        ) {

            databaseProducts =
                result.products;
        }


        // Add database products
        // without removing local products

        allProducts = [
            ...localProducts,
            ...databaseProducts
        ];


        filteredProducts = [
            ...allProducts
        ];


        renderProducts();


    } catch (error) {

        console.log(
            "Backend products not available:",
            error
        );

        // Local products remain visible
        // even when backend is unavailable.

        allProducts = [
            ...localProducts
        ];

        filteredProducts = [
            ...allProducts
        ];

        renderProducts();
    }
}


// ==========================================================
// FILTER PRODUCTS
// ==========================================================

function filterProducts() {

    const search =
        (
            searchInput?.value || ""
        )
        .toLowerCase()
        .trim();


    const category =
        categoryFilter?.value || "";


    const size =
        sizeFilter?.value || "";


    filteredProducts =
        allProducts.filter(product => {

            const name =
                (
                    product.productName ||
                    product.name ||
                    ""
                )
                .toLowerCase();


            const productCategory =
                product.category ||
                "";


            const productSize =
                product.size ||
                "";


            const matchesSearch =
                !search ||
                name.includes(search);


            const matchesCategory =
                !category ||
                productCategory === category;


            const matchesSize =
                !size ||
                productSize === size;


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
        return;
    }


    if (listingCount) {

        listingCount.textContent =
            `${filteredProducts.length} items`;
    }


    if (
        filteredProducts.length === 0
    ) {

        productsGrid.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-shirt"></i>

                <h3>
                    No clothes found
                </h3>

                <p>
                    Try another search or category.
                </p>

            </div>

        `;

        return;
    }


    productsGrid.innerHTML =
        filteredProducts
            .map(
                product =>
                    createProductCard(
                        product
                    )
            )
            .join("");
}


// ==========================================================
// CREATE PRODUCT CARD
// ==========================================================

function createProductCard(product) {

    const image =
        getProductImage(product);


    const name =
        product.productName ||
        product.name ||
        "Clothing Item";


    const category =
        product.category ||
        "Clothing";


    const size =
        product.size ||
        "Free Size";


    const condition =
        product.condition ||
        "Good";


    const location =
        product.location ||
        "Nearby";


    const id =
        product._id ||
        product.id ||
        Math.random()
            .toString(36)
            .substring(2);


    const favorites =
        JSON.parse(
            localStorage.getItem(
                "favorites"
            ) || "[]"
        );


    const isFavorite =
        favorites.includes(
            String(id)
        );


    return `

        <div
            class="product-card"
            data-id="${escapeHTML(id)}"
        >

            <div class="product-image">

                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(name)}"
                    onerror="this.src='images/hero.png'"
                >

                <button
                    class="favorite-btn ${isFavorite ? "active" : ""}"
                    onclick="toggleFavorite('${escapeHTML(id)}')"
                    type="button"
                >

                    <i class="${
                        isFavorite
                            ? "fa-solid"
                            : "fa-regular"
                    } fa-heart"></i>

                </button>

            </div>


            <div class="product-info">

                <h3>
                    ${escapeHTML(name)}
                </h3>

                <p>
                    ${escapeHTML(category)}
                </p>


                <div class="product-meta">

                    <span>
                        Size: ${escapeHTML(size)}
                    </span>

                    <span>
                        ${escapeHTML(condition)}
                    </span>

                </div>


                <p>
                    📍 ${escapeHTML(location)}
                </p>


                <button
                    class="swap-btn"
                    type="button"
                    onclick='sendSwapRequest(${JSON.stringify(product).replace(/'/g, "&#39;")})'
                >

                    🔄 Swap Now

                </button>

            </div>

        </div>

    `;
}


// ==========================================================
// FAVORITE
// ==========================================================

function toggleFavorite(id) {

    let favorites =
        JSON.parse(
            localStorage.getItem(
                "favorites"
            ) || "[]"
        );


    id = String(id);


    if (
        favorites.includes(id)
    ) {

        favorites =
            favorites.filter(
                item =>
                    item !== id
            );

    } else {

        favorites.push(id);
    }


    localStorage.setItem(
        "favorites",
        JSON.stringify(
            favorites
        )
    );


    renderProducts();
}


// ==========================================================
// SEND SWAP REQUEST
// ==========================================================

// ==========================================================
// SEND SWAP REQUEST
// ==========================================================

async function sendSwapRequest(product) {

    try {

        console.log("====================================");
        console.log("SEND SWAP REQUEST");
        console.log("PRODUCT:", product);
        console.log("====================================");


        // --------------------------------------------------
        // GET LOGGED-IN USER
        // --------------------------------------------------

        let user = null;

        try {
            user = JSON.parse(
                localStorage.getItem("user")
            );
        } catch (error) {
            user = null;
        }


        const userEmail =
            user?.email ||
            localStorage.getItem("userEmail") ||
            "";


        const userName =
            user?.name ||
            user?.username ||
            localStorage.getItem("username") ||
            "User";


        console.log("Logged in user:", user);
        console.log("User email:", userEmail);


        // --------------------------------------------------
        // LOGIN CHECK
        // --------------------------------------------------

        if (!userEmail) {

            alert(
                "Please login first to send a swap request."
            );

            window.location.href = "login.html";

            return;
        }


        // --------------------------------------------------
        // PRODUCT CHECK
        // --------------------------------------------------

        if (!product) {

            alert(
                "Product information not found."
            );

            return;
        }


        // --------------------------------------------------
        // GET OWNER EMAIL
        // --------------------------------------------------

        const ownerEmail =
            product.ownerEmail ||
            product.email ||
            product.owner?.email ||
            "";


        console.log(
            "Owner email:",
            ownerEmail
        );


        // --------------------------------------------------
        // OWN PRODUCT CHECK
        // --------------------------------------------------

        if (
            ownerEmail &&
            ownerEmail.toLowerCase() ===
            userEmail.toLowerCase()
        ) {

            alert(
                "You cannot send a swap request for your own item."
            );

            return;
        }


        // --------------------------------------------------
        // PRODUCT NAME
        // --------------------------------------------------

        const productName =
            product.productName ||
            product.name ||
            "Clothing Item";


        // --------------------------------------------------
        // CREATE REQUEST DATA
        // --------------------------------------------------

        const requestData = {

            item: product,

            requester: userEmail,

            requesterName: userName,

            requesterEmail: userEmail,

            owner: ownerEmail,

            ownerEmail: ownerEmail,

            ownerName:
                product.ownerName ||
                "",

            productName: productName,

            offeredItem: null,

            status: "pending",

            message: ""

        };


        console.log(
            "REQUEST DATA:",
            requestData
        );


        // --------------------------------------------------
        // SEND TO BACKEND
        // --------------------------------------------------

       
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



        // --------------------------------------------------
        // READ BACKEND RESPONSE
        // --------------------------------------------------

        const responseText =
            await response.text();


        console.log(
            "Backend status:",
            response.status
        );

        console.log(
            "Backend response:",
            responseText
        );


        let result = {};

        try {

            result =
                JSON.parse(
                    responseText
                );

        } catch (error) {

            console.error(
                "Invalid JSON response:",
                responseText
            );

        }


        // --------------------------------------------------
        // BACKEND ERROR
        // --------------------------------------------------

        if (!response.ok) {

            const errorMessage =
                result.message ||
                result.error ||
                responseText ||
                "Failed to send swap request";


            console.error(
                "SWAP REQUEST ERROR:",
                errorMessage
            );


            alert(
                "Unable to send swap request.\n\n" +
                errorMessage
            );

            return;
        }


        // --------------------------------------------------
        // SUCCESS
        // --------------------------------------------------

        if (
            result.success === true ||
            response.status === 201
        ) {

            console.log(
                "SWAP REQUEST SENT SUCCESSFULLY"
            );

            alert(
                "Swap request sent successfully!"
            );


            // Optional local backup
            // --------------------------------------------

            try {

                const existingRequests =
                    JSON.parse(
                        localStorage.getItem(
                            "swapRequests"
                        )
                    ) || [];


                existingRequests.push({

                    ...requestData,

                    _id:
                        result.data?._id ||
                        Date.now().toString(),

                    createdAt:
                        new Date().toISOString()

                });


                localStorage.setItem(
                    "swapRequests",
                    JSON.stringify(
                        existingRequests
                    )
                );

            } catch (error) {

                console.error(
                    "Local storage error:",
                    error
                );

            }


            return;
        }


        // --------------------------------------------------
        // UNKNOWN RESPONSE
        // --------------------------------------------------

        alert(
            result.message ||
            "Failed to send swap request."
        );


    } catch (error) {

        console.error(
            "SEND SWAP REQUEST ERROR:",
            error
        );


        alert(
            "Unable to send swap request.\n\n" +
            error.message
        );

    }

}


   
    

   



   




       
       


// ==========================================================
// CLEAR FILTER
// ==========================================================

if (clearBtn) {

    clearBtn.addEventListener(
        "click",
        function () {

            if (searchInput) {
                searchInput.value = "";
            }

            if (categoryFilter) {
                categoryFilter.value = "";
            }

            if (sizeFilter) {
                sizeFilter.value = "";
            }

            filteredProducts =
                [...allProducts];

            renderProducts();
        }
    );
}


// ==========================================================
// SEARCH
// ==========================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterProducts
    );
}


// ==========================================================
// CATEGORY FILTER
// ==========================================================

if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        filterProducts
    );
}


// ==========================================================
// SIZE FILTER
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

    menuBtn.addEventListener(
        "click",
        function () {

            nav.classList.toggle(
                "show"
            );
        }
    );
}


// ==========================================================
// START
// ==========================================================

updateCategoryOptions();

updateSizeOptions();

loadProducts();