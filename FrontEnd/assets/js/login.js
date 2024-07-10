// Variables Globales pour le login
const email = document.querySelector("form #email");
const password = document.querySelector("form #password");
const form = document.querySelector("form");
const messageErreur = document.querySelector(".login p");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userEmail = email.value;
  const userPwd = password.value;
  console.log(userEmail, userPwd);

  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: userEmail,
      password: userPwd,
    }),
  });

  const data = await response.json();
  console.log("Response Data:", data);

  if (response.ok && data.token) {
    // Si il y a un token, le stocker dans le localStorage
    localStorage.setItem("auth", JSON.stringify({ token: data.token }));
    localStorage.setItem("loggedIn", "true"); // Ajouter une clé loggedIn pour vérifier l'état de connexion
    alert("ok");
    // Rediriger vers la page principale
    window.location.href = "index.html";
  } else {
    alert("pas ok");
    // Afficher un message d'erreur
    messageErreur.textContent =
      "Erreur de connexion. Veuillez vérifier vos identifiants.";
  }
});
