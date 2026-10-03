const API_BASE = "http://localhost:5000";

let currentUser = {};
let originalData = {};

document.addEventListener("DOMContentLoaded", () => {

    setupMenu();

    currentUser = getUser();

    loadProfile();

    loadProfileStats();

    setupEdit();

    setupLogout();

});


/* MENU */

function setupMenu() {

    const menuBtn =
        document.getElementById("menuBtn");

    const navbar =
        document.getElementById("navbar");

    menuBtn.addEventListener("click", () => {

        navbar.classList.toggle("show");

    });
}


/* USER */

function getUser() {

    const stored =
        localStorage.getItem("user");

    if (stored) {

        try {

            return JSON.parse(stored);

        } catch {

            return {
                email: stored
            };

        }
    }


    return {

        name:
            localStorage.getItem(
                "username"
            ) || "User",

        email:
            localStorage.getItem(
                "userEmail"
            ) || "",

        phone:
            localStorage.getItem(
                "phone"
            ) || "",

        location:
            localStorage.getItem(
                "location"
            ) || ""

    };
}


/* LOAD PROFILE */

function loadProfile() {

    const name =
        currentUser.name ||
        currentUser.username ||
        "User";

    const email =
        currentUser.email ||
        "";

    const phone =
        currentUser.phone ||
        "";

    const location =
        currentUser.location ||
        currentUser.city ||
        "";


    document.getElementById(
        "profileName"
    ).textContent = name;


    document.getElementById(
        "profileEmail"
    ).textContent = email;


    document.getElementById(
        "name"
    ).value = name;


    document.getElementById(
        "email"
    ).value = email;


    document.getElementById(
        "phone"
    ).value = phone;


    document.getElementById(
        "location"
    ).value = location;


    document.getElementById(
        "avatar"
    ).textContent =
        name.charAt(0).toUpperCase();


    originalData = {

        name,

        email,

        phone,

        location

    };
}


/* STATS */

async function loadProfileStats() {

    /* Favorites */

    const favorites =
        JSON.parse(
            localStorage.getItem(
                "favorites"
            ) || "[]"
        );


    document.getElementById(
        "favoriteCount"
    ).textContent =
        favorites.length;


    /* Local swap requests */

    const requests =
        JSON.parse(
            localStorage.getItem(
                "swapRequests"
            ) || "[]"
        );


    const userRequests =
        requests.filter(request => {

            return (
                request.ownerEmail ===
                currentUser.email ||

                request.requesterEmail ===
                currentUser.email
            );

        });


    document.getElementById(
        "requestCount"
    ).textContent =
        userRequests.length;


    /* Products */

    try {

        const response =
            await fetch(
                `${API_BASE}/api/products`
            );


        if (!response.ok) {
            throw new Error();
        }


        const result =
            await response.json();


        const products =
            result.data ||
            result.products ||
            result ||
            [];


        const myItems =
            Array.isArray(products)
                ? products.filter(item => {

                    const email =
                        item.ownerEmail ||
                        item.email ||
                        item.userEmail ||
                        "";


                    return (
                        email.toLowerCase() ===
                        currentUser.email.toLowerCase()
                    );

                })
                : [];


        document.getElementById(
            "itemCount"
        ).textContent =
            myItems.length;


    } catch {

        const localProducts =
            JSON.parse(
                localStorage.getItem(
                    "localProducts"
                ) || "[]"
            );


        document.getElementById(
            "itemCount"
        ).textContent =
            localProducts.filter(item => {

                return item.ownerEmail ===
                    currentUser.email;

            }).length;

    }
}


/* EDIT */

function setupEdit() {

    const editBtn =
        document.getElementById(
            "editBtn"
        );


    const cancelBtn =
        document.getElementById(
            "cancelBtn"
        );


    const saveButtons =
        document.getElementById(
            "saveButtons"
        );


    editBtn.addEventListener(
        "click",
        () => {

            document
                .querySelectorAll(
                    "#profileForm input"
                )
                .forEach(input => {

                    if (
                        input.id !== "email"
                    ) {

                        input.disabled =
                            false;

                    }

                });


            editBtn.style.display =
                "none";


            saveButtons.style.display =
                "flex";

        }
    );


    cancelBtn.addEventListener(
        "click",
        () => {

            cancelEdit();

        }
    );


    document
        .getElementById("profileForm")
        .addEventListener(
            "submit",
            saveProfile
        );

}


/* CANCEL */

function cancelEdit() {

    document.getElementById(
        "name"
    ).value =
        originalData.name;


    document.getElementById(
        "phone"
    ).value =
        originalData.phone;


    document.getElementById(
        "location"
    ).value =
        originalData.location;


    document
        .querySelectorAll(
            "#profileForm input"
        )
        .forEach(input => {

            input.disabled = true;

        });


    document.getElementById(
        "editBtn"
    ).style.display =
        "block";


    document.getElementById(
        "saveButtons"
    ).style.display =
        "none";

}


/* SAVE */

async function saveProfile(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "name"
        ).value.trim();


    const phone =
        document.getElementById(
            "phone"
        ).value.trim();


    const location =
        document.getElementById(
            "location"
        ).value.trim();


    if (!name) {

        showMessage(
            "Name is required.",
            "error"
        );

        return;
    }


    currentUser.name =
        name;

    currentUser.phone =
        phone;

    currentUser.location =
        location;


    localStorage.setItem(
        "user",
        JSON.stringify(
            currentUser
        )
    );


    localStorage.setItem(
        "username",
        name
    );


    localStorage.setItem(
        "phone",
        phone
    );


    localStorage.setItem(
        "location",
        location
    );


    document.getElementById(
        "profileName"
    ).textContent =
        name;


    document.getElementById(
        "avatar"
    ).textContent =
        name.charAt(0).toUpperCase();


    originalData = {

        name,

        email:
            currentUser.email,

        phone,

        location

    };


    cancelEdit();


    showMessage(
        "Profile updated successfully! ✅",
        "success"
    );

}


/* MESSAGE */

function showMessage(
    message,
    type
) {

    const box =
        document.getElementById(
            "profileMessage"
        );


    box.textContent =
        message;


    box.style.color =
        type === "success"
            ? "#287a52"
            : "#d33";


    setTimeout(() => {

        box.textContent = "";

    }, 3000);

}


/* LOGOUT */

function setupLogout() {

    document
        .getElementById("logoutBtn")
        .addEventListener(
            "click",
            event => {

                event.preventDefault();

                localStorage.removeItem(
                    "user"
                );

                localStorage.removeItem(
                    "userEmail"
                );

                localStorage.removeItem(
                    "username"
                );

                window.location.href =
                    "login.html";

            }
        );

}