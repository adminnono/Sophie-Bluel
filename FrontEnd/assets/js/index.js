// Variables
const gallery = document.querySelector("main");
const filtersContainer = document.querySelector(".filters-container");
const filters = document.querySelector(".filters");
const admin = document.querySelector(".admin");
const authLink = document.getElementById("auth-link");
const containerModals = document.querySelector(".containerModals");
const xmark = document.querySelector(".containerModals .fa-xmark");
const workModal = document.querySelector(".workModal");
const banner = document.querySelector(".edit-mode-banner");
const iconModifier = document.querySelector("#iconModifier");
const loged = localStorage.getItem("loggedIn") === "true";

// Activer le mode édition si l'utilisateur est connecté
if (loged) {
  admin.textContent = "modifier";
  authLink.textContent = "logout";
  authLink.href = "#";
  authLink.addEventListener("click", () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("loggedIn");
    window.location.reload();
  });
  banner.style.display = "flex";
  iconModifier.style.display = "flex";
  filtersContainer.style.display = "none";
} else {
  admin.style.display = "none";
  authLink.textContent = "login";
  authLink.href = "login.html";
  banner.style.display = "none";
  iconModifier.style.display = "none";
  filtersContainer.style.display = "block";
}

// Affichage de la modale au click sur admin
admin.addEventListener("click", () => {
  if (loged) {
    containerModals.style.display = "flex";
  }
});

xmark.addEventListener("click", () => {
  containerModals.style.display = "none";
});

containerModals.addEventListener("click", (e) => {
  if (e.target.className == "containerModals") {
    containerModals.style.display = "none";
  }
});

// Afficher les works dans le DOM
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works/");
  return await response.json();
}

async function affichageWorks() {
  gallery.innerHTML = "";
  const arrayWorks = await getWorks();
  arrayWorks.forEach((work) => {
    createWorks(work);
  });
}

function createWorks(work) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  img.src = work.imageUrl;
  figcaption.textContent = work.title;
  figure.classList.add("galleryStyle");
  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}

affichageWorks();

// Récupérer le tableau des catégories
async function getCategorys() {
  const response = await fetch("http://localhost:5678/api/categories/");
  return await response.json();
}

async function displayCategorysButtons() {
  const categorys = await getCategorys();
  categorys.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.id = category.id;
    filters.appendChild(btn);
  });
}

displayCategorysButtons();

// Filtrer au click sur le bouton par catégorie
async function filterCategory() {
  const works = await getWorks();
  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const btnId = e.target.id;
      gallery.innerHTML = "";
      if (btnId !== "0") {
        const worksTriCategory = works.filter(
          (work) => work.categoryId == btnId
        );
        worksTriCategory.forEach((work) => createWorks(work));
      } else {
        affichageWorks();
      }
    });
  });
}

filterCategory();

// Affichage de la modale
async function displayWorkModal() {
  workModal.innerHTML = "";
  const travaux = await getWorks();
  travaux.forEach((travail) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const span = document.createElement("span");
    const trash = document.createElement("i");

    trash.classList.add("fa-solid", "fa-trash-can");
    trash.id = travail.id;
    img.src = travail.imageUrl;

    span.appendChild(trash);
    span.classList.add("trash-container");

    figure.appendChild(span);
    figure.appendChild(img);
    workModal.appendChild(figure);
  });
  deleteTravail();
}

displayWorkModal();

// Suppression d'une image dans la modale
function deleteTravail() {
  const trashAll = document.querySelectorAll(".fa-trash-can");
  trashAll.forEach((trash) => {
    trash.addEventListener("click", (e) => {
      const id = trash.id;
      const init = {
        method: "DELETE",
        headers: {
          "content-Type": "application/json",
          Authorization: getAuthorization(),
        },
      };
      fetch("http://localhost:5678/api/works/" + id, init)
        .then((response) => {
          if (!response.ok) {
            console.log("Le delete n'a pas marché !");
          }

          return response.text();
        })
        .then((text) => {
          console.log("spp ok");
          displayWorkModal();
          affichageWorks();
        })
        .catch((error) => {
          console.error("Erreur:", error);
        });
    });
  });
}

// Affichage de la deuxième modale
const btnAddModal = document.querySelector(".modalWork button");
const modalAddTravail = document.querySelector(".modalAddTravail");
const modalWork = document.querySelector(".modalWork");
const arrowLeft = document.querySelector(".fa-arrow-left");
const markAdd = document.querySelector(".modalAddTravail .fa-xmark");

function displayAddModal() {
  btnAddModal.addEventListener("click", () => {
    modalAddTravail.style.display = "flex";
    modalWork.style.display = "none";
  });
  arrowLeft.addEventListener("click", () => {
    modalAddTravail.style.display = "none";
    modalWork.style.display = "flex";
  });
  markAdd.addEventListener("click", () => {
    containerModals.style.display = "none";
  });
}

displayAddModal();

// Pré-visualisation de l'image
const previewImg = document.querySelector(".containerFile img");
const inputFile = document.querySelector(".containerFile input");
const labelFile = document.querySelector(".containerFile label");
const inconFile = document.querySelector(".containerFile .fa-image");
const pFile = document.querySelector(".containerFile p");

inputFile.addEventListener("change", () => {
  const file = inputFile.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result;
      previewImg.style.display = "flex";
      labelFile.style.display = "none";
      inconFile.style.display = "none";
      pFile.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

// Créer une liste de catégories dans l'input select
async function dispayCategoryModal() {
  const select = document.querySelector(".modalAddTravail select");
  const categorys = await getCategorys();
  categorys.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}

dispayCategoryModal();

// Fonction pour obtenir l'autorisation
function getAuthorization() {
  const token = JSON.parse(localStorage.getItem("auth")).token;
  return "Bearer " + token;
}

// Ajouter une photo avec autorisation
const form = document.querySelector(".modalAddTravail form");
const title = document.querySelector(".modalAddTravail #title");
const category = document.querySelector(".modalAddTravail #category");
const fileInput = document.querySelector("#file");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", title.value);
  formData.append("category", category.value);
  formData.append("image", fileInput.files[0]);

  const postWorkUrl = "http://localhost:5678/api/works";

  try {
    const response = await fetch(postWorkUrl, {
      method: "POST",
      headers: {
        Authorization: getAuthorization(),
      },
      body: formData,
    });

    if (response.ok) {
      console.log("Travail ajouté avec succès");
      displayWorkModal();
      affichageWorks();
      modalAddTravail.style.display = "none";
      modalWork.style.display = "flex";
    } else {
      console.error("Erreur lors de l'ajout du travail :", response.statusText);
    }
  } catch (error) {
    console.error("Erreur :", error);
  }
});

// Vérifier si tous les inputs sont remplis
function verifFormCompleted() {
  const buttonValidForm = document.querySelector(".modalAddTravail button");
  form.addEventListener("input", () => {
    if (title.value !== "" && category.value !== "" && inputFile.value !== "") {
      buttonValidForm.classList.add("valid");
      buttonValidForm.disabled = false;
    } else {
      buttonValidForm.classList.remove("valid");
      buttonValidForm.disabled = true;
    }
  });
}

verifFormCompleted();
