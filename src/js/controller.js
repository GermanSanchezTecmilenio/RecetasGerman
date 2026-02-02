// controller.js
import * as model from './model.js';
import recipeView from './views/RecipeView.js';
import resultsView from './views/ResultsView.js';
import searchView from './views/SearchView.js';
import paginationView from './views/PaginationView.js';

// Controla la carga/render de una receta individual
async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // 1) Spinner en el panel de receta
    recipeView.renderSpinner();

    // 2) Cargar receta
    await model.loadRecipe(id);

    // 3) Render receta
    recipeView.render(model.state.recipe);

  } catch (err) {
    recipeView.renderError();
  }
}

function controlPagination(goToPage) {
  // 1) Render de resultados de la página solicitada
  resultsView.render(model.getSearchResultsPage(goToPage));
  // 2) Render de la paginación actualizada
  paginationView.render(model.state.search);
}

async function controlSearchResults() {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResults(query);

    // Primera página
    resultsView.render(model.getSearchResultsPage(1));
    paginationView.render(model.state.search);

  } catch (err) {
    resultsView.renderError();
  }
}

function init() {
  recipeView.addHandlerRender(controlRecipes);      // hashchange + load
  searchView.addHandlerSearch(controlSearchResults); // submit del form
  paginationView.addHandlerClick(controlPagination); // clicks de paginación
}
init();