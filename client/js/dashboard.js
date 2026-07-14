const API = "https://projexa-backend-13sp.onrender.com/api";

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {

    window.location.href = "login.html";

}

document.getElementById("welcome").textContent =
`Welcome, ${user.fullname} 👋`;

document.getElementById("logoutBtn").onclick = () => {

    localStorage.clear();

    window.location.href = "login.html";

};

async function loadProjects() {

    try {

        const response = await fetch(`${API}/projects`);

        const data = await response.json();

        const container = document.getElementById("projects");

        container.innerHTML = "";

        if (!data.success || data.projects.length === 0) {

            container.innerHTML = "<h3>No Projects Yet</h3>";

            return;

        }

        data.projects.forEach(project => {

            container.innerHTML += `

            <div class="card">

                <h2>${project.title}</h2>

                <p>${project.description}</p>

                <p><strong>Category:</strong> ${project.category}</p>

                <p><strong>Budget:</strong> ₹${project.budget || "Not specified"}</p>

                <p><strong>Deadline:</strong> ${project.deadline || "Not specified"}</p>

                <button onclick="window.location.href='project.html?id=${project.id}'">

                    View Project

                </button>

            </div>

            <br>

            `;

        });

    } catch (err) {

        console.error(err);

        document.getElementById("projects").innerHTML =
        "<h3>Cannot connect to server.</h3>";

    }

}

loadProjects();