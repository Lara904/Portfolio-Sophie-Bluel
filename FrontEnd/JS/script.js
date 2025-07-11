import { fetchWorks, fetchCategories } from './api.js';
import { displayWorks, createWorkFigure, createFilterButtons } from './public.js';
import { enableAdminMode } from './admin.js';

const gallery = document.querySelector(".gallery");
const filtersContainer = document.querySelector(".filters");
let allWorks = [];

const token = localStorage.getItem("token");

// Chargement des travaux
fetchWorks().then(works => {
  allWorks = works;
  displayWorks(works, gallery);

  // ✅ Mode admin : activé uniquement après chargement des works
  if (token) {
    enableAdminMode(allWorks);
  }
});

// Chargement des catégories (indépendant)
fetchCategories().then(categories => {
  createFilterButtons(categories, allWorks, gallery, filtersContainer);
});