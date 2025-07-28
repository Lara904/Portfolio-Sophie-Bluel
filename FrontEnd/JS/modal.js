import { fetchCategories } from './api.js';

export function createModal(allWorks) {
  if (document.querySelector(".modal")) return;

  const modal = document.createElement("div");
  modal.classList.add("modal");

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-button">&times;</span>

      <!-- Vue 1 : Galerie -->
      <div class="modal-view modal-gallery-view">
        <h3 class="modal-title">Galerie photo</h3>
        <div class="modal-gallery"></div>
        <hr class="modal-divider">
        <div class="modal-footer">
          <button class="add-photo-btn">Ajouter une photo</button>
        </div>
      </div>

      <!-- Vue 2 : Ajout -->
      <div class="modal-view modal-add-view" style="display: none;">
        <span class="back-button"><i class="fa-solid fa-arrow-left"></i></span>
        <h3 class="modal-title">Ajout photo</h3>
        <form class="add-photo-form">
          <div class="upload-area">
            <label for="image-upload" class="upload-label">
              <i class="fa-regular fa-image"></i>
              <span>+ Ajouter photo</span>
              <p>jpg, png : 4mo max</p>
            </label>
            <input type="file" id="image-upload" name="image" accept="image/*" required hidden />
            <div class="image-preview"></div>
          </div>

          <label for="title">Titre</label>
          <input type="text" id="title" name="title" placeholder="Ex : Appartement Paris" required />

          <label for="category">Catégorie</label>
          <select id="category" name="category" required>
            <option value="">-- Sélectionner --</option>
          </select>

          <hr class="modal-divider">

          <button type="submit" class="submit-button" disabled>Valider</button>
        </form>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  fetchCategories().then(populateCategorySelect).catch(console.error);

  modal.querySelector(".close-button").addEventListener("click", () => modal.style.display = "none");
  modal.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });

  modal.querySelector(".add-photo-btn").addEventListener("click", () => {
    modal.querySelector(".modal-gallery-view").style.display = "none";
    modal.querySelector(".modal-add-view").style.display = "flex";
  });

  modal.querySelector(".back-button").addEventListener("click", () => {
    modal.querySelector(".modal-add-view").style.display = "none";
    modal.querySelector(".modal-gallery-view").style.display = "block";
  });

  setupFormListeners(modal);
  displayModalGallery(allWorks);
}

export function displayModalGallery(works) {
  const container = document.querySelector(".modal-gallery");
  if (!container) return;
  container.innerHTML = "";

  works.forEach(work => {
    const figure = document.createElement("figure");
    figure.classList.add("modal-figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteBtn.addEventListener("click", (e) => deleteWork(work.id, figure));

    figure.appendChild(img);
    figure.appendChild(deleteBtn);
    container.appendChild(figure);
  });
}

function populateCategorySelect(categories) {
  const select = document.getElementById("category");
  if (!select) return;
  select.innerHTML = `<option value="">-- Sélectionner --</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.name;
    select.appendChild(option);
  });
}

async function deleteWork(id, figureElement) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      // Suppression dans la modale
      figureElement.remove();
      
      // Suppression dans la galerie principale
      const mainGalleryFigure = document.querySelector(`#fig-${id}`);
      if (mainGalleryFigure) {
        mainGalleryFigure.remove();
      }
      
      showNotification("✅ Projet supprimé avec succès !");
    } else {
      showNotification("❌ Erreur lors de la suppression", true);
    }
  } catch (err) {
    console.error("Erreur suppression :", err);
    showNotification("❌ Une erreur est survenue", true);
  }
}

// Gère le comportement du formulaire d'ajout
function setupFormListeners(modal) {
  const form = modal.querySelector(".add-photo-form");
  const titleInput = form.querySelector("#title");
  const categorySelect = form.querySelector("#category");
  const imageInput = form.querySelector("#image-upload");
  const submitButton = form.querySelector(".submit-button");

  function checkFormValidity() {
    if (titleInput.value && categorySelect.value && imageInput.files.length > 0) {
      submitButton.disabled = false;
      submitButton.style.backgroundColor = "#1D6154";
      submitButton.style.cursor = "pointer";
    } else {
      submitButton.disabled = true;
      submitButton.style.backgroundColor = "gray";
      submitButton.style.cursor = "not-allowed";
    }
  }

  titleInput.addEventListener("input", checkFormValidity);
  categorySelect.addEventListener("change", checkFormValidity);
  imageInput.addEventListener("change", () => {
    showImagePreview(imageInput);
    checkFormValidity();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = titleInput.value;
    const category = categorySelect.value;
    const image = imageInput.files[0];
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("category", category);

    try {
      const res = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData
      });

      if (res.ok) {
        const newWork = await res.json();
        
        // Ajout dans la galerie principale
        addToGallery(newWork);
        
        //  Mise à jour de la galerie modale
        const modalGallery = document.querySelector(".modal-gallery");
        const newModalFigure = document.createElement("figure");
        newModalFigure.classList.add("modal-figure");
        
        const img = document.createElement("img");
        img.src = newWork.imageUrl;
        img.alt = newWork.title;
        
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
        deleteBtn.addEventListener("click", () => deleteWork(newWork.id, newModalFigure));
        
        newModalFigure.appendChild(img);
        newModalFigure.appendChild(deleteBtn);
        modalGallery.appendChild(newModalFigure);

        // Reset du formulaire
        form.reset();
        const preview = document.querySelector(".image-preview");
        preview.innerHTML = "";
        
        // Reset de l'upload area
        const uploadLabel = document.querySelector(".upload-label");
        uploadLabel.style.display = "flex";
        
        submitButton.disabled = true;
        submitButton.style.backgroundColor = "gray";
        submitButton.style.cursor = "not-allowed";

        showNotification("✅ Projet ajouté avec succès !");
        
        // Fermer automatiquement la modal après succès
        modal.style.display = "none";
      } else {
        showNotification("❌ Erreur lors de l'ajout.", true);
      }
    } catch (err) {
      console.error(err);
      showNotification("❌ Une erreur est survenue.", true);
    }
  });
}

function showImagePreview(input) {
  const preview = document.querySelector(".image-preview");
  const uploadLabel = document.querySelector(".upload-label");
  
  preview.innerHTML = "";
  const file = input.files[0];
  
  if (file) {
    // Masquer le label d'upload
    uploadLabel.style.display = "none";
    
    //  Afficher l'image prévisualisée
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.style.maxHeight = "150px";
    img.style.maxWidth = "100%";
    img.style.objectFit = "contain";
    img.style.cursor = "pointer"; // Ajout du curseur pointer
    
    // Ajouter l'événement click sur l'image pour changer de fichier
    img.addEventListener("click", () => {
      input.click();
    });
    
    preview.appendChild(img);
  } else {
    //  Réafficher le label si aucun fichier
    uploadLabel.style.display = "flex";
  }
}

function addToGallery(work) {
  const gallery = document.querySelector(".gallery");
  if (!gallery) return;
  const figure = document.createElement("figure");
  
  //  Ajout de l'ID
  figure.id = `fig-${work.id}`;
  
  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;
  const caption = document.createElement("figcaption");
  caption.textContent = work.title;
  figure.appendChild(img);
  figure.appendChild(caption);
  gallery.appendChild(figure);
}

function showNotification(message, error = false) {
  const notif = document.createElement("div");
  notif.textContent = message;
  notif.className = error ? "modal-error" : "modal-success";
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}