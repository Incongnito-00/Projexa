const API = "http://localhost:3000/api";

// Logged in user
const user = JSON.parse(localStorage.getItem("user"));

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadProject() {

    try {

        const response = await fetch(`${API}/projects/${id}`);
        const data = await response.json();

        if (!data.success) {

            document.getElementById("project").innerHTML = `
                <h2>Project not found.</h2>
            `;

            return;

        }

        const p = data.project;

        // Show Apply button only if logged-in user is NOT the owner
        let applyButton = "";

        if (user && user.id != p.owner) {

            applyButton = `
                <button
                    onclick="window.location.href='apply.html?id=${p.id}'">
                    🚀 Apply for this Project
                </button>
            `;

        } else {

            applyButton = `
                <button disabled
                    style="
                    background:#999;
                    cursor:not-allowed;
                    color:white;
                    padding:12px 20px;
                    border:none;
                    border-radius:8px;">
                    You are the Project Owner
                </button>
            `;

        }

        document.getElementById("project").innerHTML = `

        <div class="card">

            <h1>${p.title}</h1>

            <hr>

            <p><strong>Description</strong></p>

            <p>${p.description}</p>

            <p><strong>Category:</strong> ${p.category}</p>

            <p><strong>Budget:</strong> ₹${p.budget}</p>

            <p><strong>Deadline:</strong> ${p.deadline}</p>

            <p><strong>Status:</strong> ${p.status}</p>

            <br>

            ${applyButton}

        </div>

        `;

    }

    catch(err){

        console.error(err);

        document.getElementById("project").innerHTML = `
            <h2>Unable to load project.</h2>
        `;

    }

}

loadProject();