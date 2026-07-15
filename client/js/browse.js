// browse.js

const API =
  window.API_URL ||
  window.API ||
  "https://projexa-backend-13sp.onrender.com/api";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "../login.html";
}

const container = document.getElementById("projectsContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const loadMoreBtn = document.getElementById("loadMore");

const totalProjects = document.getElementById("totalProjects");
const openProjects = document.getElementById("openProjects");
const categories = document.getElementById("categories");
const developers = document.getElementById("developers");

let allProjects = [];
let visibleProjects = 9;

async function loadProjects() {

    try {

        const response = await fetch(`${API}/projects`, {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        if (!response.ok) {
            throw new Error("Unable to fetch projects");
        }

        const data = await response.json();

        allProjects = Array.isArray(data)
            ? data
            : data.projects || [];

        updateStats();

        renderProjects();

    } catch (err) {

        console.error(err);

        container.innerHTML = `
        <div style="
        grid-column:1/-1;
        text-align:center;
        padding:60px;
        color:#999;
        ">
        Failed to load projects.
        </div>
        `;

    }

}

function updateStats() {

    totalProjects.textContent = allProjects.length;

    const open = allProjects.filter(project => {

        return project.status !== "Closed";

    });

    openProjects.textContent = open.length;

    const uniqueCategories = new Set();

    const uniqueUsers = new Set();

    allProjects.forEach(project => {

        if (project.category)
            uniqueCategories.add(project.category);

        if (project.user_id)
            uniqueUsers.add(project.user_id);

    });

    categories.textContent = uniqueCategories.size;

    developers.textContent = uniqueUsers.size;

}

function renderProjects() {

    container.innerHTML = "";

    let filtered = allProjects.filter(project => {

        const keyword = searchInput.value.toLowerCase();

        const searchMatch =

            (project.title || "").toLowerCase().includes(keyword) ||

            (project.description || "").toLowerCase().includes(keyword);

        const categoryMatch =

            categoryFilter.value === "" ||

            project.category === categoryFilter.value;

        return searchMatch && categoryMatch;

    });

    filtered.slice(0, visibleProjects).forEach(project => {

        const card = document.createElement("div");

        card.className = "project";

        card.innerHTML = `

        <div class="banner"></div>

        <div class="content">

            <h3>${project.title}</h3>

            <p>${truncate(project.description || "",160)}</p>

            <div class="tags">

                <span class="tag">${project.category || "General"}</span>

                <span class="tag">${project.level || "Open"}</span>

            </div>

            <div class="meta">

                <span>

                    👤 ${project.owner_name || "Anonymous"}

                </span>

                <span>

                    📅 ${formatDate(project.created_at)}

                </span>

            </div>

            <a
                href="project.html?id=${project.id}"
                class="btn"
            >
                View Project
            </a>

        </div>

        `;

        container.appendChild(card);

    });

    if (filtered.length <= visibleProjects) {

        loadMoreBtn.style.display = "none";

    } else {

        loadMoreBtn.style.display = "block";

    }

}

loadMoreBtn.addEventListener("click", () => {

    visibleProjects += 9;

    renderProjects();

});

searchInput.addEventListener("input", () => {

    visibleProjects = 9;

    renderProjects();

});

categoryFilter.addEventListener("change", () => {

    visibleProjects = 9;

    renderProjects();

});

function truncate(text, max) {

    if (text.length <= max)
        return text;

    return text.substring(0, max) + "...";

}

function formatDate(date) {

    if (!date)
        return "";

    return new Date(date).toLocaleDateString();

}

loadProjects();