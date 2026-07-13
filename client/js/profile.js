const user = JSON.parse(localStorage.getItem("user"));

if(!user){

alert("Please login.");

window.location.href="login.html";

}

document.getElementById("name").innerText=user.fullname;

document.getElementById("email").innerText=user.email;

document.getElementById("avatar").innerText=user.fullname.charAt(0).toUpperCase();

// Load saved profile
const profile=JSON.parse(localStorage.getItem("profile_"+user.id));

if(profile){

document.getElementById("college").value=profile.college||"";

document.getElementById("department").value=profile.department||"";

document.getElementById("skills").value=profile.skills||"";

document.getElementById("github").value=profile.github||"";

document.getElementById("linkedin").value=profile.linkedin||"";

document.getElementById("about").value=profile.about||"";

}

function saveProfile(){

const profile={

college:document.getElementById("college").value,

department:document.getElementById("department").value,

skills:document.getElementById("skills").value,

github:document.getElementById("github").value,

linkedin:document.getElementById("linkedin").value,

about:document.getElementById("about").value

};

localStorage.setItem(

"profile_"+user.id,

JSON.stringify(profile)

);

alert("✅ Profile Saved Successfully");

}