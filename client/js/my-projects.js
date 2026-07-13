const API = "https://projexa-api-kfjs.onrender.com/api";

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    alert("Please login first.");
    window.location.href = "login.html";
}

async function loadProjects() {

    try {

        const response = await fetch(`${API}/projects/owner/${user.id}`);
        const data = await response.json();

        const container = document.getElementById("projects");

        container.innerHTML = "";

        if (!data.success || data.projects.length === 0) {

            container.innerHTML = `
                <div class="card">
                    <h2>No Projects Created</h2>
                    <p>Create your first engineering project.</p>
                </div>
            `;

            return;
        }

        data.projects.forEach(project => {

            container.innerHTML += `

            <div class="card">

                <h2>${project.title}</h2>

                <p>${project.description}</p>

                <p><strong>Category:</strong> ${project.category}</p>

                <p><strong>Budget:</strong> ₹${project.budget || "Not Mentioned"}</p>

                <p><strong>Deadline:</strong> ${project.deadline || "Not Specified"}</p>

                <p><strong>Status:</strong> ${project.status}</p>

                <div class="project-buttons">

                    <button onclick="viewApplicants(${project.id})">
                        👥 View Applicants
                    </button>

                    <button onclick="editProject(${project.id})">
                        ✏ Edit
                    </button>

                    <button onclick="deleteProject(${project.id})">
                        🗑 Delete
                    </button>

                </div>

            </div>

            `;

        });

    }

    catch (err) {

        console.error(err);

        document.getElementById("projects").innerHTML = `
            <div class="card">
                <h2>Error Loading Projects</h2>
            </div>
        `;

    }

}

function viewApplicants(id){

    window.location.href = `view-applicants.html?id=${id}`;

}

function editProject(id){

    window.location.href = `edit-project.html?id=${id}`;

}

async function deleteProject(id){

    const confirmDelete = confirm("Are you sure you want to delete this project?");

    if(!confirmDelete) return;

    try{

        const response = await fetch(`${API}/projects/${id}`,{

            method:"DELETE"

        });

        const data = await response.json();

        alert(data.message);

        loadProjects();

    }

    catch(err){

        console.error(err);

        alert("Unable to delete project.");

    }

}

loadProjects();