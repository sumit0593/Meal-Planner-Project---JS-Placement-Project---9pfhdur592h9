

document.addEventListener("DOMContentLoaded", function () {
  const height = document.getElementById("height");
  const weight = document.getElementById("weight");
  const age = document.getElementById("age");
  const gender = document.getElementById("gender");
  const activity = document.getElementById("activity");
  const mealsPerDay = document.getElementById("meals-per-day");
  const generateMealPlanBtn = document.getElementById("sub-btn");
  const mealPlanContainer = document.getElementById("meal-plan");
  const recipeModal = document.getElementById("recipe-modal");
  const recipeTitle = document.getElementById("recipe-title");
  const recipeInstructions = document.getElementById("recipe-instructions");
  const closeModal = document.getElementsByClassName("close")[0];
  const homeIcon = document.getElementById("home-icon");

  const loadingBar = document.getElementById("loading-bar");
  const loadingBarProgress = document.getElementById("loading-bar-progress");
  const loadingBarText = document.getElementById("loading-bar-text");
  
 // function to show loading bar
  function showLoadingBar() {
    loadingBar.style.display = "block";
    loadingBarProgress.style.width = "0%";
    loadingBarText.textContent = "Loading...";
  }

  // Function to update the loading bar progress
  function updateLoadingBar(progress) {
    loadingBarProgress.style.width = `${progress}%`;
  }

  // Function to hide the loading bar
  function hideLoadingBar() {
    loadingBar.style.display = "none";
  }

  const apiKey = "9cbf9c768e724bbb975fdac892698efd";

  function calculateCalories() {
    let bmrMale =
      66.47 + 13.75 * weight.value + 5.003 * height.value - 6.755 * age.value;
    let bmrFemale =
      655.1 + 9.563 * weight.value + 1.85 * height.value - 4.676 * age.value;

    let calories = 0;

    if (gender.value === "male" && activity.value === "light") {
      calories = bmrMale * 1.375;
    } else if (gender.value === "male" && activity.value === "moderate") {
      calories = bmrMale * 1.55;
    } else if (gender.value === "male" && activity.value === "active") {
      calories = bmrMale * 1.725;
    } else if (gender.value === "female" && activity.value === "light") {
      calories = bmrFemale * 1.375;
    } else if (gender.value === "female" && activity.value === "moderate") {
      calories = bmrFemale * 1.55;
    } else if (gender.value === "female" && activity.value === "active") {
      calories = bmrFemale * 1.725;
    }

    return Math.floor(calories / mealsPerDay.value);
  }

  async function fetchMealPlan() {
    showLoadingBar();

    const caloriesPerMeal = calculateCalories();
    const url = `https://api.spoonacular.com/mealplanner/generate?apiKey=${apiKey}&timeFrame=day&targetCalories=${caloriesPerMeal}&diet=balanced&number=${mealsPerDay.value}`;

    try {
      const response = await fetch(url);

      // Update loading bar progress to 50%
      updateLoadingBar(50);

      const data = await response.json();
      renderMealPlan(data);

      // Hide loading bar when meal plan is rendered
      hideLoadingBar();
    } catch (error) {
      console.log("Error fetching meal plan:", error);
      // Hide loading bar if there's an error
      hideLoadingBar();
    }
  }

  async function fetchMealImage(mealId) {
    const url = `https://api.spoonacular.com/recipes/${mealId}/information?apiKey=${apiKey}&includeNutrition=false`;
    const response = await fetch(url);
    const data = await response.json();
    return data.image;
  }

  async function renderMealPlan(data) {
    mealPlanContainer.innerHTML = "";
  
    for (const meal of data.meals) {
      const mealCard = document.createElement("div");
      mealCard.className = "meal-card";
  
      const caloriesPerMeal = calculateCalories();
  
      const mealImage = await fetchMealImage(meal.id);
  
      mealCard.innerHTML = `
        <h3>${meal.title}</h3>
        <div class="img-loaded" style="background-color: lightgreen;">
          <img src="${mealImage}" alt="${meal.title} Image">
        </div>
        <p>Calories: ${caloriesPerMeal !== undefined ? `${Math.floor(caloriesPerMeal)} kcal` : "N/A"}</p>
        <button class="view-recipe-btn" data-id="${meal.id}">View Recipe</button>
      `;
      mealPlanContainer.appendChild(mealCard);
    }
  
    const viewRecipeBtns = document.getElementsByClassName("view-recipe-btn");
    Array.from(viewRecipeBtns).forEach((btn) => {
      btn.addEventListener("click", handleViewRecipe);
    });
  }
  
  
  
  

  async function handleViewRecipe(event) {
    const mealId = event.target.dataset.id;
    const url = `https://api.spoonacular.com/recipes/${mealId}/information?apiKey=${apiKey}&includeNutrition=false`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      showRecipeModal(data);
    } catch (error) {
      console.log("Error fetching recipe:", error);
    }
  }

  function showRecipeModal(recipe) {
    recipeTitle.textContent = recipe.title;
    recipeInstructions.innerHTML = `
      <h3>Instructions:</h3>
      <ol>
        ${recipe.instructions}
      </ol>
    `;
    recipeModal.style.display = "block";
  }

  closeModal.addEventListener("click", function () {
    recipeModal.style.display = "none";
  });

  generateMealPlanBtn.addEventListener("click", function (e) {
    e.preventDefault();
    fetchMealPlan();
  });
  
  homeIcon.addEventListener("click", function () {
    location.reload();
  });
});
