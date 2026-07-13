const API = "http://localhost:3000/api";

const user = JSON.parse(localStorage.getItem("user"));

const params = new URLSearchParams(window.location.search);
const projectId = params.get("id");

let project = null;

// =============================
// Load Project
// =============================

async function loadProject() {

    try {

        const response = await fetch(`${API}/projects/${projectId}`);
        const data = await response.json();

        if (!data.success) {

            alert("Project not found.");
            return;

        }

        project = data.project;

        document.getElementById("title").innerText = project.title;
        document.getElementById("description").innerText = project.description;
        document.getElementById("category").innerText = project.category;
        document.getElementById("budget").innerText = project.budget;
        document.getElementById("deadline").innerText = project.deadline;

        // Hide Apply button if owner
        if (user && user.id == project.owner) {

            document.getElementById("applyBtn").style.display = "none";

        }

    }

    catch (err) {

        console.error(err);
        alert("Unable to load project.");

    }

}

// =============================
// Apply
// =============================

async function applyProject() {

    if (!user) {

        alert("Please login first.");
        return;

    }

    // Prevent owner from applying
    if (user.id == project.owner) {

        alert("You cannot apply to your own project.");
        return;

    }

    const proposal = prompt("Enter your proposal");

    if (!proposal || proposal.trim() === "") {

        alert("Proposal is required.");
        return;

    }

    try {

        const response = await fetch(`${API}/applications`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                project_id: project.id,
                applicant_id: user.id,
                proposal: proposal

            })

        });

        const data = await response.json();

        alert(data.message);

    }

    catch (err) {

        console.error(err);
        alert("Unable to submit application.");

    }

}

loadProject();