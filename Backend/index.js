// @ts-nocheck
// Vériifier que son Json server et bien en route

// Variables
const gallery = document.querySelector("main");
const filters = document.querySelector(".filters");
// Fonction qui retourne le tableau des works
async function getWorks() {
  // Ajouter await pour attendre avant d'enregistrer dans réponse
  const response = await fetch("http://localhost:5678/api/works/");

  // Convertir la réponse au format json et ajout de await pour éviter la promesse
  // A chaque fois que je vais appeler ma fonction, ça va retourner response.json
  return await response.json();
}
getWorks();

// Afficher les Works dans le DOM //
async function affichageWorks() {
  gallery.innerHTML = "";
  const arrayWorks = await getWorks();
  arrayWorks.forEach((work) => {
    createWorks(work);
  });
}

affichageWorks();

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

// *****************Affichage des boutons par catégorie ************************ //

// Récupérer le tableau des catégories //
async function getCategorys() {
  const response = await fetch("http://localhost:5678/api/categories/");
  return await response.json();
}

async function displayCategorysButtons() {
  const categorys = await getCategorys();
  console.log(categorys);
  categorys.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.id = category.id;
    filters.appendChild(btn);
  });
}

displayCategorysButtons();

// Filtrer au click sur le bouton par catégorie //

async function filterCategory() {
  const works = await getWorks();
  console.log(works);
  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      btnId = e.target.id;
      gallery.innerHTML = "";
      if (btnId !== "0") {
        const worksTriCategory = works.filter((work) => {
          return work.categoryId == btnId;
        });
        worksTriCategory.forEach((work) => {
          createWorks(work);
        });
      } else {
        affichageWorks();
      }
      console.log(btnId);
    });
  });
}

filterCategory();

// Si l'utilisateur est connecté //

const loged = window.sessionStorage.loged;
const admin = document.querySelector(".admin");
const logout = document.querySelector("header nav .logout");
const containerModals = document.querySelector(".containerModals");
const xmark = document.querySelector(".containerModals .fa-xmark");
const workModal = document.querySelector(".workModal");

if (loged == "true") {
  admin.textContent = "modifier";
  logout.textContent = "logout";
  logout.addEventListener("click", () => {
    window.sessionStorage.loged = false;
  });
}

// Affichage de la modale au click sur admin //
admin.addEventListener("click", () => {
  console.log("admin");
  containerModals.style.display = "flex";
});

xmark.addEventListener("click", () => {
  console.log("xmark");
  containerModals.style.display = "none";
});

containerModals.addEventListener("click", (e) => {
  console.log(e.target.className);
  if (e.target.className == "containerModals") {
    containerModals.style.display = "none";
  }
});

// Affichage du des travaux dans la galerie //
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
    figure.appendChild(span);
    figure.appendChild(img);
    workModal.appendChild(figure);
  });
  deleteTravail();
}
displayWorkModal();

// Suppression d'une image dans la modale //

function deleteTravail() {
  const trashAll = document.querySelectorAll(".fa-trash-can");
  trashAll.forEach((trash) => {
    trash.addEventListener("click", (e) => {
      const id = trash.id;
      const init = {
        method: "DELETE",
        headers: { "content-Type": "application/json" },
      };
      fetch("http://localhost:5678/api/works/" + id, init)
        .then((response) => {
          if (!response.ok) {
            console.log("Le delete n'a pas marché !");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Le delete a réussi, voici la data :", data);
          displayWorkModal();
          affichageWorks();
        });
    });
  });
}

// Faire apparaitre une deuxième modale une fois le html fini //
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

// Faire la pré-visualisation de l'image //
const previewImg = document.querySelector(".containerFile img");
const inputFile = document.querySelector(".containerFile input");
const labelFile = document.querySelector(".containerFile label");
const inconFile = document.querySelector(".containerFile .fa-image");
const pFile = document.querySelector(".containerFile p");

// Ecouter les changements sur l'input file //
inputFile.addEventListener("change", () => {
  const file = inputFile.files[0];
  console.log(file);
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

// Faire un Post : Ajouter une photo
const form = document.querySelector(".modalAddTravail form");
const title = document.querySelector(".modalAddTravail #title");
const category = document.querySelector(".modalAddTravail #category");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = {
    title: title.value,
    categoryId: category.value,
    imageUrl: previewImg.src,
    category: {
      id: category.value,
      name: category.options[category.selectedIndex].textContent,
    },
  };
  fetch("http://localhost:5678/api/works/", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log("Voici le véhicule ajouté", data);
      displayWorkModal();
      affichageWorks();
    });
});

// Fonction qui vérifie si tous les input sont remplis //
function verifFormCompleted() {
  const buttonValidForm = document.querySelector(".modalAddTravail button");
  form.addEventListener("input", () => {
    if (!title.value == "" && !category.value == "" && !inputFile.value == "") {
      console.log("Tous les champs sont remplis");
      buttonValidForm.classList.add("valid");
    } else {
      buttonValidForm.classList.remove("valid");
      buttonValidForm.disabled = true;
    }
  });
}
verifFormCompleted();
