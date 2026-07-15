// profile.js

const API =
    window.API_URL ||
    window.API ||
    "https://projexa-backend-13sp.onrender.com/api";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "../login.html";
}

const loading = document.getElementById("loading");
const profileContent = document.getElementById("profileContent");

const avatar = document.getElementById("avatar");
const nameElement = document.getElementById("name");
const emailElement = document.getElementById("email");
const collegeElement = document.getElementById("college");
const joinedElement = document.getElementById("joined");

const projectsCount = document.getElementById("projectsCount");
const applicationsCount = document.getElementById("applicationsCount");
const acceptedCount = document.getElementById("acceptedCount");

const projectsList = document.getElementById("projectsList");
const applicationsList = document.getElementById("applicationsList");

let profile = {};

async function loadProfile() {

    try {

        const response = await fetch(`${API}/users/profile`, {

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        if (!response.ok) {

            throw new Error("Unable to load profile.");

        }

        profile = await response.json();

        renderProfile();

    }

    catch (err) {

        console.error(err);

        loading.innerHTML = `
            <h2>Failed to load profile.</h2>
        `;

    }

}

function renderProfile() {

    loading.style.display = "none";
    profileContent.style.display = "block";

    nameElement.textContent =
        profile.name || "Unknown User";

    emailElement.textContent =
        profile.email || "";

    collegeElement.textContent =
        profile.college || "";

    joinedElement.textContent =
        "Joined : " + formatDate(profile.created_at);

    avatar.textContent =
        (profile.name || "P").charAt(0).toUpperCase();

    const projects = profile.projects || [];
    const applications = profile.applications || [];

    projectsCount.textContent = projects.length;

    applicationsCount.textContent = applications.length;

    acceptedCount.textContent =
        applications.filter(app => app.status === "Accepted").length;

    renderProjects(projects);

    renderApplications(applications);

}

function renderProjects(projects) {

    projectsList.innerHTML = "";

    if (projects.length === 0) {

        projectsList.innerHTML = `
            <div class="item">
                No projects posted yet.
            </div>
        `;

        return;

    }

    projects.forEach(project => {

        const div = document.createElement("div");

        div.className = "item";

        div.innerHTML = `

            <div>

                <strong>${project.title}</strong>

                <br>

                <small>

                    ${project.category || "General"}

                </small>

            </div>

            <span class="badge">

                ${project.status || "Open"}

            </span>

        `;

        projectsList.appendChild(div);

    });

}

function renderApplications(applications) {

    applicationsList.innerHTML = "";

    if (applications.length === 0) {

        applicationsList.innerHTML = `
            <div class="item">
                No applications submitted.
            </div>
        `;

        return;

    }

    applications.forEach(application => {

        const div = document.createElement("div");

        div.className = "item";

        div.innerHTML = `

            <div>

                <strong>

                    ${application.project_title || "Project"}

                </strong>

                <br>

                <small>

                    ${formatDate(application.created_at)}

                </small>

            </div>

            <span class="badge">

                ${application.status}

            </span>

        `;

        applicationsList.appendChild(div);

    });

}

function formatDate(date) {

    if (!date) return "";

    return new Date(date).toLocaleDateString();

}

loadProfile();