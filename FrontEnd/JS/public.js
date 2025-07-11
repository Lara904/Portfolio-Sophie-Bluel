export function createWorkFigure(work) {
  const figure = document.createElement("figure");
  // Ajout de l'ID avec le préfixe fig-
  figure.id = `fig-${work.id}`;
  
  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;

  const figcaption = document.createElement("figcaption");
  figcaption.textContent = work.title;

  figure.appendChild(img);
  figure.appendChild(figcaption);
  return figure;
}

export function displayWorks(works, gallery) {
  gallery.innerHTML = "";
  works.forEach(work => {
    gallery.appendChild(createWorkFigure(work));
  });
}

export function createFilterButtons(categories, allWorks, gallery, container) {
  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.classList.add("filter-button", "active");
  container.appendChild(allButton);

  allButton.addEventListener("click", () => {
    displayWorks(allWorks, gallery);
    setActiveButton(allButton);
  });

  categories.forEach(category => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.classList.add("filter-button");

    button.addEventListener("click", () => {
      const filtered = allWorks.filter(work => work.categoryId === category.id);
      displayWorks(filtered, gallery);
      setActiveButton(button);
    });

    container.appendChild(button);
  });
}

function setActiveButton(activeButton) {
  const buttons = document.querySelectorAll(".filter-button");
  buttons.forEach(btn => btn.classList.remove("active"));
  activeButton.classList.add("active");
}