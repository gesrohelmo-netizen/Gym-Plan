// ======================================================
// GymDietPro
// FINAL APP.JS
// Connected Dashboard System
// ======================================================

"use strict";


// ======================================================
// STORAGE KEYS
// ======================================================

const STORAGE = {

    profile: "gdp_profile",

    meals: "gdp_meals",

    groceries: "gdp_groceries",

    progress: "gdp_progress_history",

    workout: "gdp_workouts",

    settings: "gdp_settings"

};


// ======================================================
// DEFAULT DATA
// ======================================================

const defaultProfile = {

    name: "Helmo",

    age: 18,

    height: 175,

    weight: 70,

    goal: "Lean Bulk",

    calories: 2800,

    protein: 150

};


const defaultProgress = {

    calories: 0,

    protein: 0,

    carbs: 0,

    fats: 0,

    water: 0,

    workout: 0

};



// ======================================================
// HELPERS
// ======================================================


function getStorage(key, fallback){

    const data = localStorage.getItem(key);

    if(!data){

        return fallback;

    }

    try{

        return JSON.parse(data);

    }

    catch{

        return fallback;

    }

}



function setStorage(key,value){

    localStorage.setItem(
        key,
        JSON.stringify(value)
    );

}



function select(id){

    return document.getElementById(id);

}



function element(selector){

    return document.querySelector(selector);

}



// ======================================================
// INITIAL DATA CREATION
// ======================================================


if(!localStorage.getItem(STORAGE.profile)){

    setStorage(
        STORAGE.profile,
        defaultProfile
    );

}



if(!localStorage.getItem(STORAGE.progress)){

    setStorage(
        STORAGE.progress,
        defaultProgress
    );

}



if(!localStorage.getItem(STORAGE.meals)){

    setStorage(
        STORAGE.meals,
        []
    );

}



if(!localStorage.getItem(STORAGE.groceries)){

    setStorage(
        STORAGE.groceries,
        []
    );

}



if(!localStorage.getItem(STORAGE.workout)){

    setStorage(
        STORAGE.workout,
        []
    );

}



// ======================================================
// LOAD CURRENT DATA
// ======================================================


let profile =
    getStorage(
        STORAGE.profile,
        defaultProfile
    );


let progress =
    getStorage(
        STORAGE.progress,
        defaultProgress
    );


let meals =
    getStorage(
        STORAGE.meals,
        []
    );


let groceries =
    getStorage(
        STORAGE.groceries,
        []
    );


let workouts =
    getStorage(
        STORAGE.workout,
        []
    );



// ======================================================
// DASHBOARD UPDATE
// ======================================================


function updateDashboard(){


    if(select("todayCalories")){

        select("todayCalories").innerText =
            progress.calories;

    }



    if(select("todayProtein")){

        select("todayProtein").innerText =
            progress.protein + "g";

    }



    if(select("currentWeight")){

        select("currentWeight").innerText =
            profile.weight + " kg";

    }



    if(select("waterValue")){

        select("waterValue").innerText =
            progress.water + "L";

    }



    updateBars();


}




// ======================================================
// PROGRESS BARS
// ======================================================


function updateBars(){


    const calorie =
        Math.min(
            (progress.calories /
            profile.calories) * 100,
            100
        );



    const protein =
        Math.min(
            (progress.protein /
            profile.protein) * 100,
            100
        );



    const water =
        Math.min(
            (progress.water / 3) * 100,
            100
        );



    if(select("calorieProgress")){

        select("calorieProgress")
        .style.width =
        calorie + "%";


        select("caloriePercent")
        .innerText =
        Math.round(calorie)+"%";

    }



    if(select("proteinProgress")){

        select("proteinProgress")
        .style.width =
        protein + "%";


        select("proteinPercent")
        .innerText =
        Math.round(protein)+"%";

    }



    if(select("waterProgress")){

        select("waterProgress")
        .style.width =
        water+"%";


        select("waterPercent")
        .innerText =
        Math.round(water)+"%";

    }



    if(select("workoutProgress")){

        select("workoutProgress")
        .style.width =
        progress.workout+"%";


        select("workoutPercent")
        .innerText =
        progress.workout+"%";

    }


}


// Continue Part 2
// ======================================================
// BMI CALCULATOR
// ======================================================


function updateBMI(){


    if(!select("bmiValue")) return;



    const bmi =
        profile.weight /
        Math.pow(profile.height / 100,2);



    select("bmiValue").innerText =
        bmi.toFixed(1);



    let status = "Healthy";



    if(bmi < 18.5){

        status = "Underweight";

    }

    else if(bmi >= 25 && bmi < 30){

        status = "Overweight";

    }

    else if(bmi >= 30){

        status = "Obese";

    }



    if(select("bmiStatus")){

        select("bmiStatus").innerText =
            status;

    }



}




// ======================================================
// DIET SYSTEM
// ======================================================


function renderMeals(){


    const box =
        select("dietMealList") ||
        select("mealList");



    if(!box) return;



    box.innerHTML = "";



    if(meals.length === 0){


        box.innerHTML = `

        <div class="empty-state">

            <h3>No meals added</h3>

            <p>Add meals to track nutrition.</p>

        </div>

        `;


        return;

    }




    meals.forEach((meal,index)=>{


        box.innerHTML += `

        <div class="meal-item">


            <div class="meal-left">

                <h4>${meal.name}</h4>

                <span>
                    ${meal.time || "Meal"}
                </span>

            </div>



            <div class="meal-right">

                <strong>
                    ${meal.calories} kcal
                </strong>


                <small>
                    ${meal.protein}g Protein
                </small>


            </div>


        </div>

        `;


    });



}





function addMeal(){



    const form =
        select("mealForm");



    if(!form) return;



    form.addEventListener(
        "submit",
        function(e){


        e.preventDefault();



        const meal = {


            name:
            select("mealName").value,


            calories:
            Number(
                select("mealCalories").value
            ),


            protein:
            Number(
                select("mealProtein").value
            ),


            carbs:
            Number(
                select("mealCarbs").value || 0
            ),


            fats:
            Number(
                select("mealFats").value || 0
            ),


            time:
            select("mealTime").value


        };



        meals.push(meal);



        progress.calories += meal.calories;

        progress.protein += meal.protein;

        progress.carbs += meal.carbs;

        progress.fats += meal.fats;



        setStorage(
            STORAGE.meals,
            meals
        );



        setStorage(
            STORAGE.progress,
            progress
        );



        form.reset();



        renderMeals();

        updateDashboard();


        alert("Meal added successfully");



    });



}




// ======================================================
// WATER TRACKING
// ======================================================


function waterButton(){



    const button =
        select("drinkWater");



    if(!button) return;



    button.addEventListener(
        "click",
        ()=>{


        progress.water += 0.25;



        progress.water =
        Number(
            progress.water.toFixed(2)
        );



        setStorage(
            STORAGE.progress,
            progress
        );



        updateDashboard();



    });



}




// ======================================================
// GROCERY SYSTEM
// ======================================================


function renderGroceries(){


    const box =
        select("groceryList");



    if(!box) return;



    box.innerHTML = "";



    if(groceries.length===0){


        box.innerHTML = `

        <div class="empty-state">

            <h3>No items added</h3>

            <p>Your shopping list is empty.</p>

        </div>

        `;


        return;

    }





    groceries.forEach(item=>{


        box.innerHTML += `

        <div class="meal-item">


            <div class="meal-left">

                <h4>${item.name}</h4>

                <span>
                    ${item.category}
                </span>


            </div>


            <div class="meal-right">

                <strong>
                    ${item.quantity}
                </strong>


            </div>


        </div>

        `;


    });



}




function addGrocery(){


    const form =
        select("groceryForm");



    if(!form) return;



    form.addEventListener(
        "submit",
        e=>{


        e.preventDefault();



        groceries.push({


            name:
            select("groceryName").value,


            category:
            select("groceryCategory").value,


            quantity:
            select("groceryQuantity").value


        });



        setStorage(
            STORAGE.groceries,
            groceries
        );



        form.reset();



        renderGroceries();



    });



}



// Continue Part 3
// ======================================================
// PROFILE SYSTEM
// ======================================================


function profileSystem(){


    const form =
        select("profileForm");



    if(!form) return;



    form.addEventListener(
        "submit",
        e=>{


        e.preventDefault();



        profile.name =
            select("profileName").value;



        profile.age =
            Number(
                select("profileAge").value
            );



        profile.height =
            Number(
                select("profileHeight").value
            );



        profile.weight =
            Number(
                select("profileWeight").value
            );



        setStorage(
            STORAGE.profile,
            profile
        );



        updateDashboard();

        updateBMI();



        alert("Profile updated");


    });



}




// ======================================================
// PROGRESS SYSTEM
// ======================================================


function progressSystem(){


    const form =
        select("progressForm");



    if(!form) return;



    form.addEventListener(
        "submit",
        e=>{


        e.preventDefault();



        let history =
            getStorage(
                STORAGE.progress,
                []
            );



        history.push({


            weight:
            Number(
                select("weightEntry").value
            ),


            note:
            select("progressNote").value,


            date:
            new Date()
            .toLocaleDateString()


        });



        setStorage(
            STORAGE.progress,
            history
        );



        form.reset();



        alert(
            "Progress saved"
        );



    });



}





// ======================================================
// WORKOUT SYSTEM
// ======================================================


function workoutSystem(){


    const button =
        select("startWorkout");



    if(!button) return;



    button.addEventListener(
        "click",
        ()=>{


        progress.workout = 100;



        workouts.push({


            name:"Push Day",


            date:
            new Date()
            .toLocaleDateString()


        });



        setStorage(
            STORAGE.workout,
            workouts
        );



        setStorage(
            STORAGE.progress,
            progress
        );



        updateDashboard();



        alert(
            "Workout completed"
        );



    });



}





// ======================================================
// SETTINGS SYSTEM
// ======================================================


function settingsSystem(){



    const form =
        select("settingsForm");



    if(form){


        form.addEventListener(
            "submit",
            e=>{


            e.preventDefault();



            let settings = {


                name:
                select("displayName").value,


                goal:
                select("fitnessGoal").value,


                level:
                select("experienceLevel").value


            };



            setStorage(
                STORAGE.settings,
                settings
            );



            alert(
                "Settings saved"
            );



        });


    }




    const clear =
        select("clearDataBtn");



    if(clear){


        clear.addEventListener(
            "click",
            ()=>{


            localStorage.clear();



            alert(
                "All local data cleared"
            );



            location.reload();


        });



    }



}





// ======================================================
// THEME BUTTON
// ======================================================


function themeSystem(){


    const buttons =
        document.querySelectorAll(
            "#themeBtn,#appearanceToggle"
        );



    buttons.forEach(button=>{


        button.addEventListener(
            "click",
            ()=>{


            document.body
            .classList
            .toggle(
                "light-mode"
            );


        });


    });



}




// ======================================================
// QUICK GROCERY BUTTONS
// ======================================================


function quickFoods(){


    const buttons =
        document.querySelectorAll(
            ".quick-food"
        );



    buttons.forEach(button=>{


        button.addEventListener(
            "click",
            ()=>{


            groceries.push({


                name:
                button.innerText,


                category:
                "Protein",


                quantity:
                "1 item"


            });



            setStorage(
                STORAGE.groceries,
                groceries
            );



            renderGroceries();



        });



    });



}




// ======================================================
// INITIAL LOAD
// ======================================================


document.addEventListener(
"DOMContentLoaded",
()=>{


    updateDashboard();


    updateBMI();


    renderMeals();


    renderGroceries();


    addMeal();


    addGrocery();


    waterButton();


    profileSystem();


    progressSystem();


    workoutSystem();


    settingsSystem();


    themeSystem();


    quickFoods();



});



// ================= END OF FINAL APP.JS =================
const menuBtn=document.getElementById("menuToggle");
const sidebar=document.querySelector(".sidebar");
const overlay=document.getElementById("sidebarOverlay");

if(menuBtn){

menuBtn.onclick=()=>{

sidebar.classList.toggle("open");

overlay.classList.toggle("show");

};

}

if(overlay){

overlay.onclick=()=>{

sidebar.classList.remove("open");

overlay.classList.remove("show");

};

}

document.querySelectorAll(".sidebar .nav-item").forEach(item=>{

item.onclick=()=>{

if(window.innerWidth<=768){

sidebar.classList.remove("open");

overlay.classList.remove("show");

}

};

});
