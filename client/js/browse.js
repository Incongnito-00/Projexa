const API = "https://projexa-backend-13sp.onrender.com/api";

let allProjects = [];

async function loadProjects() {

    try {

        const response = await fetch(`${API}/projects`);

        const data = await response.json();

        allProjects = data.projects || [];

        renderProjects(allProjects);

    }

    catch (err) {

        console.error(err);

    }

}

function renderProjects(projects) {

    const container = document.getElementById("projectList");

    container.innerHTML = "";

    if (projects.length === 0) {

        container.innerHTML = `

        <div class="card">

        <h2>No Projects Found</h2>

        </div>

        `;

        return;

    }

    projects.forEach(project => {

        container.innerHTML += `

        <div class="card">

            <h2>${project.title}</h2>

            <p>${project.description}</p>

            <p><b>Category:</b> ${project.category}</p>

            <p><b>Budget:</b> ₹${project.budget}</p>

            <p><b>Deadline:</b> ${project.deadline}</p>

            <button onclick="viewProject(${project.id})">

            View Project

            </button>

        </div>

        `;

    });

}

function searchProjects() {

    const keyword = document
        .getElementById("search")
        .value
        .toLowerCase();

    const category = document
        .getElementById("filter")
        .value;

    const filtered = allProjects.filter(project => {

        const matchesSearch =

            project.title.toLowerCase().includes(keyword) ||

            project.description.toLowerCase().includes(keyword);

        const matchesCategory =

            category === "" ||

            project.category === category;

        return matchesSearch && matchesCategory;

    });

    renderProjects(filtered);

}

function viewProject(id) {

    window.location.href = `project.html?id=${id}`;

}

loadProjects();