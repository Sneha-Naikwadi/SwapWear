// =====================================================
// SWAPWEAR DASHBOARD JS
// =====================================================

const API_BASE =
    "http://localhost:5000";



// =====================================================
// GET CURRENT USER
// =====================================================

function getCurrentUser() {

    let user = null;


    try {

        const storedUser =
            localStorage.getItem("user");


        if (storedUser) {

            user =
                JSON.parse(
                    storedUser
                );

        }

    }

    catch (error) {

        console.log(
            "User data parse error:",
            error
        );

    }



    const email =

        user?.email ||

        localStorage.getItem(
            "userEmail"
        ) ||

        "";



    const name =

        user?.name ||

        user?.username ||

        localStorage.getItem(
            "username"
        ) ||

        "User";



    return {

        email:
            String(email)
                .trim()
                .toLowerCase(),

        name:
            name

    };

}



// =====================================================
// LOAD SWAP REQUESTS
// =====================================================

async function loadSwapRequests() {

    const countElement =
        document.getElementById(
            "swapRequestsCount"
        );


    const listElement =
        document.getElementById(
            "swapRequestsList"
        );


    if (
        !countElement ||
        !listElement
    ) {

        console.error(
            "Swap request HTML elements not found."
        );

        return;

    }



    // =================================================
    // CURRENT USER
    // =================================================

    const user =
        getCurrentUser();


    console.log(
        "CURRENT LOGGED-IN USER:",
        user
    );



    if (!user.email) {

        countElement.textContent =
            "0";


        listElement.innerHTML = `

            <div class="empty-state">

                <p>
                    Please login first.
                </p>

            </div>

        `;

        return;

    }



    // =================================================
    // LOADING
    // =================================================

    countElement.textContent =
        "0";


    listElement.innerHTML = `

        <div class="empty-state">

            <p>
                Loading swap requests...
            </p>

        </div>

    `;



    try {

        // =============================================
        // API URL
        // =============================================

        const url =

            `${API_BASE}/api/swap-requests/` +

            `${encodeURIComponent(
                user.email
            )}`;


        console.log(
            "Fetching:",
            url
        );



        // =============================================
        // FETCH
        // =============================================

        const response =
            await fetch(url);


        const result =
            await response.json();


        console.log(
            "SWAP REQUEST API RESPONSE:",
            result
        );



        if (!response.ok) {

            throw new Error(

                result.message ||

                "Unable to load swap requests."

            );

        }



        if (
            result.success === false
        ) {

            throw new Error(

                result.message ||

                "Unable to load swap requests."

            );

        }



        // =============================================
        // REQUEST ARRAY
        // =============================================

        const requests =

            Array.isArray(
                result.requests
            )

                ? result.requests

                : [];



        console.log(
            "REQUESTS FOUND:",
            requests.length
        );



        // =============================================
        // COUNT
        // =============================================

        countElement.textContent =
            requests.length;



        // =============================================
        // NO REQUEST
        // =============================================

        if (
            requests.length === 0
        ) {

            listElement.innerHTML = `

                <div class="empty-state">

                    <p>
                        No swap requests yet.
                    </p>

                </div>

            `;

            return;

        }



        // =============================================
        // DISPLAY
        // =============================================

        listElement.innerHTML =

            requests
                .map(

                    request =>

                        createSwapRequestCard(

                            request,

                            user.email

                        )

                )
                .join("");


    }

    catch (error) {

        console.error(
            "LOAD SWAP REQUEST ERROR:",
            error
        );


        countElement.textContent =
            "0";


        listElement.innerHTML = `

            <div class="empty-state">

                <p>
                    Unable to load swap requests.
                </p>

                <small>
                    ${escapeHTML(
                        error.message
                    )}
                </small>

            </div>

        `;

    }

}



// =====================================================
// ACCEPT / REJECT REQUEST
// =====================================================

async function updateSwapRequestStatus(
    requestId,
    newStatus
) {

    try {

        console.log(
            "================================="
        );


        console.log(
            "UPDATING REQUEST"
        );


        console.log(
            "REQUEST ID:",
            requestId
        );


        console.log(
            "NEW STATUS:",
            newStatus
        );


        console.log(
            "================================="
        );



        // =============================================
        // CHECK ID
        // =============================================

        if (!requestId) {

            alert(
                "Request ID is missing."
            );

            return;

        }



        // =============================================
        // API CALL
        // =============================================

        const response =

            await fetch(

                `${API_BASE}/api/swap-requests/` +

                `${requestId}/status`,

                {

                    method:
                        "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            status:
                                newStatus

                        })

                }

            );



        const data =
            await response.json();



        console.log(
            "STATUS UPDATE RESPONSE:",
            data
        );



        // =============================================
        // ERROR
        // =============================================

        if (

            !response.ok ||

            !data.success

        ) {

            throw new Error(

                data.message ||

                "Failed to update request"

            );

        }



        // =============================================
        // SUCCESS
        // =============================================

        if (
            newStatus ===
            "accepted"
        ) {

            alert(
                "Swap request accepted successfully!"
            );

        }

        else if (
            newStatus ===
            "rejected"
        ) {

            alert(
                "Swap request rejected successfully!"
            );

        }



        // =============================================
        // RELOAD
        // =============================================

        await loadSwapRequests();

    }

    catch (error) {

        console.error(
            "STATUS UPDATE ERROR:",
            error
        );


        alert(

            "Unable to update swap request.\n\n" +

            error.message

        );

    }

}



// =====================================================
// CREATE REQUEST CARD
// =====================================================

function createSwapRequestCard(
    request,
    currentEmail
) {


    const item =
        request.item || {};



    // =================================================
    // PRODUCT NAME
    // =================================================

    const productName =

        request.productName ||

        item.productName ||

        item.name ||

        "Clothing Item";



    // =================================================
    // IMAGE
    // =================================================

    let image =

        item.image ||

        item.imageUrl ||

        item.photo ||

        item.productImage ||

        "";



    if (

        !image &&

        Array.isArray(
            item.images
        ) &&

        item.images.length > 0

    ) {

        image =
            item.images[0];

    }



    // =================================================
    // REQUESTER
    // =================================================

    const requesterName =

        request.requesterName ||

        "User";



    const requesterEmail =

        request.requesterEmail ||

        request.requester ||

        "";



    // =================================================
    // OWNER
    // =================================================

    const ownerEmail =

        request.ownerEmail ||

        request.owner ||

        "";



    // =================================================
    // STATUS
    // =================================================

    const status =

        String(

            request.status ||

            "pending"

        )

        .trim()

        .toLowerCase();



    // =================================================
    // RECEIVED REQUEST?
    // =================================================

    const received =

        ownerEmail
            .trim()
            .toLowerCase() ===

        currentEmail
            .trim()
            .toLowerCase();



    console.log(
        "REQUEST TYPE:",
        {

            productName,

            received,

            currentEmail,

            requesterEmail,

            ownerEmail,

            status,

            requestId:
                request._id

        }
    );



    // =================================================
    // DATE
    // =================================================

    let dateText =
        "";



    if (
        request.createdAt
    ) {

        const date =

            new Date(
                request.createdAt
            );


        if (
            !isNaN(
                date.getTime()
            )
        ) {

            dateText =
                date.toLocaleString();

        }

    }



    // =================================================
    // IMAGE HTML
    // =================================================

    let imageHTML = `

        <div
            style="
                display:flex;
                align-items:center;
                justify-content:center;
                height:100%;
                color:#999;
                font-size:14px;
            "
        >

            No Image

        </div>

    `;



    if (image) {

        imageHTML = `

            <img
                src="${escapeHTML(image)}"
                alt="${escapeHTML(productName)}"
            >

        `;

    }



    // =================================================
    // ACCEPT / REJECT BUTTONS
    // =================================================

    let actionButtons =
        "";


if (status === "pending") {

    actionButtons = `

        <div class="request-actions">

            <button
                type="button"
                class="accept-btn"
                onclick="
                    updateSwapRequestStatus(
                        '${request._id}',
                        'accepted'
                    )
                "
            >
                ✓ Accept
            </button>


            <button
                type="button"
                class="reject-btn"
                onclick="
                    updateSwapRequestStatus(
                        '${request._id}',
                        'rejected'
                    )
                "
            >
                ✕ Reject
            </button>

        </div>

    `;

}
   

    // =================================================
    // CARD
    // =================================================

    return `

        <div
            class="swap-request-card"
        >

            <div
                class="swap-request-image"
            >

                ${imageHTML}

            </div>


            <div
                class="swap-request-info"
            >

                <h3>

                    ${escapeHTML(
                        productName
                    )}

                </h3>



                ${
                    received

                        ? `

                            <p>

                                <strong>
                                    Request from:
                                </strong>

                                ${escapeHTML(
                                    requesterName
                                )}

                            </p>


                            <p>

                                <strong>
                                    Email:
                                </strong>

                                ${escapeHTML(
                                    requesterEmail
                                )}

                            </p>

                        `

                        : `

                            <p>

                                <strong>
                                    Request sent to:
                                </strong>

                                ${escapeHTML(
                                    ownerEmail
                                )}

                            </p>

                        `
                }



                <p>

                    <strong>
                        Status:
                    </strong>


                    <span
                        class="request-status ${escapeHTML(
                            status
                        )}"
                    >

                        ${escapeHTML(
                            status
                        )}

                    </span>

                </p>



                ${
                    request.message

                        ? `

                            <p>

                                <strong>
                                    Message:
                                </strong>

                                ${escapeHTML(
                                    request.message
                                )}

                            </p>

                        `

                        : ""

                }



                ${
                    dateText

                        ? `

                            <p
                                class="request-date"
                            >

                                ${escapeHTML(
                                    dateText
                                )}

                            </p>

                        `

                        : ""

                }



                ${actionButtons}

            </div>

        </div>

    `;

}



// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    return String(
        value ?? ""
    )

    .replace(
        /&/g,
        "&amp;"
    )

    .replace(
        /</g,
        "&lt;"
    )

    .replace(
        />/g,
        "&gt;"
    )

    .replace(
        /"/g,
        "&quot;"
    )

    .replace(
        /'/g,
        "&#039;"
    );

}



// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Dashboard loaded."
        );


        loadSwapRequests();

    }
);