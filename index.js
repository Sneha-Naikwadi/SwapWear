document.addEventListener("DOMContentLoaded", () => {

    setupMenu();

    updateLoginButton();

});


/* ================= MOBILE MENU ================= */

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

        const icon =
            menuBtn.querySelector("i");


        if (navbar.classList.contains("show")) {

            icon.classList.remove(
                "fa-bars"
            );

            icon.classList.add(
                "fa-xmark"
            );

        } else {

            icon.classList.remove(
                "fa-xmark"
            );

            icon.classList.add(
                "fa-bars"
            );

        }

    });


    document
        .querySelectorAll("#navbar a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navbar.classList.remove(
                        "show"
                    );

                    const icon =
                        menuBtn.querySelector("i");

                    icon.classList.remove(
                        "fa-xmark"
                    );

                    icon.classList.add(
                        "fa-bars"
                    );

                }
            );

        });

}


/* ================= LOGIN STATE ================= */

function updateLoginButton() {

    const loginBtn =
        document.querySelector(
            ".login-btn"
        );


    if (!loginBtn) {
        return;
    }


    const user =
        getCurrentUser();


    if (user.email) {

        loginBtn.textContent =
            "Logout";

        loginBtn.href =
            "#";

        loginBtn.addEventListener(
            "click",
            logout
        );

    }

}


/* ================= GET USER ================= */

function getCurrentUser() {

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

        email:
            localStorage.getItem(
                "userEmail"
            ) || "",

        name:
            localStorage.getItem(
                "username"
            ) || ""

    };

}


/* ================= LOGOUT ================= */

function logout(event) {

    event.preventDefault();


    localStorage.removeItem("user");

    localStorage.removeItem(
        "userEmail"
    );

    localStorage.removeItem(
        "username"
    );

    localStorage.removeItem(
        "phone"
    );

    localStorage.removeItem(
        "location"
    );


    window.location.href =
        "index.html";

}