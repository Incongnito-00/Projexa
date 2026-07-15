const API = "https://projexa-backend-13sp.onrender.com/api";

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token) {
    window.location.href = "login.html";
}

// ==========================
// User Info
// ==========================

if (user) {

    document.getElementById("welcome").innerHTML =
        `Welcome, ${user.name || user.fullname || "User"} 👋`;

    document.getElementById("avatar").innerText =
        (user.name || user.fullname || "U")
            .charAt(0)
            .toUpperCase();

}

// ==========================
// Load Projects
// ==========================

async function loadProjects() {

    try {

        const response = await fetch(`${API}/projects`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        const container = document.getElementById("projects");

        container.innerHTML = "";

        if (!data.success || data.projects.length === 0) {

            container.innerHTML = `
                <div class="project">
                    <h3>No Projects Found</h3>
                    <p>Create your first project.</p>
                </div>
            `;

            return;

        }

        document.getElementById("projectCount").innerText =
            data.projects.length;

        document.getElementById("activeCount").innerText =
            data.projects.length;

        data.projects.forEach(project => {

            container.innerHTML += `

            <div class="project">

                <span class="badge">
                    ${project.category || "Project"}
                </span>

                <h3>
                    ${project.title}
                </h3>

                <p>
                    ${project.description.substring(0,120)}...
                </p>

                <button
                    onclick="viewProject(${project.id})">

                    View Project

                </button>

            </div>

            `;

        });

    }

    catch (err) {

        console.error(err);

    }

}

// ==========================
// Applications
// ==========================

async function loadApplications() {

    try {

        const response = await fetch(`${API}/applications`, {

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        const data = await response.json();

        if (data.success) {

            document.getElementById("applicationCount").innerText =
                data.applications.length;

        }

    }

    catch (err) {

        console.log(err);

    }

}

// ==========================
// Logout
// ==========================

document
.getElementById("logoutBtn")
.addEventListener("click", () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "login.html";

});

// ==========================
// View Project
// ==========================

function viewProject(id){

    window.location.href =
        `project.html?id=${id}`;

}

// ==========================
// Start
// ==========================

loadProjects();

loadApplications();