const API = "https://projexa-api-kfjs.onrender.com/api";

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    alert("Please login first.");
    window.location.href = "login.html";
}

document.getElementById("projectForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const category = document.getElementById("category").value;
    const budget = document.getElementById("budget").value;
    const deadline = document.getElementById("deadline").value;

    try {

        const response = await fetch(`${API}/projects`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                title,
                description,
                category,
                budget,
                deadline,
                owner: user.id

            })

        });

        const data = await response.json();

        if (data.success) {

            alert("✅ Project Created Successfully");

            // Redirect to My Projects
            window.location.href = "my-projects.html";

        } else {

            alert(data.message);

        }

    }

    catch (err) {

        console.error(err);

        alert("Unable to connect to server.");

    }

});