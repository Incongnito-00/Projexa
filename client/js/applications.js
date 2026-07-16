// applications.js

const API =
    window.API_URL ||
    window.API ||
    "https://projexa-backend-3ejy.onrender.com/api";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "../login.html";
}

const applicationList = document.getElementById("applicationList");

const totalApplications = document.getElementById("totalApplications");
const pendingApplications = document.getElementById("pendingApplications");
const acceptedApplications = document.getElementById("acceptedApplications");
const rejectedApplications = document.getElementById("rejectedApplications");

const refreshBtn = document.getElementById("refreshBtn");

let applications = [];

refreshBtn.addEventListener("click", loadApplications);

async function loadApplications() {

    applicationList.innerHTML = `
        <div class="empty">
            Loading applications...
        </div>
    `;

    try {

        const response = await fetch(`${API}/applications`, {

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        if (!response.ok) {

            throw new Error("Unable to load applications");

        }

        const data = await response.json();

        applications = Array.isArray(data)
            ? data
            : data.applications || [];

        updateStats();

        renderApplications();

    }

    catch (err) {

        console.error(err);

        applicationList.innerHTML = `
            <div class="empty">
                Failed to load applications.
            </div>
        `;

    }

}

function updateStats() {

    totalApplications.textContent = applications.length;

    pendingApplications.textContent =
        applications.filter(a => a.status === "Pending").length;

    acceptedApplications.textContent =
        applications.filter(a => a.status === "Accepted").length;

    rejectedApplications.textContent =
        applications.filter(a => a.status === "Rejected").length;

}

function renderApplications() {

    if (applications.length === 0) {

        applicationList.innerHTML = `
            <div class="empty">
                No applications found.
            </div>
        `;

        return;

    }

    applicationList.innerHTML = "";

    applications.forEach(application => {

        const card = document.createElement("div");

        card.className = "application";

        card.innerHTML = `

        <div class="top">

            <div>

                <div class="projectTitle">

                    ${application.project_title || "Untitled Project"}

                </div>

                <div class="user">

                    ${application.owner_name || "Unknown Owner"}

                </div>

            </div>

            <div class="badge ${application.status.toLowerCase()}">

                ${application.status}

            </div>

        </div>

        <div class="description">

            ${application.project_description || ""}

        </div>

        <div class="bottom">

            <div class="date">

                Applied:
                ${formatDate(application.created_at)}

            </div>

            <div class="actions">

                ${
                    application.status === "Pending"
                    ? `
                    <button
                        class="accept"
                        onclick="updateApplication(${application.id},'Accepted')"
                    >
                        Accept
                    </button>

                    <button
                        class="reject"
                        onclick="updateApplication(${application.id},'Rejected')"
                    >
                        Reject
                    </button>
                    `
                    : ""
                }

            </div>

        </div>

        `;

        applicationList.appendChild(card);

    });

}

async function updateApplication(id, status) {

    try {

        const response = await fetch(`${API}/applications/${id}`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify({

                status

            })

        });

        if (!response.ok) {

            throw new Error("Update failed");

        }

        loadApplications();

    }

    catch (err) {

        console.error(err);

        alert(err.message);

    }

}

function formatDate(date) {

    if (!date) return "";

    return new Date(date).toLocaleDateString();

}

loadApplications();