// project.js

const API =
    window.API_URL ||
    window.API ||
    "https://YOUR-RENDER-BACKEND.onrender.com/api";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "../login.html";
}

const params = new URLSearchParams(window.location.search);
const projectId = params.get("id");

const loading = document.getElementById("loading");
const container = document.getElementById("projectContainer");

const title = document.getElementById("title");
const creator = document.getElementById("creator");
const category = document.getElementById("category");
const level = document.getElementById("level");
const status = document.getElementById("status");
const created = document.getElementById("created");
const description = document.getElementById("description");
const ownerName = document.getElementById("ownerName");
const tags = document.getElementById("tags");
const skills = document.getElementById("skills");
const applyBtn = document.getElementById("applyBtn");

let project = null;

async function loadProject() {

    try {

        const response = await fetch(`${API}/projects/${projectId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Unable to load project");
        }

        project = await response.json();

        renderProject();

    } catch (err) {

        console.error(err);

        loading.innerHTML = `
            <h2>Unable to load project.</h2>
        `;

    }

}

function renderProject() {

    loading.style.display = "none";
    container.style.display = "block";

    title.textContent = project.title || "";

    creator.textContent =
        "Created by " + (project.owner_name || "Anonymous");

    category.textContent =
        project.category || "General";

    level.textContent =
        project.level || "Open";

    status.textContent =
        project.status || "Open";

    created.textContent =
        formatDate(project.created_at);

    description.textContent =
        project.description || "";

    ownerName.textContent =
        project.owner_name || "Anonymous";

    tags.innerHTML = "";

    createTag(project.category);

    createTag(project.level);

    createTag(project.status);

    skills.innerHTML = "";

    let skillArray = [];

    if (Array.isArray(project.skills)) {

        skillArray = project.skills;

    } else if (typeof project.skills === "string") {

        skillArray = project.skills
            .split(",")
            .map(item => item.trim())
            .filter(item => item.length > 0);

    }

    if (skillArray.length === 0) {

        skillArray.push("No Skills Specified");

    }

    skillArray.forEach(skill => {

        const div = document.createElement("div");

        div.className = "skill";

        div.textContent = skill;

        skills.appendChild(div);

    });

}

function createTag(text) {

    if (!text) return;

    const tag = document.createElement("div");

    tag.className = "tag";

    tag.textContent = text;

    tags.appendChild(tag);

}

function formatDate(date) {

    if (!date) return "";

    return new Date(date).toLocaleDateString();

}

applyBtn.addEventListener("click", applyProject);

async function applyProject() {

    if (!confirm("Apply for this project?")) return;

    applyBtn.disabled = true;
    applyBtn.textContent = "Applying...";

    try {

        const response = await fetch(`${API}/applications`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify({

                projectId: project.id

            })

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message || "Application failed");

        }

        applyBtn.textContent = "Applied ✓";

        applyBtn.style.background = "#37d65d";

        alert("Application submitted successfully.");

    } catch (err) {

        console.error(err);

        applyBtn.disabled = false;

        applyBtn.textContent = "Apply Now";

        alert(err.message);

    }

}

loadProject();