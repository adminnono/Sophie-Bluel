// Variables Globales pour le login //
const email = document.querySelector("form #email");
const password = document.querySelector("form #password");
const form = document.querySelector("form");
const messageErreur = document.querySelector(".login p");

// Fonction qui récupère les users //
async function getUsers() {
  const response = await fetch("http://localhost:5678/api/users");
  return await response.json();
}

// Fonction de connexion //
async function login() {
  const users = await getUsers();
  console.log(users);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const userEmail = email.value;
    const userPwd = password.value;
    console.log(userEmail, userPwd);
    users.forEach((user) => {
      // Vérifications
      if (
        user.email == userEmail &&
        user.password == userPwd &&
        user.admin == true
      ) {
        // Si les conditions sont remplies, on fait ça //
        window.sessionStorage.loged = true;
        window.location.href = "../FrontEnd/index.html";
      } else {
        // Message d'erreur //
        email.classList.add("inputErrorLogin");
        password.classList.add("inputErrorLogin");
        messageErreur.textContent =
          "Votre email ou votre mot de passe est incorrect";
      }
    });
  });
}
login();
