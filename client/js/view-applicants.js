const API = "https://projexa-backend-13sp.onrender.com/api";

const params = new URLSearchParams(window.location.search);

const projectId = params.get("id");

async function loadApplicants(){

    try{

        const response = await fetch(`${API}/applications/project/${projectId}`);

        const data = await response.json();

        const container = document.getElementById("applicants");

        container.innerHTML = "";

        if(!data.success || data.applicants.length===0){

            container.innerHTML=`

            <div class="card">

            <h2>No Applicants Yet</h2>

            </div>

            `;

            return;

        }

        data.applicants.forEach(app=>{

            container.innerHTML+=`

            <div class="card">

            <h2>${app.fullname}</h2>

            <p><strong>Email:</strong> ${app.email}</p>

            <p><strong>Proposal:</strong></p>

            <p>${app.proposal}</p>

            <div class="status">

            ${app.status}

            </div>

            <div class="buttons">

            <button class="accept"

            onclick="acceptApplicant(${app.id})">

            ✅ Accept

            </button>

            <button class="reject"

            onclick="rejectApplicant(${app.id})">

            ❌ Reject

            </button>

            </div>

            </div>

            `;

        });

    }

    catch(err){

        console.error(err);

    }

}

async function acceptApplicant(id){

    await fetch(`${API}/applications/${id}/accept`,{

        method:"PUT"

    });

    loadApplicants();

}

async function rejectApplicant(id){

    await fetch(`${API}/applications/${id}/reject`,{

        method:"PUT"

    });

    loadApplicants();

}

loadApplicants();