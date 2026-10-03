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
// MENU
// =====================================

function setupMenu() {

    const menuBtn =
        document.getElementById("menuBtn");

    const navbar =
        document.getElementById("navbar");


    if (!menuBtn || !navbar) {
        return;
    }


    menuBtn.addEventListener("click", () => {

        navbar.classList.toggle("show");

    });

}


// =====================================
// IMAGE PREVIEW
// =====================================

function setupImagePreview() {

    const input =
        document.getElementById("image");

    const preview =
        document.getElementById("imagePreview");


    if (!input || !preview) {
        return;
    }


    input.addEventListener("change", () => {

        const file =
            input.files[0];


        if (!file) {
            return;
        }


        if (!file.type.startsWith("image/")) {

            alert("Please select an image.");

            input.value = "";

            return;
        }


        const reader =
            new FileReader();


        reader.onload = event => {

            preview.innerHTML = `

                <img
                    src="${event.target.result}"
                    alt="Preview"
                    style="
                        width:100%;
                        height:100%;
                        object-fit:contain;
                        border-radius:10px;
                    "
                >

            `;

        };


        reader.readAsDataURL(file);

    });

}


// =====================================
// FORM
// =====================================

function setupForm() {

    const form =
        document.getElementById("addItemForm");


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        addProduct
    );

}


// =====================================
// ADD PRODUCT
// =====================================

async function addProduct(event) {

    event.preventDefault();


    // =====================================
    // GET USER
    // =====================================

    const user =
        getUser();


    if (!user.email) {

        showMessage(
            "Please login before adding an item.",
            "error"
        );


        setTimeout(() => {

            window.location.href =
                "login.html";

        }, 1200);


        return;
    }


    // =====================================
    // GET USER ID
    // =====================================

    const ownerId =
        user._id ||
        user.id ||
        user.userId;


    if (!ownerId) {

        showMessage(
            "User ID not found. Please login again.",
            "error"
        );


        return;
    }


    // =====================================
    // IMAGE
    // =====================================

    const imageInput =
        document.getElementById("image");


    const file =
        imageInput.files[0];


    if (!file) {

        showMessage(
            "Please select an image.",
            "error"
        );


        return;
    }


    // =====================================
    // GET BASIC FIELDS
    // =====================================

    const productName =
        document
            .getElementById("productName")
            .value
            .trim();


    const category =
        document
            .getElementById("category")
            .value;


    const size =
        document
            .getElementById("size")
            .value;


    const condition =
        document
            .getElementById("condition")
            .value;


    const brand =
        document
            .getElementById("brand")
            .value
            .trim();


    const description =
        document
            .getElementById("description")
            .value
            .trim();


    const location =
        document
            .getElementById("location")
            .value
            .trim();


    // =====================================
    // NEW FIELDS
    // =====================================

    const priceInput =
        document
            .getElementById("price")
            .value;


    const availableFor =
        document
            .getElementById("availableFor")
            .value;


    const pickupLocation =
        document
            .getElementById("pickupLocation")
            .value
            .trim();


    // =====================================
    // VALIDATION
    // =====================================

    if (!productName) {

        showMessage(
            "Please enter item name.",
            "error"
        );

        return;
    }


    if (!category) {

        showMessage(
            "Please select category.",
            "error"
        );

        return;
    }


    if (!size) {

        showMessage(
            "Please select size.",
            "error"
        );

        return;
    }


    if (!condition) {

        showMessage(
            "Please select condition.",
            "error"
        );

        return;
    }


    if (!description) {

        showMessage(
            "Please enter description.",
            "error"
        );

        return;
    }


    if (!location) {

        showMessage(
            "Please enter city.",
            "error"
        );

        return;
    }


    if (!availableFor) {

        showMessage(
            "Please select availability.",
            "error"
        );

        return;
    }


    if (!pickupLocation) {

        showMessage(
            "Please enter pickup location.",
            "error"
        );

        return;
    }


    // =====================================
    // PRICE VALIDATION
    // =====================================

    if (
        availableFor !== "Swap" &&
        (
            priceInput === "" ||
            Number(priceInput) <= 0
        )
    ) {

        showMessage(
            "Please enter a valid price.",
            "error"
        );

        return;
    }


    // =====================================
    // BUTTON
    // =====================================

    const submitBtn =
        document.getElementById("submitBtn");


    const submitText =
        document.getElementById("submitText");


    submitBtn.disabled = true;

    submitText.textContent =
        "Adding...";


    try {

        // =====================================
        // IMAGE TO BASE64
        // =====================================

        const imageBase64 =
            await fileToBase64(file);


        // =====================================
        // ITEM DATA
        // =====================================

        const itemData = {

            owner:
                ownerId,

            itemName:
                productName,

            category:
                category,

            size:
                size,

            condition:
                condition,

            description:
                description,

            location:
                location,


            // =================================
            // PRICE
            // =================================

            price:
                priceInput === ""
                    ? null
                    : Number(priceInput),


            // =================================
            // AVAILABLE FOR
            // =================================

            availableFor:
                availableFor,


            // =================================
            // PICKUP LOCATION
            // =================================

            pickupLocation:
                pickupLocation,


            // =================================
            // IMAGE
            // =================================

            image:
                imageBase64,

            images:
                [
                    imageBase64
                ]

        };


        console.log(
            "ITEM DATA:",
            itemData
        );


        // =====================================
        // SEND TO BACKEND
        // =====================================

        const response =
            await fetch(
                `${API_BASE}/api/items`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(itemData)
                }
            );


        const result =
            await response.json();


        console.log(
            "ADD ITEM RESPONSE:",
            result
        );


        if (!response.ok || !result.success) {

            throw new Error(
                result.message ||
                "Unable to add item."
            );

        }


        // =====================================
        // SUCCESS
        // =====================================

        showMessage(
            "Item added successfully! ✅",
            "success"
        );


        document
            .getElementById("addItemForm")
            .reset();


        document.getElementById(
            "imagePreview"
        ).innerHTML = `

            <i class="fa-solid fa-cloud-arrow-up"></i>

            <p>
                Upload clothing image
            </p>

        `;


        setTimeout(() => {

            window.location.href =
                "listings.html";

        }, 1200);


    }

    catch (error) {

        console.error(
            "ADD ITEM ERROR:",
            error
        );


        showMessage(
            error.message ||
            "Failed to add item.",
            "error"
        );

    }

    finally {

        submitBtn.disabled = false;

        submitText.textContent =
            "Add Item";

    }

}


// =====================================
// FILE TO BASE64
// =====================================

function fileToBase64(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                () => {

                    resolve(
                        reader.result
                    );

                };


            reader.onerror =
                reject;


            reader.readAsDataURL(file);

        }
    );

}


// =====================================
// GET USER
// =====================================

function getUser() {

    const stored =
        localStorage.getItem("user");


    if (stored) {

        try {

            return JSON.parse(stored);

        }

        catch (error) {

            console.error(
                "User JSON error:",
                error
            );

        }

    }


    return {

        _id:
            localStorage.getItem(
                "userId"
            ),

        email:
            localStorage.getItem(
                "userEmail"
            ) || "",

        name:
            localStorage.getItem(
                "username"
            ) || "User"

    };

}


// =====================================
// SHOW MESSAGE
// =====================================

function showMessage(
    message,
    type
) {

    const box =
        document.getElementById(
            "formMessage"
        );


    if (!box) {

        alert(message);

        return;
    }


    box.textContent =
        message;


    if (type === "success") {

        box.style.color =
            "#287a52";

    }

    else {

        box.style.color =
            "#d33";

    }

}