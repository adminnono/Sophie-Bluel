// ***********************************************************Variables*************************************************************************
const gallery = document.querySelector("main"); // Sélectionne l'élément <main> qui contient la galerie des travaux

const filtersContainer = document.querySelector(".filters-container"); // Sélectionne le conteneur des filtres

const filters = document.querySelector(".filters"); // Sélectionne les éléments de filtre spécifiques

const admin = document.querySelector(".admin"); // Sélectionne l'élément représentant la section admin pour la modification

const authLink = document.getElementById("auth-link"); // Sélectionne le lien d'authentification (login/logout)

const containerModals = document.querySelector(".containerModals"); // Sélectionne le conteneur des modales

const xmark = document.querySelector(".containerModals .fa-xmark"); // Sélectionne l'icône de fermeture des modales

const workModal = document.querySelector(".workModal"); // Sélectionne la modale des travaux

const banner = document.querySelector(".edit-mode-banner"); // Sélectionne la bannière indiquant le mode édition

const iconModifier = document.querySelector("#iconModifier"); // Sélectionne l'icône de modification

const loged = localStorage.getItem("loggedIn") === "true"; // Vérifie si l'utilisateur est connecté en vérifiant la valeur dans le localStorage

// Activer le mode édition si l'utilisateur est connecté
if (loged) {
  admin.textContent = "modifier";

  // Changer le lien d'authentification pour indiquer "logout"
  authLink.textContent = "logout";
  authLink.href = "#";

  // Ajouter un événement au lien logout pour déconnecter l'utilisateur
  authLink.addEventListener("click", () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("loggedIn");
    window.location.reload();
  });

  // Afficher la bannière du mode édition et l'icône de modification
  banner.style.display = "flex";
  iconModifier.style.display = "flex";

  // Masquer le conteneur des filtres
  filtersContainer.style.display = "none";
} else {
  // Masquer l'élément admin si l'utilisateur n'est pas connecté
  admin.style.display = "none";

  // Changer le lien d'authentification pour indiquer "login"
  authLink.textContent = "login";
  authLink.href = "login.html";

  // Masquer la bannière du mode édition et l'icône de modification
  banner.style.display = "none";
  iconModifier.style.display = "none";

  // Afficher le conteneur des filtres
  filtersContainer.style.display = "block";
}

// Affichage de la modale au click sur admin
admin.addEventListener("click", () => {
  if (loged) {
    containerModals.style.display = "flex"; // Affiche le conteneur des modales si l'utilisateur est connecté
  }
});

xmark.addEventListener("click", () => {
  containerModals.style.display = "none"; // Cache le conteneur des modales lors du clic sur l'icône de fermeture
});

containerModals.addEventListener("click", (e) => {
  if (e.target.className == "containerModals") {
    containerModals.style.display = "none"; // Cache le conteneur des modales si un clic est détecté en dehors de la modale
  }
});

// ***************************************************Afficher les travaux sur la page index.html***********************************************
async function getWorks() {
  // Déclare une fonction asynchrone appelée getWorks qui récupère les travaux depuis l'API
  const response = await fetch("http://localhost:5678/api/works/"); // Envoie une requête HTTP GET à l'API pour obtenir la liste des travaux et stocke la réponse dans la variable response
  return await response.json(); // Attend que la réponse soit convertie en JSON et renvoie le résultat
}

async function affichageWorks() {
  // Déclare une fonction asynchrone appelée affichageWorks pour afficher les travaux sur la page
  gallery.innerHTML = ""; // Vide le contenu de l'élément gallery pour s'assurer qu'il est prêt à afficher de nouveaux travaux
  const arrayWorks = await getWorks(); // Appelle la fonction getWorks pour obtenir la liste des travaux et stocke le résultat dans la variable arrayWorks
  arrayWorks.forEach((work) => {
    //Parcourt chaque élément de arrayWorks et appelle la fonction createWorks pour créer et afficher chaque travail
    createWorks(work);
  });
}

function createWorks(work) {
  // Déclare une fonction appelée createWorks qui crée et configure les éléments HTML nécessaires pour afficher un travail
  const figure = document.createElement("figure"); // Crée un élément <figure> pour contenir l'image et la légende du travail
  const img = document.createElement("img"); // Crée un élément <img> pour afficher l'image du travail
  const figcaption = document.createElement("figcaption"); // Crée un élément <figcaption> pour afficher le titre du travail
  img.src = work.imageUrl; // Définit l'attribut src de l'image avec l'URL de l'image du travail
  figcaption.textContent = work.title; //Définit le texte de la légende avec le titre du travail
  figure.classList.add("galleryStyle"); // Ajoute la classe CSS "galleryStyle" à l'élément <figure> pour appliquer des styles spécifiques
  figure.appendChild(img); // Ajoute l'image à l'élément <figure>
  figure.appendChild(figcaption); // Ajoute la légende à l'élément <figure>
  gallery.appendChild(figure); // Ajoute l'élément <figure> (contenant l'image et la légende) à l'élément gallery
}

affichageWorks(); // Appelle la fonction affichageWorks pour démarrer le processus de récupération et d'affichage des travaux sur la page

// **********************************************Récupérer le tableau des catégories************************************************************
async function getCategorys() {
  // Déclare une fonction asynchrone appelée getCategorys qui récupère les catégories depuis l'API
  const response = await fetch("http://localhost:5678/api/categories/"); // Envoie une requête HTTP GET à l'API pour obtenir la liste des catégories et stocke la réponse dans la variable response
  return await response.json(); // Attend que la réponse soit convertie en JSON et renvoie le résultat
}

async function displayCategorysButtons() {
  // Déclare une fonction asynchrone appelée displayCategorysButtons pour afficher les boutons de catégories.
  const categorys = await getCategorys(); // Appelle la fonction getCategorys pour obtenir la liste des catégories et stocke le résultat dans la variable categorys
  categorys.forEach((category) => {
    // Parcourt chaque élément de categorys et exécute la fonction pour chaque catégorie
    const btn = document.createElement("button"); // Crée un élément <button> pour chaque catégorie
    btn.textContent = category.name; // Définit le texte du bouton avec le nom de la catégorie
    btn.id = category.id; // Définit l'attribut id du bouton avec l'ID de la catégorie
    filters.appendChild(btn); // Ajoute le bouton à l'élément filters (conteneur pour les boutons de filtres)
  });
}

displayCategorysButtons(); // Appelle la fonction displayCategorysButtons pour démarrer le processus de récupération et d'affichage des boutons de catégories sur la page

// *********************************************Filtrer au click sur le bouton par catégorie****************************************************
async function filterCategory() {
  // Déclare une fonction asynchrone appelée filterCategory qui filtre les travaux en fonction de la catégorie sélectionnée
  const works = await getWorks(); // Appelle la fonction getWorks pour obtenir la liste des travaux et stocke le résultat dans la variable works
  const buttons = document.querySelectorAll(".filters button"); // Sélectionne tous les boutons situés dans l'élément avec la classe "filters" et les stocke dans la variable buttons
  buttons.forEach((button) => {
    // Parcourt chaque bouton et attache un gestionnaire d'événement click
    button.addEventListener("click", (e) => {
      // Ajoute un écouteur d'événement click à chaque bouton, qui déclenche une fonction lorsqu'un bouton est cliqué
      const btnId = e.target.id; // Récupère l'ID du bouton cliqué et le stocke dans la variable btnId
      gallery.innerHTML = ""; // Vide le contenu de l'élément gallery pour s'assurer qu'il est prêt à afficher les travaux filtrés
      if (btnId !== "0") {
        // Vérifie si l'ID du bouton cliqué n'est pas égal à "0"
        const worksTriCategory = works.filter(
          (work) => work.categoryId == btnId
        ); // Filtre les travaux pour ne conserver que ceux dont categoryId correspond à btnId, et stocke le résultat dans la variable worksTriCategory
        worksTriCategory.forEach((work) => createWorks(work)); // Parcourt chaque travail filtré et appelle la fonction createWorks pour créer et afficher chaque travail.
      } else {
        affichageWorks(); // Si l'ID du bouton cliqué est "0", appelle la fonction affichageWorks pour afficher tous les travaux sans filtrage
      }
    });
  });
}

filterCategory(); // Appelle la fonction filterCategory pour démarrer le processus de filtrage des travaux en fonction des catégories sélectionnées

// ********************************************************Affichage de la modale***************************************************************
async function displayWorkModal() {
  workModal.innerHTML = ""; // Vider le contenu existant de la modale
  const travaux = await getWorks(); // Récupérer les travaux depuis l'API
  travaux.forEach((travail) => {
    // Créer les éléments HTML pour chaque travail
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const span = document.createElement("span");
    const trash = document.createElement("i");

    trash.classList.add("fa-solid", "fa-trash-can"); // Ajouter les classes à l'icône de poubelle
    trash.id = travail.id; // Assigner l'id du travail à l'icône
    img.src = travail.imageUrl; // Assigner l'URL de l'image

    span.appendChild(trash); // Ajouter l'icône de poubelle au span
    span.classList.add("trash-container"); // Ajouter une classe au span

    figure.appendChild(span); // Ajouter le span à la figure
    figure.appendChild(img); // Ajouter l'image à la figure
    workModal.appendChild(figure); // Ajouter la figure à la modale
  });
  deleteTravail(); // Appeler la fonction pour gérer la suppression des travaux
}

displayWorkModal(); // Appeler la fonction pour afficher la modale

// *************************************Suppression d'une image dans la modale****************************************************************
function deleteTravail() {
  const trashAll = document.querySelectorAll(".fa-trash-can"); // Sélectionner toutes les icônes de poubelle
  trashAll.forEach((trash) => {
    trash.addEventListener("click", (e) => {
      // Ajouter un écouteur d'événement de clic à chaque icône
      const id = trash.id; // Récupérer l'id du travail
      const init = {
        method: "DELETE",
        headers: {
          "content-Type": "application/json",
          Authorization: getAuthorization(), // Ajouter l'autorisation
        },
      };
      fetch("http://localhost:5678/api/works/" + id, init) // Envoyer la requête DELETE
        .then((response) => {
          if (!response.ok) {
          }

          return response.text();
        })
        .then((text) => {
          displayWorkModal(); // Réafficher la modale
          affichageWorks(); // Réafficher les travaux
        })
        .catch((error) => {
          console.error("Erreur:", error); // Afficher les erreurs dans la console
        });
    });
  });
}

// **************************************************Affichage de la deuxième modale************************************************************
const btnAddModal = document.querySelector(".modalWork button"); // bouton est utilisé pour ouvrir la modale d'ajout de travail
const modalAddTravail = document.querySelector(".modalAddTravail"); //modale où l'utilisateur peut ajouter un nouveau travail
const modalWork = document.querySelector(".modalWork"); // modale initiale qui affiche les travaux existants
const arrowLeft = document.querySelector(".fa-arrow-left"); // icône de flèche qui permet de revenir à la modale précédente
const markAdd = document.querySelector(".modalAddTravail .fa-xmark"); // icône de croix utilisée pour fermer la modale d'ajout de travail

function displayAddModal() {
  btnAddModal.addEventListener("click", () => {
    modalAddTravail.style.display = "flex"; // Afficher la modale d'ajout
    modalWork.style.display = "none"; // Masquer la modale de travail
  });
  arrowLeft.addEventListener("click", () => {
    modalAddTravail.style.display = "none"; // Masquer la modale d'ajout
    modalWork.style.display = "flex"; // Afficher la modale de travail
  });
  markAdd.addEventListener("click", () => {
    containerModals.style.display = "none"; // Masquer toutes les modales
  });
}

displayAddModal();

// *************************************************Pré-visualisation de l'image****************************************************************
const previewImg = document.querySelector(".containerFile img"); // afficher la pré-visualisation de l'image sélectionnée.
const inputFile = document.querySelector(".containerFile input"); // permet à l'utilisateur de choisir un fichier image à uploader
const labelFile = document.querySelector(".containerFile label"); // utilisé pour styliser le bouton de sélection de fichier
const inconFile = document.querySelector(".containerFile .fa-image"); // icône utilisée pour représenter visuellement le choix d'une image
const pFile = document.querySelector(".containerFile p"); // utilisé pour afficher une description

inputFile.addEventListener("change", () => {
  const file = inputFile.files[0]; // Récupérer le fichier sélectionné
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result; // Afficher l'image sélectionnée
      previewImg.style.display = "flex";
      labelFile.style.display = "none";
      inconFile.style.display = "none";
      pFile.style.display = "none";
    };
    reader.readAsDataURL(file); // Lire le fichier comme une URL de données
  }
});

// ******************************************Créer une liste de catégories dans l'input select**************************************************
async function dispayCategoryModal() {
  const select = document.querySelector(".modalAddTravail select");
  const categorys = await getCategorys(); // Récupérer les catégories depuis l'API
  categorys.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id; // Assigner l'id de la catégorie à l'option
    option.textContent = category.name; // Assigner le nom de la catégorie à l'option
    select.appendChild(option); // Ajouter l'option au select
  });
}

dispayCategoryModal(); // Appeler la fonction pour afficher les catégories dans la modale

// ********************************************Fonction pour obtenir l'autorisation*************************************************************
function getAuthorization() {
  const token = JSON.parse(localStorage.getItem("auth")).token; // Récupérer le token depuis le localStorage
  return "Bearer " + token; // Retourner le token avec le préfixe "Bearer"
}

// *****************************************************Ajouter une photo avec autorisation*****************************************************
const form = document.querySelector(".modalAddTravail form");
const title = document.querySelector(".modalAddTravail #title");
const category = document.querySelector(".modalAddTravail #category");
const fileInput = document.querySelector("#file");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", title.value); // Ajouter le titre au FormData
  formData.append("category", category.value); // Ajouter la catégorie au FormData
  formData.append("image", fileInput.files[0]); // Ajouter l'image au FormData

  const postWorkUrl = "http://localhost:5678/api/works";

  try {
    const response = await fetch(postWorkUrl, {
      method: "POST",
      headers: {
        Authorization: getAuthorization(), // Ajouter l'autorisation
      },
      body: formData, // Ajouter le FormData à la requête
    });

    if (response.ok) {
      form.reset(); // Réinitialiser le formulaire
      previewImg.style.display = "none"; // Masquer l'image pré-visualisée
      previewImg.src = ""; // Réinitialiser l'URL de l'image pré-visualisée
      labelFile.style.display = "flex"; // Afficher le label du fichier
      inconFile.style.display = "flex"; // Afficher l'icône du fichier
      pFile.style.display = "flex"; // Afficher le paragraphe du fichier
      displayWorkModal(); // Réafficher la modale
      affichageWorks(); // Réafficher les travaux
      modalAddTravail.style.display = "none"; // Masquer la modale d'ajout
      modalWork.style.display = "flex"; // Afficher la modale de travail
    } else {
      console.error("Erreur lors de l'ajout du travail :", response.statusText); // Afficher les erreurs dans la console
    }
  } catch (error) {
    console.error("Erreur :", error);
  }
});

// Vérifier si tous les inputs sont remplis

function verifFormCompleted() {
  const buttonValidForm = document.querySelector(".modalAddTravail button"); // Sélectionner le bouton de validation du formulaire dans la modale d'ajout de travail

  // Ajouter un écouteur d'événement "input" au formulaire pour détecter les changements dans les champs
  form.addEventListener("input", () => {
    // Vérifier si les champs "title", "category" et "inputFile" ne sont pas vides
    if (title.value !== "" && category.value !== "" && inputFile.value !== "") {
      buttonValidForm.classList.add("valid"); // Ajouter la classe "valid" au bouton de validation si tous les champs sont remplis

      buttonValidForm.disabled = false; // Activer le bouton de validation en supprimant l'attribut "disabled"
    } else {
      buttonValidForm.classList.remove("valid"); // Retirer la classe "valid" du bouton de validation si un des champs est vide

      buttonValidForm.disabled = true; // Désactiver le bouton de validation en ajoutant l'attribut "disabled"
    }
  });
}

verifFormCompleted(); // Appeler la fonction pour vérifier si tous les inputs sont remplis
