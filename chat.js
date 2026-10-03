// =========================================================
// SWAPWEAR CHAT
// =========================================================

const API_BASE = "http://localhost:5000";


// =========================================================
// GLOBAL VARIABLES
// =========================================================

let currentUser = null;

let allUsers = [];

let allMessages = [];

let selectedUser = null;


// =========================================================
// GET CURRENT USER
// =========================================================

function getCurrentUser() {

    try {

        const userData =
            localStorage.getItem("user");

        if (userData) {

            const user =
                JSON.parse(userData);

            console.log(
                "CURRENT LOGGED-IN USER:",
                user
            );

            return user;

        }

    } catch (error) {

        console.error(
            "User JSON Error:",
            error
        );

    }


    // -----------------------------------------
    // Fallback
    // -----------------------------------------

    const email =
        localStorage.getItem("userEmail");

    const name =
        localStorage.getItem("username");


    if (email) {

        return {

            email: email,

            name:
                name || "User"

        };

    }


    return null;

}


// =========================================================
// GET USER ID
// =========================================================

function getUserId(user = currentUser) {

    if (!user) {
        return "";
    }


    return String(

        user._id ||
        user.id ||
        user.userId ||
        ""

    );

}


// =========================================================
// GET USER EMAIL
// =========================================================

function getUserEmail(user = currentUser) {

    if (!user) {
        return "";
    }


    return String(
        user.email || ""
    )
        .trim()
        .toLowerCase();

}


// =========================================================
// GET OBJECT ID
// =========================================================

function getObjectId(value) {

    if (!value) {
        return "";
    }


    if (typeof value === "string") {

        return value;

    }


    if (value._id) {

        return String(
            value._id
        );

    }


    if (value.id) {

        return String(
            value.id
        );

    }


    return "";

}


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =========================================================
// ESCAPE JS
// =========================================================

function escapeJS(value) {

    return String(value || "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r");

}


// =========================================================
// LOAD USERS
// =========================================================

async function loadUsers() {

    const list =
        document.getElementById(
            "conversationList"
        );


    if (!list) {
        return;
    }


    list.innerHTML = `
        <div class="no-chat">
            Loading users...
        </div>
    `;


    try {

        console.log(
            "Loading users..."
        );


        const response =
            await fetch(
                `${API_BASE}/api/auth/users`
            );


        console.log(
            "Users API Status:",
            response.status
        );


        const data =
            await response.json();


        console.log(
            "USERS API RESPONSE:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load users"
            );

        }


        if (
            data.success &&
            Array.isArray(data.users)
        ) {

            allUsers =
                data.users;

        } else {

            allUsers = [];

        }


        console.log(
            "TOTAL USERS:",
            allUsers.length
        );


        await loadMessages();


        renderConversations();


    } catch (error) {

        console.error(
            "LOAD USERS ERROR:",
            error
        );


        list.innerHTML = `
            <div class="no-chat">
                Failed to load users.
            </div>
        `;

    }

}


// =========================================================
// LOAD MESSAGES
// =========================================================

async function loadMessages() {

    const email =
        getUserEmail();


    if (!email) {

        console.warn(
            "Current user email not found."
        );

        allMessages = [];

        return;

    }


    try {

        /*
            Try current user's message endpoint.

            Your backend is mounted at:

            /api/messages
        */

        const url =
            `${API_BASE}/api/messages/${encodeURIComponent(email)}`;


        console.log(
            "Loading messages:",
            url
        );


        const response =
            await fetch(url);


        if (!response.ok) {

            console.warn(
                "Messages endpoint returned:",
                response.status
            );

            allMessages = [];

            return;

        }


        const data =
            await response.json();


        console.log(
            "MESSAGES API RESPONSE:",
            data
        );


        if (
            data.success &&
            Array.isArray(data.messages)
        ) {

            allMessages =
                data.messages;

        } else if (
            data.success &&
            Array.isArray(data.data)
        ) {

            allMessages =
                data.data;

        } else {

            allMessages = [];

        }


    } catch (error) {

        console.warn(
            "Messages could not be loaded:",
            error.message
        );

        allMessages = [];

    }

}


// =========================================================
// RENDER CONVERSATIONS
// =========================================================

function renderConversations() {

    const list =
        document.getElementById(
            "conversationList"
        );


    if (!list) {
        return;
    }


    const currentId =
        getUserId();


    const currentEmail =
        getUserEmail();


    const usersMap = {};


    // =====================================================
    // ADD ALL USERS
    // =====================================================

    allUsers.forEach(user => {

        const id =
            getObjectId(user);


        const email =
            getUserEmail(user);


        /*
            Current user skip
        */

        if (
            (
                id &&
                currentId &&
                id === currentId
            ) ||
            (
                email &&
                currentEmail &&
                email === currentEmail
            )
        ) {

            return;

        }


        /*
            EMAIL is primary unique key.
            This removes duplicate users.
        */

        const uniqueKey =
            email ||
            id;


        if (!uniqueKey) {
            return;
        }


        if (!usersMap[uniqueKey]) {

            usersMap[uniqueKey] = {

                id: id,

                name:
                    user.name ||
                    user.username ||
                    email ||
                    "User",

                email: email,

                lastMessage:
                    "Start a conversation",

                createdAt:
                    new Date(0)

            };

        }

    });


    // =====================================================
    // ADD USERS FROM EXISTING MESSAGES
    // =====================================================

    allMessages.forEach(message => {

        const sender =
            message.sender;


        const receiver =
            message.receiver;


        const senderEmail =
            getUserEmail(sender);


        const receiverEmail =
            getUserEmail(receiver);


        let otherUser = null;


        if (
            senderEmail &&
            senderEmail === currentEmail
        ) {

            otherUser =
                receiver;

        } else if (
            receiverEmail &&
            receiverEmail === currentEmail
        ) {

            otherUser =
                sender;

        }


        if (!otherUser) {
            return;
        }


        const otherId =
            getObjectId(otherUser);


        const otherEmail =
            getUserEmail(otherUser);


        const uniqueKey =
            otherEmail ||
            otherId;


        if (!uniqueKey) {
            return;
        }


        usersMap[uniqueKey] = {

            id: otherId,

            name:
                otherUser.name ||
                otherUser.username ||
                otherEmail ||
                "User",

            email:
                otherEmail,

            lastMessage:
                message.message ||
                "",

            createdAt:
                message.createdAt ||
                new Date()

        };

    });


    // =====================================================
    // ARRAY
    // =====================================================

    const conversationUsers =
        Object.values(
            usersMap
        );


    // =====================================================
    // SORT
    // =====================================================

    conversationUsers.sort(
        (a, b) => {

            return (

                new Date(
                    b.createdAt || 0
                ) -

                new Date(
                    a.createdAt || 0
                )

            );

        }
    );


    // =====================================================
    // MESSAGE COUNT
    // =====================================================

    const countElement =
        document.getElementById(
            "messageCount"
        );


    if (countElement) {

        countElement.textContent =
            conversationUsers.length;

    }


    // =====================================================
    // NO USERS
    // =====================================================

    if (
        conversationUsers.length === 0
    ) {

        list.innerHTML = `
            <div class="no-chat">
                No other users available.
            </div>
        `;

        return;

    }


    // =====================================================
    // DISPLAY USERS
    // =====================================================

    list.innerHTML =
        conversationUsers
            .map(user => {

                return `

                    <div
                        class="conversation"
                        data-id="${escapeHTML(user.id)}"
                        onclick="openConversation(
                            '${escapeJS(user.id)}',
                            '${escapeJS(user.name)}',
                            '${escapeJS(user.email)}'
                        )"
                    >

                        <div class="conversation-avatar">

                            <i class="fa-solid fa-user"></i>

                        </div>


                        <div class="conversation-info">

                            <h3>
                                ${escapeHTML(
                                    user.name
                                )}
                            </h3>

                            <p>
                                ${escapeHTML(
                                    user.lastMessage
                                )}
                            </p>

                        </div>

                    </div>

                `;

            })
            .join("");

}


// =========================================================
// OPEN CONVERSATION
// =========================================================

async function openConversation(
    userId,
    userName,
    userEmail
) {

    selectedUser = {

        id: userId,

        name: userName,

        email: userEmail

    };


    console.log(
        "SELECTED USER:",
        selectedUser
    );


    // =====================================================
    // UPDATE HEADER
    // =====================================================

    const nameElement =
        document.getElementById(
            "selectedUserName"
        );


    const emailElement =
        document.getElementById(
            "selectedUserEmail"
        );


    if (nameElement) {

        nameElement.textContent =
            userName;

    }


    if (emailElement) {

        emailElement.textContent =
            userEmail;

    }


    // =====================================================
    // ACTIVE USER
    // =====================================================

    document
        .querySelectorAll(
            ".conversation"
        )
        .forEach(item => {

            item.classList.remove(
                "active"
            );

        });


    const selectedElement =
        document.querySelector(
            `.conversation[data-id="${CSS.escape(userId)}"]`
        );


    if (selectedElement) {

        selectedElement.classList.add(
            "active"
        );

    }


    // =====================================================
    // LOAD CHAT MESSAGES
    // =====================================================

    await loadConversationMessages();


    // =====================================================
    // FOCUS INPUT
    // =====================================================

    const input =
        document.getElementById(
            "messageInput"
        );


    if (input) {

        input.focus();

    }

}


// =========================================================
// LOAD SELECTED CONVERSATION
// =========================================================

async function loadConversationMessages() {

    const area =
        document.getElementById(
            "messagesArea"
        );


    if (!area) {
        return;
    }


    if (!selectedUser) {

        return;

    }


    area.innerHTML = `
        <div class="no-chat">
            Loading messages...
        </div>
    `;


    try {

        const currentEmail =
            getUserEmail();


        /*
            First use already loaded messages.
        */

        const conversation =
            allMessages.filter(message => {

                const senderEmail =
                    getUserEmail(
                        message.sender
                    ) ||
                    String(
                        message.senderEmail ||
                        ""
                    )
                        .trim()
                        .toLowerCase();


                const receiverEmail =
                    getUserEmail(
                        message.receiver
                    ) ||
                    String(
                        message.receiverEmail ||
                        ""
                    )
                        .trim()
                        .toLowerCase();


                const selectedEmail =
                    String(
                        selectedUser.email ||
                        ""
                    )
                        .trim()
                        .toLowerCase();


                return (

                    (
                        senderEmail === currentEmail &&
                        receiverEmail === selectedEmail
                    )

                    ||

                    (
                        senderEmail === selectedEmail &&
                        receiverEmail === currentEmail
                    )

                );

            });


        renderMessages(
            conversation
        );


    } catch (error) {

        console.error(
            "LOAD CONVERSATION ERROR:",
            error
        );


        area.innerHTML = `
            <div class="no-chat">
                Could not load messages.
            </div>
        `;

    }

}


// =========================================================
// RENDER MESSAGES
// =========================================================

function renderMessages(messages) {

    const area =
        document.getElementById(
            "messagesArea"
        );


    if (!area) {
        return;
    }


    if (
        !messages ||
        messages.length === 0
    ) {

        area.innerHTML = `
            <div class="welcome-chat">

                <i class="fa-solid fa-comments"></i>

                <h2>
                    Start Conversation
                </h2>

                <p>
                    Send a message to start chatting.
                </p>

            </div>
        `;

        return;

    }


    area.innerHTML =
        messages
            .map(message => {

                const senderEmail =
                    getUserEmail(
                        message.sender
                    ) ||
                    String(
                        message.senderEmail ||
                        ""
                    )
                        .trim()
                        .toLowerCase();


                const isSent =
                    senderEmail ===
                    getUserEmail();


                const time =
                    message.createdAt
                        ? new Date(
                            message.createdAt
                        ).toLocaleTimeString(
                            [],
                            {
                                hour:
                                    "2-digit",

                                minute:
                                    "2-digit"
                            }
                        )
                        : "";


                return `

                    <div
                        class="message ${
                            isSent
                                ? "sent"
                                : "received"
                        }"
                    >

                        <div class="message-bubble">

                            <div>
                                ${escapeHTML(
                                    message.message
                                )}
                            </div>

                            <div class="message-time">
                                ${time}
                            </div>

                        </div>

                    </div>

                `;

            })
            .join("");


    area.scrollTop =
        area.scrollHeight;

}


// =========================================================
// SEND MESSAGE
// =========================================================

async function sendMessage() {

    const input =
        document.getElementById(
            "messageInput"
        );


    if (!input) {
        return;
    }


    const message =
        input.value.trim();


    // -----------------------------------------------------
    // Validation
    // -----------------------------------------------------

    if (!message) {

        return;

    }


    if (!currentUser) {

        alert(
            "Please login first."
        );

        return;

    }


    if (!selectedUser) {

        alert(
            "Please select a user first."
        );

        return;

    }


    const senderEmail =
        getUserEmail();


    const senderId =
        getUserId();


    const receiverEmail =
        String(
            selectedUser.email || ""
        )
            .trim()
            .toLowerCase();


    const receiverId =
        selectedUser.id;


    console.log(
        "SENDING MESSAGE..."
    );


    console.log({
        senderId,
        senderEmail,
        receiverId,
        receiverEmail,
        message
    });


    const sendButton =
        document.querySelector(
            ".send-btn"
        );


    if (sendButton) {

        sendButton.disabled =
            true;

    }


    try {

        /*
            IMPORTANT:

            Backend server.js:

            app.use(
                "/api/messages",
                messageRoutes
            );

            Therefore POST URL is:

            http://localhost:5000/api/messages
        */


        const payload = {

            sender:
                senderId || undefined,

            receiver:
                receiverId || undefined,

            senderEmail:
                senderEmail,

            receiverEmail:
                receiverEmail,

            senderName:
                currentUser.name ||
                currentUser.username ||
                "User",

            receiverName:
                selectedUser.name ||
                "User",

            message:
                message

        };


        console.log(
            "POST /api/messages PAYLOAD:",
            payload
        );


        const response =
            await fetch(
                `${API_BASE}/api/messages`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            payload
                        )

                }
            );


        console.log(
            "MESSAGE RESPONSE STATUS:",
            response.status
        );


        const text =
            await response.text();


        console.log(
            "MESSAGE RAW RESPONSE:",
            text
        );


        let data = null;


        try {

            data =
                JSON.parse(text);

        } catch {

            data = null;

        }


        if (!response.ok) {

            throw new Error(

                data?.message ||

                text ||

                `Message failed (${response.status})`

            );

        }


        console.log(
            "MESSAGE SENT SUCCESSFULLY:",
            data
        );


        // -------------------------------------------------
        // Clear input
        // -------------------------------------------------

        input.value = "";


        // -------------------------------------------------
        // Add message immediately
        // -------------------------------------------------

        const newMessage = {

            senderEmail:
                senderEmail,

            receiverEmail:
                receiverEmail,

            message:
                message,

            createdAt:
                new Date().toISOString()

        };


        allMessages.push(
            newMessage
        );


        await loadConversationMessages();


    } catch (error) {

        console.error(
            "SEND MESSAGE ERROR:",
            error
        );


        alert(
            "Message send झाला नाही.\n\n" +
            error.message
        );


    } finally {

        if (sendButton) {

            sendButton.disabled =
                false;

        }

    }

}


// =========================================================
// SEND BUTTON EVENT
// =========================================================

function setupMessageForm() {

    const input =
        document.getElementById("messageInput");

    const sendButton =
        document.querySelector(".send-btn");

    const form =
        document.getElementById("messageForm");


    console.log("INPUT:", input);
    console.log("SEND BUTTON:", sendButton);
    console.log("FORM:", form);


    // ==========================================
    // FORM SUBMIT
    // ==========================================

    if (form) {

        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                console.log(
                    "FORM SUBMITTED"
                );

                sendMessage();

            }
        );

    }


    // ==========================================
    // SEND BUTTON CLICK
    // ==========================================

    if (sendButton) {

        sendButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                console.log(
                    "SEND BUTTON CLICKED"
                );

                sendMessage();

            }
        );

    }

}



// =========================================================
// SEARCH USERS
// =========================================================

function setupSearch() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        function() {

            const search =
                this.value
                    .trim()
                    .toLowerCase();


            document
                .querySelectorAll(
                    ".conversation"
                )
                .forEach(item => {

                    const text =
                        item.textContent
                            .toLowerCase();


                    if (
                        text.includes(
                            search
                        )
                    ) {

                        item.style.display =
                            "flex";

                    } else {

                        item.style.display =
                            "none";

                    }

                });

        }
    );

}


// =========================================================
// MOBILE MENU
// =========================================================

function setupMobileMenu() {

    const menuBtn =
        document.getElementById(
            "menuBtn"
        );


    const navbar =
        document.getElementById(
            "navbar"
        );


    if (
        !menuBtn ||
        !navbar
    ) {

        return;

    }


    menuBtn.addEventListener(
        "click",
        function() {

            navbar.classList.toggle(
                "active"
            );

        }
    );

}


// =========================================================
// INITIALIZE
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        console.log(
            "Chat page loaded."
        );


        currentUser =
            getCurrentUser();


        if (!currentUser) {

            console.warn(
                "No logged-in user."
            );

            const list =
                document.getElementById(
                    "conversationList"
                );


            if (list) {

                list.innerHTML = `
                    <div class="no-chat">
                        Please login first.
                    </div>
                `;

            }

            return;

        }


        setupMessageForm();

        setupSearch();

        setupMobileMenu();


        await loadUsers();

    }
);