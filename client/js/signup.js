const API = "https://projexa-backend-3ejy.onrender.com/api";

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const full_name = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (!full_name || !email || !password || !confirmPassword) {
        alert("Please fill all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {

        const response = await fetch(`${API}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                full_name,
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {

            alert("Registration Successful!");

            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            }

            window.location.href = "login.html";

        } else {

            alert(data.message || "Registration Failed");

        }

    } catch (error) {

        console.error("Signup Error:", error);
        alert("Unable to connect to server.");

    }
});