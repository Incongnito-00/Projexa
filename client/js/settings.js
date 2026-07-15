// settings.js

const API =
    window.API_URL ||
    window.API ||
    "https://projexa-backend-13sp.onrender.com/api";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "../login.html";
}

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const collegeInput = document.getElementById("college");

const currentPassword = document.getElementById("currentPassword");
const newPassword = document.getElementById("newPassword");

const notifications = document.getElementById("notifications");
const publicProfile = document.getElementById("publicProfile");

const saveProfileBtn = document.getElementById("saveProfile");
const changePasswordBtn = document.getElementById("changePassword");
const logoutBtn = document.getElementById("logout");

const successBox = document.getElementById("success");
const errorBox = document.getElementById("error");

saveProfileBtn.addEventListener("click", updateProfile);
changePasswordBtn.addEventListener("click", updatePassword);
logoutBtn.addEventListener("click", logout);

loadProfile();

async function loadProfile() {

    try {

        const response = await fetch(`${API}/users/profile`, {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        if (!response.ok) {
            throw new Error("Unable to load profile.");
        }

        const user = await response.json();

        nameInput.value = user.name || "";
        emailInput.value = user.email || "";
        collegeInput.value = user.college || "";

        notifications.checked = user.notifications ?? true;
        publicProfile.checked = user.publicProfile ?? true;

    }

    catch (err) {

        showError(err.message);

    }

}

async function updateProfile() {

    clearMessages();

    saveProfileBtn.disabled = true;
    saveProfileBtn.innerText = "Saving...";

    try {

        const response = await fetch(`${API}/users/profile`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify({

                name: nameInput.value.trim(),

                college: collegeInput.value.trim(),

                notifications: notifications.checked,

                publicProfile: publicProfile.checked

            })

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message || "Update failed.");

        }

        showSuccess("Profile updated successfully.");

    }

    catch (err) {

        showError(err.message);

    }

    finally {

        saveProfileBtn.disabled = false;
        saveProfileBtn.innerText = "Save Changes";

    }

}

async function updatePassword() {

    clearMessages();

    if (
        currentPassword.value === "" ||
        newPassword.value === ""
    ) {

        showError("Please enter both passwords.");

        return;

    }

    changePasswordBtn.disabled = true;
    changePasswordBtn.innerText = "Updating...";

    try {

        const response = await fetch(`${API}/users/change-password`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify({

                currentPassword: currentPassword.value,

                newPassword: newPassword.value

            })

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message || "Password update failed.");

        }

        currentPassword.value = "";
        newPassword.value = "";

        showSuccess("Password changed successfully.");

    }

    catch (err) {

        showError(err.message);

    }

    finally {

        changePasswordBtn.disabled = false;
        changePasswordBtn.innerText = "Update Password";

    }

}

function logout() {

    const confirmLogout = confirm(
        "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "../login.html";

}

function showSuccess(message) {

    successBox.innerText = message;
    successBox.style.display = "block";

    errorBox.style.display = "none";

}

function showError(message) {

    errorBox.innerText = message;
    errorBox.style.display = "block";

    successBox.style.display = "none";

}

function clearMessages() {

    successBox.style.display = "none";
    errorBox.style.display = "none";

}