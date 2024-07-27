// ************************************************Variables Globales pour le login*************************************************************
const email = document.querySelector("form #email"); // Sélectionne l'élément du formulaire avec l'ID "email" et le stocke dans la variable email
const password = document.querySelector("form #password"); // Sélectionne l'élément du formulaire avec l'ID "password" et le stocke dans la variable password
const form = document.querySelector("form"); // Sélectionne le formulaire HTML et le stocke dans la variable form
const messageErreur = document.querySelector(".login p"); // Sélectionne l'élément paragraphe avec la classe "login" et le stocke dans la variable messageErreur

form.addEventListener("submit", async (e) => {
  // Ajoute un écouteur d'événement au formulaire qui déclenche une fonction asynchrone lors de la soumission du formulaire
  e.preventDefault(); // Empêche le comportement par défaut de soumission du formulaire pour éviter le rechargement de la page
  const userEmail = email.value; // Récupère la valeur de l'input "email" et la stocke dans la variable userEmail
  const userPwd = password.value; // Récupère la valeur de l'input "password" et la stocke dans la variable userPwd

  const response = await fetch("http://localhost:5678/api/users/login", {
    // Envoie une requête HTTP asynchrone à l'API pour effectuer une tentative de connexion
    method: "POST", // Spécifie que la méthode HTTP utilisée est POST
    headers: {
      //
      "Content-Type": "application/json", // Indique que le corps de la requête est au format JSON
    },
    body: JSON.stringify({
      // Convertit les données de l'email et du mot de passe en une chaîne JSON et l'inclut dans le corps de la requête
      email: userEmail,
      password: userPwd,
    }),
  });

  const data = await response.json(); // Attend la réponse de la requête, puis la convertit en objet JSON et le stocke dans la variable data

  if (response.ok && data.token) {
    // Si il y a un token, le stocker dans le localStorage
    localStorage.setItem("auth", JSON.stringify({ token: data.token })); // Stocke le jeton d'authentification dans le localStorage sous forme de chaîne JSON avec la clé "auth"
    localStorage.setItem("loggedIn", "true"); // Ajoute une clé "loggedIn" avec la valeur "true" dans le localStorage pour indiquer que l'utilisateur est connecté

    // Rediriger vers la page principale
    window.location.href = "index.html";
  } else {
    // Afficher un message d'erreur
    messageErreur.textContent =
      "Erreur de connexion. Veuillez vérifier vos identifiants.";
  }
});
