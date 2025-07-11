import { createModal, displayModalGallery } from './modal.js'

export function enableAdminMode(allWorks) {
  const editionBanner = document.createElement("div");
  editionBanner.classList.add("edition-banner");
  editionBanner.innerHTML = `
    <div class="edition-wrapper">
        <i class="fa-regular fa-pen-to-square"></i> Mode édition
    </div>`;
  
  // Rendre la bannière cliquable
  editionBanner.style.cursor = "pointer";
  editionBanner.addEventListener("click", openModal);
  
  document.body.insertBefore(editionBanner, document.body.firstChild);

  document.querySelectorAll("nav ul li").forEach((li) => {
    if (li.textContent.toLowerCase() === "login") {
      li.innerHTML = `<a href="#" id="logout">logout</a>`;
    }
  });

  const portfolioTitle = document.querySelector("#portfolio h2");
  const editBtn = document.createElement("span");
  editBtn.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> modifier`;
  editBtn.classList.add("edit-button");
  portfolioTitle.appendChild(editBtn);

  const filters = document.querySelector(".filters");
  if (filters) filters.remove();

  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.reload();
    });
  }

  // Crée la modale une fois
  createModal(allWorks);

  // Fonction pour ouvrir la modale
  function openModal() {
    const modal = document.querySelector(".modal");
    if (modal) modal.style.display = "flex";
  }

  // Ouvre la modale au clic sur le bouton modifier
  editBtn.addEventListener("click", openModal);
}