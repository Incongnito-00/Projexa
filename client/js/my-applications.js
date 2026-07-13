const API="https://projexa-api-kfjs.onrender.com/api";

const user=JSON.parse(localStorage.getItem("user"));

async function loadApplications(){

const response=await fetch(`${API}/applications/user/${user.id}`);

const data=await response.json();

const container=document.getElementById("applications");

container.innerHTML="";

if(data.applications.length===0){

container.innerHTML="<h2>No Applications</h2>";

return;

}

data.applications.forEach(app=>{

container.innerHTML+=`

<div class="card">

<h2>${app.title}</h2>

<p>Category : ${app.category}</p>

<p>Budget : ₹${app.budget}</p>

<p>Status : ${app.status}</p>

</div>

`;

});

}

loadApplications();