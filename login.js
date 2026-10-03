const API_BASE = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", () => {

    setupPasswordToggle();

    setupLogin();

    setupForgotPassword();

    loadRememberedEmail();

});


/* ================= PASSWORD ================= */

function setupPasswordToggle() {

    const toggle =
        document.getElementById("togglePassword");

    const password =
        document.getElementById("password");


    if (!toggle || !password) {
        return;
    }


    toggle.addEventListener("click", () => {

        if (password.type === "password") {

            password.type = "text";

            toggle.innerHTML =
                `<i class="fa-solid fa-eye-slash"></i>`;

        } else {

            password.type = "password";

            toggle.innerHTML =
                `<i class="fa-solid fa-eye"></i>`;

        }

    });

}


/* ================= LOGIN ================= */

function setupLogin() {

    const form =
        document.getElementById("loginForm");


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("password")
                    .value;


            const remember =
                document
                    .getElementById("rememberMe")
                    .checked;


            if (!email || !password) {

                showMessage(
                    "Please enter email and password.",
                    "error"
                );

                return;
            }


            setLoading(true);


            try {

                /* =====================================
                   LOGIN API
                   ===================================== */

                const response =
    await fetch(
        `${API_BASE}/api/auth/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    email,
                                    password
                                })
                        }
                    );


                /* =====================================
                   READ RESPONSE SAFELY
                   ===================================== */

                const contentType =
                    response.headers.get(
                        "content-type"
                    ) || "";


                let result = {};


                if (
                    contentType.includes(
                        "application/json"
                    )
                ) {

                    result =
                        await response.json();

                } else {

                    const text =
                        await response.text();

                    console.error(
                        "LOGIN SERVER RESPONSE:",
                        text
                    );

                    throw new Error(
                        `Login API returned non-JSON response. Status: ${response.status}`
                    );
                }


                /* =====================================
                   CHECK RESPONSE
                   ===================================== */

                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Invalid email or password."
                    );
                }


                console.log(
                    "LOGIN API RESULT:",
                    result
                );


                /* =====================================
                   GET USER
                   ===================================== */

                const user =
                    result.user ||
                    result.data?.user ||
                    result.data ||
                    result;


                console.log(
                    "USER RECEIVED FROM BACKEND:",
                    user
                );


                /* =====================================
                   SAVE USER
                   ===================================== */

                saveUser(
                    user,
                    email
                );


                /* =====================================
                   SAVE TOKEN
                   ===================================== */

                if (result.token) {

                    localStorage.setItem(
                        "token",
                        result.token
                    );

                }


                /* =====================================
                   REMEMBER EMAIL
                   ===================================== */

                if (remember) {

                    localStorage.setItem(
                        "rememberedEmail",
                        email
                    );

                } else {

                    localStorage.removeItem(
                        "rememberedEmail"
                    );

                }


                /* =====================================
                   SUCCESS
                   ===================================== */

                showMessage(
                    "Login successful! Redirecting...",
                    "success"
                );


                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 700);


            } catch (error) {

                console.error(
                    "LOGIN ERROR:",
                    error
                );


                /* =====================================
                   LOCAL LOGIN FALLBACK
                   ===================================== */

                const registered =
                    JSON.parse(
                        localStorage.getItem(
                            "registeredUsers"
                        ) || "[]"
                    );


                const localUser =
                    registered.find(
                        user =>
                            user.email === email &&
                            user.password === password
                    );


                if (localUser) {

                    saveUser(
                        localUser,
                        email
                    );


                    showMessage(
                        "Login successful! Redirecting...",
                        "success"
                    );


                    setTimeout(() => {

                        window.location.href =
                            "dashboard.html";

                    }, 700);


                } else {

                    showMessage(
                        error.message ||
                        "Login failed. Please check your details.",
                        "error"
                    );

                }

            } finally {

                setLoading(false);

            }

        }
    );

}


/* ================= SAVE USER ================= */

function saveUser(
    user,
    email
) {

    console.log(
        "SAVE USER FUNCTION RECEIVED:",
        user
    );


    /* =====================================
       GET ACTUAL USER OBJECT
       ===================================== */

    const actualUser =
        user?.user ||
        user?.data?.user ||
        user;


    /* =====================================
       GET USER ID
       ===================================== */

    const userId =
        actualUser?.id ||
        actualUser?._id ||
        actualUser?.userId ||
        "";


    console.log(
        "USER ID FROM BACKEND:",
        userId
    );


    /* =====================================
       CREATE CURRENT USER
       ===================================== */

    const currentUser = {

        ...actualUser,

        id:
            userId || undefined,

        email:
            actualUser?.email ||
            email,

        name:
            actualUser?.name ||
            actualUser?.username ||
            localStorage.getItem(
                "username"
            ) ||
            "User"

    };


    /* =====================================
       SAVE USER OBJECT
       ===================================== */

    localStorage.setItem(
        "user",
        JSON.stringify(
            currentUser
        )
    );


    /* =====================================
       SAVE EMAIL
       ===================================== */

    localStorage.setItem(
        "userEmail",
        currentUser.email
    );


    /* =====================================
       SAVE NAME
       ===================================== */

    localStorage.setItem(
        "username",
        currentUser.name
    );


    /* =====================================
       SAVE USER ID
       ===================================== */

    if (userId) {

        localStorage.setItem(
            "userId",
            String(userId)
        );


        console.log(
            "USER ID SAVED SUCCESSFULLY:",
            userId
        );

    } else {

        console.error(
            "USER ID NOT FOUND IN LOGIN RESPONSE:",
            actualUser
        );

    }


    /* =====================================
       SAVE PHONE
       ===================================== */

    if (currentUser.phone) {

        localStorage.setItem(
            "phone",
            currentUser.phone
        );

    }


    /* =====================================
       SAVE LOCATION
       ===================================== */

    if (
        currentUser.location ||
        currentUser.city
    ) {

        localStorage.setItem(
            "location",
            currentUser.location ||
            currentUser.city
        );

    }

}


/* ================= FORGOT ================= */

function setupForgotPassword() {

    const forgotPassword =
        document.getElementById(
            "forgotPassword"
        );


    if (!forgotPassword) {
        return;
    }


    forgotPassword.addEventListener(
        "click",
        event => {

            event.preventDefault();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            if (!email) {

                showMessage(
                    "Enter your email first.",
                    "error"
                );

                return;
            }


            alert(
                "Password reset feature will be connected with your email OTP system."
            );

        }
    );

}


/* ================= REMEMBER ================= */

function loadRememberedEmail() {

    const email =
        localStorage.getItem(
            "rememberedEmail"
        );


    if (email) {

        const emailInput =
            document.getElementById(
                "email"
            );


        const remember =
            document.getElementById(
                "rememberMe"
            );


        if (emailInput) {

            emailInput.value =
                email;

        }


        if (remember) {

            remember.checked =
                true;

        }

    }

}


/* ================= LOADING ================= */

function setLoading(
    loading
) {

    const button =
        document.getElementById(
            "loginButton"
        );

    const text =
        document.getElementById(
            "loginButtonText"
        );


    if (button) {

        button.disabled =
            loading;

    }


    if (text) {

        text.textContent =
            loading
                ? "Logging in..."
                : "Login";

    }

}


/* ================= MESSAGE ================= */

function showMessage(
    message,
    type
) {

    const box =
        document.getElementById(
            "loginMessage"
        );


    if (!box) {
        return;
    }


    box.textContent =
        message;


    box.style.color =
        type === "success"
            ? "#287a52"
            : "#d33";

}