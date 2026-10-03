const API_BASE = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", () => {

    setupPasswordToggle(
        "togglePassword",
        "password"
    );


    setupPasswordToggle(
        "toggleConfirmPassword",
        "confirmPassword"
    );


    setupSignup();

    setupTerms();

});


/* ================= PASSWORD ================= */

function setupPasswordToggle(
    buttonId,
    inputId
) {

    const button =
        document.getElementById(
            buttonId
        );

    const input =
        document.getElementById(
            inputId
        );


    button.addEventListener(
        "click",
        () => {

            if (
                input.type ===
                "password"
            ) {

                input.type =
                    "text";

                button.innerHTML =
                    `<i class="fa-solid fa-eye-slash"></i>`;

            } else {

                input.type =
                    "password";

                button.innerHTML =
                    `<i class="fa-solid fa-eye"></i>`;

            }

        }
    );

}


/* ================= SIGNUP ================= */

function setupSignup() {

    const form =
        document.getElementById(
            "signupForm"
        );


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim()
                    .toLowerCase();


            const phone =
                document
                    .getElementById("phone")
                    .value
                    .trim();


            const location =
                document
                    .getElementById("location")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;


            const confirmPassword =
                document
                    .getElementById(
                        "confirmPassword"
                    )
                    .value;


            const terms =
                document
                    .getElementById("terms")
                    .checked;


            /* VALIDATION */

            if (
                name.length < 2
            ) {

                showMessage(
                    "Please enter a valid name.",
                    "error"
                );

                return;
            }


            if (
                password.length < 6
            ) {

                showMessage(
                    "Password must contain at least 6 characters.",
                    "error"
                );

                return;
            }


            if (
                password !==
                confirmPassword
            ) {

                showMessage(
                    "Passwords do not match.",
                    "error"
                );

                return;
            }


            if (!terms) {

                showMessage(
                    "Please accept Terms & Conditions.",
                    "error"
                );

                return;
            }


            setLoading(true);


            const userData = {

                name,

                email,

                phone,

                location,

                password

            };


            try {

                const response =
                    await fetch(
                        `${API_BASE}/signup`,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    userData
                                )

                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Unable to create account."
                    );

                }


                /*
                   Backend successful.
                */

                showMessage(
                    "Account created successfully! Redirecting...",
                    "success"
                );


                /*
                   Local copy ठेवतो जेणेकरून
                   profile/dashboard ला user
                   information मिळेल.
                */

                saveLocalUser(
                    userData
                );


                setTimeout(() => {

                    window.location.href =
                        "login.html";

                }, 1000);


            } catch (error) {

                console.error(error);


                /*
                   Backend unavailable असल्यास
                   demo/local registration.
                */

                saveRegisteredUser(
                    userData
                );


                showMessage(
                    "Account created successfully! Please login.",
                    "success"
                );


                setTimeout(() => {

                    window.location.href =
                        "login.html";

                }, 1000);

            } finally {

                setLoading(false);

            }

        }
    );

}


/* ================= LOCAL USER ================= */

function saveLocalUser(
    user
) {

    localStorage.setItem(
        "registeredUser",
        JSON.stringify(
            user
        )
    );

}


/* ================= REGISTERED USERS ================= */

function saveRegisteredUser(
    user
) {

    const users =
        JSON.parse(
            localStorage.getItem(
                "registeredUsers"
            ) || "[]"
        );


    const existing =
        users.find(
            item =>
                item.email ===
                user.email
        );


    if (existing) {

        Object.assign(
            existing,
            user
        );

    } else {

        users.push(
            user
        );

    }


    localStorage.setItem(
        "registeredUsers",
        JSON.stringify(
            users
        )
    );


    saveLocalUser(
        user
    );

}


/* ================= TERMS ================= */

function setupTerms() {

    document
        .getElementById(
            "termsLink"
        )
        .addEventListener(
            "click",
            event => {

                event.preventDefault();


                alert(
                    "By using SwapWear, you agree to use the platform responsibly and provide accurate information."
                );

            }
        );

}


/* ================= LOADING ================= */

function setLoading(
    loading
) {

    const button =
        document.getElementById(
            "signupButton"
        );

    const text =
        document.getElementById(
            "signupButtonText"
        );


    button.disabled =
        loading;


    text.textContent =
        loading
            ? "Creating Account..."
            : "Create Account";

}


/* ================= MESSAGE ================= */

function showMessage(
    message,
    type
) {

    const box =
        document.getElementById(
            "signupMessage"
        );


    box.textContent =
        message;


    box.style.color =
        type === "success"
            ? "#287a52"
            : "#d33";

}