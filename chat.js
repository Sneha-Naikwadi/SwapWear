
"use strict";

// =====================================================
// SWAPWEAR CHAT - UPDATED COMPLETE CODE
// =====================================================

const API_BASE = "http://localhost:5000";

let currentUser = null;
let allUsers = [];
let allMessages = [];
let selectedUser = null;
let isSending = false;

// =====================================================
// GET CURRENT USER
// =====================================================

function getCurrentUser() {
    let user = {};

    try {
        const stored = localStorage.getItem("user");

        if (stored) {
            const parsed = JSON.parse(stored);

            if (
                parsed &&
                typeof parsed === "object" &&
                !Array.isArray(parsed)
            ) {
                user = parsed;
            }
        }
    } catch (error) {
        console.error("User JSON Error:", error);
    }

    const savedUserId = localStorage.getItem("userId");
    const savedEmail = localStorage.getItem("userEmail");
    const savedName = localStorage.getItem("username");

    const userId =
        user._id ||
        user.id ||
        user.userId ||
        savedUserId ||
        "";

    const email = String(
        user.email || savedEmail || ""
    ).trim().toLowerCase();

    // No login details means no logged-in user
    if (!userId && !email) {
        return null;
    }

    return {
        ...user,
        _id: userId,
        email: email,
        name:
            user.name ||
            user.username ||
            savedName ||
            "User"
    };
}

// =====================================================
// GET USER ID
// =====================================================

function getUserId(user = currentUser) {
    if (!user) {
        return "";
    }

    const id =
        user._id ||
        user.id ||
        user.userId ||
        localStorage.getItem("userId") ||
        "";

    if (id && typeof id === "object") {
        return String(id._id || id.id || "");
    }

    return String(id).trim();
}

// =====================================================
// GET USER EMAIL
// =====================================================

function getUserEmail(user = currentUser) {
    if (!user) {
        return "";
    }

    return String(
        user.email ||
        localStorage.getItem("userEmail") ||
        ""
    ).trim().toLowerCase();
}

// =====================================================
// GET OBJECT ID
// =====================================================

function getObjectId(value) {
    if (!value) {
        return "";
    }

    if (typeof value === "string") {
        return value.trim();
    }

    if (typeof value === "object") {
        return String(
            value._id ||
            value.id ||
            value.userId ||
            ""
        ).trim();
    }

    return "";
}

// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// =====================================================
// ESCAPE JAVASCRIPT STRING
// =====================================================

function escapeJS(value) {
    return String(value ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\r/g, "\\r")
        .replace(/\n/g, "\\n");
}

// =====================================================
// API REQUEST HELPER
// =====================================================

async function apiRequest(url, options = {}) {
    const response = await fetch(url, options);
    const text = await response.text();

    let data = {};

    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        data = { message: text };
    }

    if (!response.ok) {
        throw new Error(
            data.message ||
            `Request failed with status ${response.status}`
        );
    }

    return data;
}

// =====================================================
// LOAD USERS
// =====================================================

async function loadUsers() {
    const list = document.getElementById("conversationList");

    if (!list) {
        return;
    }

    list.innerHTML = `
        <div class="no-chat">Loading users...</div>
    `;

    try {
        const data = await apiRequest(
            `${API_BASE}/api/auth/users`
        );

        console.log("USERS API RESPONSE:", data);

        if (Array.isArray(data.users)) {
            allUsers = data.users;
        } else if (Array.isArray(data.data)) {
            allUsers = data.data;
        } else {
            allUsers = [];
        }

        await loadMessages();
        renderConversations();

    } catch (error) {
        console.error("LOAD USERS ERROR:", error);

        list.innerHTML = `
            <div class="no-chat">
                Failed to load users. Check the backend server.
            </div>
        `;
    }
}

// =====================================================
// LOAD MESSAGES
// =====================================================

async function loadMessages() {
    const email = getUserEmail();

    if (!email) {
        allMessages = [];
        return;
    }

    try {
        const url =
            `${API_BASE}/api/messages/${encodeURIComponent(email)}`;

        const data = await apiRequest(url);

        console.log("MESSAGES API RESPONSE:", data);

        if (Array.isArray(data.messages)) {
            allMessages = data.messages;
        } else if (Array.isArray(data.data)) {
            allMessages = data.data;
        } else {
            allMessages = [];
        }

    } catch (error) {
        console.warn(
            "Could not load messages:",
            error.message
        );

        allMessages = [];
    }
}

// =====================================================
// NORMALIZE USER
// =====================================================

function normalizeUser(user) {
    const email = getUserEmail(user);
    const id = getObjectId(user);

    return {
        id,
        email,
        name:
            user.name ||
            user.username ||
            email ||
            "User"
    };
}

// =====================================================
// RENDER CONVERSATIONS
// =====================================================

function renderConversations() {
    const list = document.getElementById("conversationList");

    if (!list) {
        return;
    }

    const currentId = getUserId();
    const currentEmail = getUserEmail();

    const usersMap = new Map();

    // Add registered users
    allUsers.forEach(rawUser => {
        const user = normalizeUser(rawUser);

        // Do not display the logged-in user
        if (
            (currentId && user.id === currentId) ||
            (currentEmail && user.email === currentEmail)
        ) {
            return;
        }

        const key = user.email || user.id;

        if (!key) {
            return;
        }

        if (!usersMap.has(key)) {
            usersMap.set(key, {
                ...user,
                lastMessage: "Start a conversation",
                createdAt: 0
            });
        }
    });

    // Add conversation partners from previous messages
    allMessages.forEach(message => {
        const senderEmail =
            getUserEmail(message.sender) ||
            String(message.senderEmail || "").toLowerCase();

        const receiverEmail =
            getUserEmail(message.receiver) ||
            String(message.receiverEmail || "").toLowerCase();

        let otherUser = null;

        if (senderEmail === currentEmail) {
            otherUser = message.receiver;
        } else if (receiverEmail === currentEmail) {
            otherUser = message.sender;
        }

        if (!otherUser) {
            return;
        }

        const user = normalizeUser(otherUser);
        const key = user.email || user.id;

        if (!key || key === currentEmail || key === currentId) {
            return;
        }

        const existing = usersMap.get(key) || {};

        usersMap.set(key, {
            ...existing,
            ...user,
            lastMessage:
                message.message || "Start a conversation",
            createdAt:
                message.createdAt || existing.createdAt || 0
        });
    });

    const users = Array.from(usersMap.values());

    users.sort((a, b) => {
        return (
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        );
    });

    const countElement = document.getElementById("messageCount");

    if (countElement) {
        countElement.textContent = users.length;
    }

    if (users.length === 0) {
        list.innerHTML = `
            <div class="no-chat">
                No other users available.
            </div>
        `;
        return;
    }

    list.innerHTML = users.map(user => `
        <div
            class="conversation ${
                selectedUser &&
                (
                    selectedUser.id === user.id ||
                    selectedUser.email === user.email
                )
                    ? "active"
                    : ""
            }"
            data-id="${escapeHTML(user.id)}"
            data-email="${escapeHTML(user.email)}"
        >
            <div class="conversation-avatar">
                <i class="fa-solid fa-user"></i>
            </div>

            <div class="conversation-info">
                <h3>${escapeHTML(user.name)}</h3>
                <p>${escapeHTML(user.lastMessage)}</p>
            </div>
        </div>
    `).join("");

    // Add click events without inline JavaScript
    list.querySelectorAll(".conversation").forEach(element => {
        element.addEventListener("click", () => {
            const user = users.find(item =>
                item.id === element.dataset.id &&
                item.email === element.dataset.email
            );

            if (user) {
                openConversation(
                    user.id,
                    user.name,
                    user.email
                );
            }
        });
    });
}

// =====================================================
// OPEN CONVERSATION
// =====================================================

async function openConversation(userId, userName, userEmail) {
    selectedUser = {
        id: userId || "",
        name: userName || "User",
        email: String(userEmail || "").trim().toLowerCase()
    };

    const nameElement =
        document.getElementById("selectedUserName");

    const emailElement =
        document.getElementById("selectedUserEmail");

    if (nameElement) {
        nameElement.textContent = selectedUser.name;
    }

    if (emailElement) {
        emailElement.textContent = selectedUser.email;
    }

    document.querySelectorAll(".conversation").forEach(element => {
        element.classList.toggle(
            "active",
            element.dataset.id === selectedUser.id &&
            element.dataset.email === selectedUser.email
        );
    });

    await loadConversationMessages();

    const input = document.getElementById("messageInput");

    if (input) {
        input.focus();
    }
}

// =====================================================
// LOAD SELECTED CONVERSATION
// =====================================================

async function loadConversationMessages() {
    const area = document.getElementById("messagesArea");

    if (!area || !selectedUser) {
        return;
    }

    const currentEmail = getUserEmail();
    const selectedEmail = selectedUser.email;

    const conversation = allMessages.filter(message => {
        const senderEmail =
            getUserEmail(message.sender) ||
            String(message.senderEmail || "").trim().toLowerCase();

        const receiverEmail =
            getUserEmail(message.receiver) ||
            String(message.receiverEmail || "").trim().toLowerCase();

        return (
            (
                senderEmail === currentEmail &&
                receiverEmail === selectedEmail
            ) ||
            (
                senderEmail === selectedEmail &&
                receiverEmail === currentEmail
            )
        );
    });

    renderMessages(conversation);
}

// =====================================================
// RENDER MESSAGES
// =====================================================

function renderMessages(messages) {
    const area = document.getElementById("messagesArea");

    if (!area) {
        return;
    }

    if (!messages || messages.length === 0) {
        area.innerHTML = `
            <div class="welcome-chat">
                <i class="fa-solid fa-comments"></i>
                <h2>Start Conversation</h2>
                <p>Send a message to start chatting.</p>
            </div>
        `;
        return;
    }

    area.innerHTML = messages.map(message => {
        const senderEmail =
            getUserEmail(message.sender) ||
            String(message.senderEmail || "").trim().toLowerCase();

        const isSent = senderEmail === getUserEmail();

        let time = "";

        if (message.createdAt) {
            const date = new Date(message.createdAt);

            if (!Number.isNaN(date.getTime())) {
                time = date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                });
            }
        }

        return `
            <div class="message ${isSent ? "sent" : "received"}">
                <div class="message-bubble">
                    <div>${escapeHTML(message.message)}</div>
                    <div class="message-time">${escapeHTML(time)}</div>
                </div>
            </div>
        `;
    }).join("");

    area.scrollTop = area.scrollHeight;
}

// =====================================================
// SEND MESSAGE
// =====================================================

async function sendMessage() {
    const input = document.getElementById("messageInput");

    if (!input || isSending) {
        return;
    }

    const messageText = input.value.trim();

    if (!messageText) {
        return;
    }

    if (!currentUser) {
        alert("Please login first.");
        return;
    }

    if (!selectedUser) {
        alert("Please select a user first.");
        return;
    }

    const senderId = getUserId();
    const senderEmail = getUserEmail();

    const receiverId = selectedUser.id;
    const receiverEmail = selectedUser.email;

    if (!senderId && !senderEmail) {
        alert(
            "Sender details are missing. Please login again."
        );
        return;
    }

    if (!receiverId && !receiverEmail) {
        alert("Receiver details are missing. Select another user.");
        return;
    }

    if (
        senderEmail &&
        receiverEmail &&
        senderEmail === receiverEmail
    ) {
        alert("You cannot send a message to yourself.");
        return;
    }

    const sendButton = document.querySelector(".send-btn");

    isSending = true;

    if (sendButton) {
        sendButton.disabled = true;
    }

    try {
        // Send the ID and email fields expected by the current API.
        const payload = {
            sender: senderId || undefined,
            receiver: receiverId || undefined,
            senderEmail,
            receiverEmail,
            senderName:
                currentUser.name ||
                currentUser.username ||
                "User",
            receiverName: selectedUser.name || "User",
            message: messageText
        };

        console.log("SENDING MESSAGE:", {
            senderId,
            senderEmail,
            receiverId,
            receiverEmail
        });

        const data = await apiRequest(
            `${API_BASE}/api/messages`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            }
        );

        console.log("MESSAGE SENT:", data);

        input.value = "";

        // Refresh from the backend so saved messages are shown
        await loadMessages();

        // If the backend response contains the saved message,
        // use it if it was not included in the message list.
        if (data.message && typeof data.message === "object") {
            const savedMessage = data.message;

            const savedId = getObjectId(savedMessage);

            const alreadyExists = savedId &&
                allMessages.some(item => getObjectId(item) === savedId);

            if (savedId && !alreadyExists) {
                allMessages.push(savedMessage);
            }
        }

        await loadConversationMessages();

    } catch (error) {
        console.error("SEND MESSAGE ERROR:", error);

        alert(
            "Message send झाला नाही.\n\n" +
            error.message
        );

    } finally {
        isSending = false;

        if (sendButton) {
            sendButton.disabled = false;
        }
    }
}

// =====================================================
// MESSAGE FORM EVENTS
// =====================================================

function setupMessageForm() {
    const form = document.getElementById("messageForm");
    const input = document.getElementById("messageInput");
    const sendButton = document.querySelector(".send-btn");

    if (form) {
        form.addEventListener("submit", event => {
            event.preventDefault();
            sendMessage();
        });
    } else if (sendButton) {
        sendButton.addEventListener("click", event => {
            event.preventDefault();
            sendMessage();
        });
    }

    if (input) {
        input.addEventListener("keydown", event => {
            if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !form
            ) {
                event.preventDefault();
                sendMessage();
            }
        });
    }
}

// =====================================================
// SEARCH USERS
// =====================================================

function setupSearch() {
    const searchInput = document.getElementById("searchInput");

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener("input", () => {
        const search = searchInput.value.trim().toLowerCase();

        document.querySelectorAll(".conversation").forEach(item => {
            const text = item.textContent.toLowerCase();

            item.style.display = text.includes(search)
                ? "flex"
                : "none";
        });
    });
}

// =====================================================
// MOBILE MENU
// =====================================================

function setupMobileMenu() {
    const menuBtn = document.getElementById("menuBtn");
    const navbar = document.getElementById("navbar");

    if (!menuBtn || !navbar) {
        return;
    }

    menuBtn.addEventListener("click", () => {
        navbar.classList.toggle("show");
        navbar.classList.toggle("active");
    });
}

// =====================================================
// INITIALIZE CHAT
// =====================================================

document.addEventListener("DOMContentLoaded", async () => {
    console.log("SwapWear Chat Loaded");

    currentUser = getCurrentUser();

    if (!currentUser) {
        const list = document.getElementById("conversationList");

        if (list) {
            list.innerHTML = `
                <div class="no-chat">
                    Please login first.
                </div>
            `;
        }

        return;
    }

    console.log("Current user loaded:", {
        idAvailable: Boolean(getUserId()),
        emailAvailable: Boolean(getUserEmail())
    });

    setupMessageForm();
    setupSearch();
    setupMobileMenu();

    await loadUsers();
});
