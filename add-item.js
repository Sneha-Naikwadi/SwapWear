
const API_BASE = "http://localhost:5000";

// =====================================
// PAGE LOAD
// =====================================

document.addEventListener("DOMContentLoaded", () => {
    setupMenu();
    setupImagePreview();
    setupForm();
});

// =====================================
// MOBILE MENU
// =====================================

function setupMenu() {
    const menuBtn = document.getElementById("menuBtn");
    const navbar = document.getElementById("navbar");

    if (!menuBtn || !navbar) return;

    menuBtn.addEventListener("click", () => {
        navbar.classList.toggle("show");
    });
}

// =====================================
// IMAGE PREVIEW
// =====================================

function setupImagePreview() {
    const input = document.getElementById("image");
    const preview = document.getElementById("imagePreview");

    if (!input || !preview) return;

    input.addEventListener("change", () => {
        const file = input.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showMessage("Please select a valid image.", "error");
            input.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = event => {
            const img = document.createElement("img");
            img.src = event.target.result;
            img.alt = "Clothing preview";
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "contain";
            img.style.borderRadius = "10px";

            preview.replaceChildren(img);
        };

        reader.onerror = () => {
            showMessage("Unable to read the selected image.", "error");
        };

        reader.readAsDataURL(file);
    });
}

// =====================================
// FORM SETUP
// =====================================

function setupForm() {
    const form = document.getElementById("addItemForm");

    if (!form) return;

    form.addEventListener("submit", addProduct);
}

// =====================================
// ADD PRODUCT
// =====================================

async function addProduct(event) {
    event.preventDefault();

    const user = getUser();

    if (!user.email) {
        showMessage("Please login before adding an item.", "error");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1200);

        return;
    }

    const ownerId = user._id || user.id || user.userId;

    if (!ownerId) {
        showMessage(
            "User ID not found. Please login again.",
            "error"
        );
        return;
    }

    const imageInput = document.getElementById("image");
    const file = imageInput.files[0];

    if (!file) {
        showMessage("Please select an image.", "error");
        return;
    }

    const productName = document
        .getElementById("productName").value.trim();

    const category = document.getElementById("category").value;
    const size = document.getElementById("size").value;
    const condition = document.getElementById("condition").value;

    const brand = document
        .getElementById("brand").value.trim();

    const description = document
        .getElementById("description").value.trim();

    const location = document
        .getElementById("location").value.trim();

    const priceInput = document.getElementById("price").value;
    const availableFor = document.getElementById("availableFor").value;

    const pickupLocation = document
        .getElementById("pickupLocation").value.trim();

    // =====================================
    // VALIDATION
    // =====================================

    if (!productName) {
        showMessage("Please enter item name.", "error");
        return;
    }

    if (!category) {
        showMessage("Please select category.", "error");
        return;
    }

    if (!size) {
        showMessage("Please select size.", "error");
        return;
    }

    if (!condition) {
        showMessage("Please select condition.", "error");
        return;
    }

    if (!description) {
        showMessage("Please enter description.", "error");
        return;
    }

    if (!location) {
        showMessage("Please enter city.", "error");
        return;
    }

    if (!availableFor) {
        showMessage("Please select availability.", "error");
        return;
    }

    if (!pickupLocation) {
        showMessage("Please enter pickup location.", "error");
        return;
    }

    if (
        availableFor !== "Swap" &&
        (
            priceInput === "" ||
            !Number.isFinite(Number(priceInput)) ||
            Number(priceInput) <= 0
        )
    ) {
        showMessage("Please enter a valid price.", "error");
        return;
    }

    if (priceInput !== "" && Number(priceInput) < 0) {
        showMessage("Price cannot be negative.", "error");
        return;
    }

    // =====================================
    // BUTTON
    // =====================================

    const submitBtn = document.getElementById("submitBtn");
    const submitText = document.getElementById("submitText");

    submitBtn.disabled = true;
    submitText.textContent = "Adding...";

    try {
        // Convert image to Base64
        const imageBase64 = await fileToBase64(file);

        // =====================================
        // ITEM DATA
        // =====================================

        const itemData = {
            owner: ownerId,
            itemName: productName,
            category: category,
            size: size,
            condition: condition,
            brand: brand,
            description: description,
            location: location,

            price: priceInput === ""
                ? null
                : Number(priceInput),

            availableFor: availableFor,
            pickupLocation: pickupLocation,

            image: imageBase64,
            images: [imageBase64]
        };

        // =====================================
        // SEND DATA TO BACKEND
        // =====================================

        const response = await fetch(`${API_BASE}/api/items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(itemData)
        });

        let result;

        try {
            result = await response.json();
        } catch {
            throw new Error(
                `Server returned an invalid response (${response.status}).`
            );
        }

        console.log("ADD ITEM STATUS:", response.status);
        console.log("ADD ITEM RESPONSE:", result);

        if (!response.ok || result.success !== true) {
            throw new Error(
                result.message || "Unable to add item."
            );
        }

        // =====================================
        // SUCCESS
        // =====================================

        showMessage("Item added successfully!", "success");

        document.getElementById("addItemForm").reset();

        document.getElementById("imagePreview").innerHTML = `
            <i class="fa-solid fa-cloud-arrow-up"></i>
            <p>Upload clothing image</p>
        `;

        setTimeout(() => {
            window.location.href = "listings.html";
        }, 1200);

    } catch (error) {
        console.error("ADD ITEM ERROR:", error);

        showMessage(
            error.message || "Failed to add item.",
            "error"
        );

    } finally {
        submitBtn.disabled = false;
        submitText.textContent = "Add Item";
    }
}

// =====================================
// FILE TO BASE64
// =====================================

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = () => {
            reject(new Error("Unable to read image file."));
        };

        reader.readAsDataURL(file);
    });
}

// =====================================
// GET USER - UPDATED
// =====================================

function getUser() {
    let user = {};

    try {
        const stored = localStorage.getItem("user");

        if (stored) {
            user = JSON.parse(stored) || {};

            if (
                typeof user !== "object" ||
                Array.isArray(user) ||
                user === null
            ) {
                user = {};
            }
        }
    } catch (error) {
        console.error("User JSON error:", error);
        user = {};
    }

    // Read the saved user ID
    const savedUserId = localStorage.getItem("userId");

    const ownerId =
        user._id ||
        user.id ||
        user.userId ||
        savedUserId;

    return {
        ...user,
        _id: ownerId,
        email:
            user.email ||
            localStorage.getItem("userEmail") ||
            "",
        name:
            user.name ||
            localStorage.getItem("username") ||
            "User"
    };
}

// =====================================
// SHOW MESSAGE
// =====================================

function showMessage(message, type) {
    const box = document.getElementById("formMessage");

    if (!box) {
        alert(message);
        return;
    }

    box.textContent = message;

    box.style.color = type === "success"
        ? "#287a52"
        : "#d33";
}
