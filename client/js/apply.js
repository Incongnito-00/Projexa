const API = "https://projexa-backend-13sp.onrender.com/api";

const user = JSON.parse(localStorage.getItem("user"));

const params = new URLSearchParams(window.location.search);

const project_id = params.get("id");

document.getElementById("applyForm").addEventListener("submit", async (e)=>{

    e.preventDefault();

    const proposal = document.getElementById("proposal").value;

    const response = await fetch(`${API}/applications`,{

        method:"POST",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify({

            project_id,

            applicant_id:user.id,

            proposal

        })

    });

    const data = await response.json();

    if(data.success){

        alert("Application Submitted Successfully");

        window.location.href="dashboard.html";

    }

    else{

        alert(data.message);

    }

});