// post-project.js

const API =
    window.API_URL ||
    window.API ||
    "https://projexa-backend-3ejy.onrender.com/api";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "../login.html";
}

const form = document.getElementById("projectForm");

const title = document.getElementById("title");
const category = document.getElementById("category");
const level = document.getElementById("level");
const status = document.getElementById("status");
const skills = document.getElementById("skills");
const description = document.getElementById("description");

const submitBtn = document.getElementById("submitBtn");

const successBox = document.getElementById("successBox");
const errorBox = document.getElementById("errorBox");

form.addEventListener("submit", publishProject);

async function publishProject(e) {

    e.preventDefault();

    successBox.style.display = "none";
    errorBox.style.display = "none";

    submitBtn.disabled = true;
    submitBtn.innerText = "Publishing...";

    try {

        const body = {

            title: title.value.trim(),

            category: category.value,

            level: level.value,

            status: status.value,

            skills: skills.value
                .split(",")
                .map(skill => skill.trim())
                .filter(skill => skill !== ""),

            description: description.value.trim()

        };

        const response = await fetch(`${API}/projects`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify(body)

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message || "Unable to publish project.");

        }

        successBox.style.display = "block";

        form.reset();

        setTimeout(() => {

            window.location.href = "browse.html";

        }, 1500);

    }

    catch (err) {

        console.error(err);

        errorBox.innerText = err.message;

        errorBox.style.display = "block";

    }

    finally {

        submitBtn.disabled = false;

        submitBtn.innerText = "Publish Project";

    }

}