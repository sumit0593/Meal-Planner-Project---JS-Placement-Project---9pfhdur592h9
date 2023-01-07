"use Strict";
const height = document.getElementById("height");
const weight = document.getElementById("weight");
const age = document.getElementById("age");
const gender = document.getElementById("gender");
const activity = document.getElementById("activity");
const generateMealBtn = document.getElementById("btn");
const box_1 = document.getElementsByClassName("box1");
const box_2 = document.getElementsByClassName("box2");
const box_3 = document.getElementsByClassName("box3");
const recipeBtn = document.getElementById("button");
const card = document.querySelector(".card-box");
const ingrediants =  document.querySelector(".ingrediants");
const equipment = document.querySelector(".equipment");
const steps = document.querySelector(".steps");
const tbody = document.querySelector("tbody") ///
const load = document.querySelector("#load");
const bgSection = document.querySelector(".bg");
const recipeBg = document.querySelector(".recipe");

// api Keys
const apiKey = "9cbf9c768e724bbb975fdac892698efd";

// Initial Meal Data 
async function initialMeal() { 
    const url = `https://api.spoonacular.com/mealplanner/generate?apiKey=${apiKey}&timeFrame=day`
    const api = await fetch(url);
    const resp = await api.json();
    return resp; //meal[2]
} 

async function generateInitialMeal(){
    const data = await initialMeal()
    await mealData(data.meals);
}
generateInitialMeal();

//Calculating the calories of the user
async function mealColories() {
    let bmrMale = 66.47 + (13.75 * weight.value) + (5.003 * height.value) - (6.755 * age.value);
    let bmrFemale = 655.1 + (9.563 * weight.value) + (1.850 * height.value) - (4.676 * age.value);
    if (gender.value === "male" && activity.value === "light") {
        var calories = bmrMale * 1.375;
    }
    else if (gender.value === "male" && activity.value === "moderate") {
        var calories = bmrMale * 1.55;
    }
    else if (gender.value === "male" && activity.value === "active") {
        var calories = bmrMale * 1.725;
    }
    else if (gender.value === "female" && activity.value === "light") {
        var calories = bmrFemale * 1.375;
    }
    else if (gender.value === "female" && activity.value === "moderate") {
        var calories = bmrFemale * 1.55;
    }
    else if (gender.value === "female" && activity.value === "active") {
        var calories = bmrFemale * 1.725;
    }
    const url = `https://api.spoonacular.com/mealplanner/generate?apiKey=${apiKey}&timeFrame=day&targetCalories=${calories}`;
    const resp = await fetch(url);
    const respData = await resp.json();
    return respData;
}

async function mealData (data){
    card.innerHTML = " ";
    ingrediants.innerHTML = " ";
    equipment.innerHTML = " ";
    steps.innerHTML = " ";
    data.map(async (i)=>{
        const mealUrl = `https://api.spoonacular.com/recipes/${i.id}/information?apiKey=${apiKey}&includeNutrition=false`;
        const respMeal = await fetch(mealUrl);
        const res = await respMeal.json();
        load.style.display = "block"
        setTimeout(() => {
            load.style.display = "None";
            generateHTML(res);
        }, 1500);
    })
}
async function generateMeal(){
    const data =await mealColories()
    await mealData(data.meals);
}
generateMealBtn.addEventListener('click', generateMeal);


// Generate Html Function
function generateHTML(results) {
    //hiding the Recipe Background
    bgSection.style.display = "none"
    recipeBg.style.display = "none"
    //creating dynamic element into the DOM
    const item = document.createElement("span");
    const img = document.createElement("img");
    const title = document.createElement("h3")
    let getRecipeBtn = document.createElement("Button");
    item.setAttribute("class","grid");

    //adding functionality to the Get Recipe button
    function getRecipeData(){
    //Showing the Recipe Background along with List element
        bgSection.style.display = "block"
        recipeBg.style.display = "block"

        //Adding the ingredients
        ingrediants.innerHTML = " ";
        ingrediants.innerHTML = `<h2>Ingredients</h2>`;
        let apiIngre = results.extendedIngredients;
        for(let i=0;i<apiIngre.length;i++){
            let para = document.createElement("li");
            let newPara = apiIngre[i].original;
            para.innerHTML = newPara;
            ingrediants.appendChild(para);
        }
        //Adding the Equipments
        equipment.innerHTML = " ";
        equipment.innerHTML = `<h2>Equipment</h2>`;
        for(let j=0;j<results.analyzedInstructions.length;j++){
            let apiEqipment = results.analyzedInstructions[j].steps;
            for(let i=0;i<apiEqipment.length;i++){
                let apiEqipment2 = apiEqipment[i].equipment;
                for(let k=0;k<apiEqipment2.length;k++){
                    let para = document.createElement("li");
                    let newPara = apiEqipment2[k].name;
                    para.innerHTML = newPara;
                    equipment.appendChild(para);
            }
        }
        }

        //Adding the Steps
        steps.innerHTML = " ";
        steps.innerHTML = `<h2>Steps</h2>`;
        let ol = document.createElement("ol");
        for(let j=0;j<results.analyzedInstructions.length;j++){
        let apiStep = results.analyzedInstructions[j].steps
        for(let i=0;i<apiStep.length;i++){
            let para = document.createElement("li");
            let newPara = apiStep[i].step;
            para.innerHTML = newPara;
            ol.appendChild(para);
            steps.appendChild(ol);
        }
    }   
    }
    getRecipeBtn.setAttribute("class" , "get-btn");
    getRecipeBtn.addEventListener("click", getRecipeData);
    img.setAttribute("src", results.image);
    title.innerHTML = results.title;
    getRecipeBtn.innerHTML = "Get Receipe";
    item.appendChild(img);
    item.appendChild(title);
    item.appendChild(getRecipeBtn);
    card.appendChild(item);
}