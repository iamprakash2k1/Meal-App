// To check if there's any favourite meals stored in the local storage, if not initialize an empty array

if (localStorage.getItem("favouriteList") == null) {
    localStorage.setItem("favouriteList", JSON.stringify([]));
}

// function to fetch meals from an API asynchronously
async function fetchMealsFromApi(url, value){
    const response = await fetch(`${url + value}`);
    const meals = await response.json();
    return meals;
}

// function to display the list of meals based on search input
function showMealList(){
    let inputValue = document.getElementById("my-search").value;
    let arr = JSON.parse(localStorage.getItem("favouriteList"));
    let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    let html ="";
    let meals = fetchMealsFromApi(url, inputValue);
    meals.then(data =>{
        if (data.meals) {
            data.meals.forEach((Element) =>{
                let isFav = false;
                for (let index = 0; index< arr.length; index++) {
                    if (arr[index] == Element.idMeal){
                        isFav = true;
                    }
                }
                if (isFav) {
                    html += `
                    <div id="card" class="card mb-3" style="width: 20 rem;">
                        <img src="${Element.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${Element.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${Element.idMeal})">More Details</button>
                            <button id="main${Element.idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${Element.idMeal})" style="border-radius:50%> <i class="fas-regular fa-heart" style="color: #EA183F;"></i></button>
                            </div>
                        </div>
                    </div>
                    `;
                } else{
                    html += `
                    <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${Element.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                    <h5 class="card-title">${Element.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${Element.idMeal})">More Details</button>
                            <button id="main${Element.idMeal}" class="btn btn-outline-light" onclick="addRemoveToFavList(${Element.idMeal})" style="border-radius:50%> <i class="fas-regular fa-heart" style="color: #EA183F;"></i></button>
                        </div>
                    </div>
                </div>
                `;
                }
            });
        }else{
            // display a message if no meals were found
            html +=`
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <span class="display-1 d-block">404</span>
                            <div class="mb-4 lead">
                                The meal that you are looking for wasn't found..
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
         document.getElementById("main").innerHTML = html;       
        });
    }

    // To show the meal details in main

    async function showMealDetails(id){
        let url ="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
        let html = "";
        await fetchMealsFromApi(url,id).then((data) =>{
            html += `
            <div id="meal-details" class="mb-5">
            <div id="meal-header" class="d-flex justify-content-around felx-wrap">
            <div id="meal-thumbnail">
            <img class="mb-2" src="${data.meals[0].strMealThumb}" alt="">
            </div>
            <div id="details">
                <h3>${data.meals[0].strMeal}</h3>
                <h6>Area : ${data.meals[0].strCategory}</h6>
                <h6>Area:${data.meals[0].strArea}</h6>
                </div>
            </div>
            <div id="meal-instruction" class="mt-3">
                <h5 class="text-center">Instruction : </h5>
                <p>${data.meals[0].strInstructions}</p>
                </div>
                <div class="text-center">
                <a href=${data.meals[0].strYoutube}" target="_blank" class="btn btn-outline-light mt-3">Watch Video</a>
                <a href=${data.meals[0].strSource}" target="_blank" class="btn btn-outline-light mt-3">Click to read Article</a>
                </div>
            </div>
        `;
        });
        document.getElementById("main").innerHTML =html;
    }

    // To show all Favourites in the Favourite section

    async function showFavMealList(){
        let arr= JSON.parse(localStorage.getItem("favouriteList"));
        let url ="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
        let html = "";
        if (arr.length ==0) {
            html +=`
            <div class="page-wrap d-flex flex-row align-items-center">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-12 text-center">
                    <span class="display-1 d-block">404</span>
                    <div class="mb-4 lead">
                        No Favourites added
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    } else{
        for(let index = 0; index< arr.length; index++){
            await fetchMealsFromApi(url, arr[index]).then((data) =>{
                html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${data.meals[0].strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" id="details-btn" class="btn btn-outline-light" onclick="showMealDetails(${data.meals[0].idMeal})">More Details</button>
                            <button id="main${data.meals[0].idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${data.meals[0].idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart" style="color: ff0000;"></i></button>
                        </div>
                    </div>
                    </div>
                    `;
                })
            }
        } 
        document.getElementById("favourites-body").innerHTML = html;
    }

    // To add and remove meals from the Favourites list
    function addRemoveToFavList(id){
        let arr = JSON.parse(localStorage.getItem("favouriteList"));
        let contain = false;
        for (let index = 0; index< arr.length; index++) {
            if (id == arr[index]) {
                contain =true;
            }
        }
        // add or remove the selected meal based on its presence in the favourites array
        if (contain){
            let number = arr.indexOf(id);
            arr.splice(number, 1);
            alert("Meal removed from your favourites");
        } else{
            arr.push(id);
            alert("Meal added to your favourites");
        }
        // update the favourite meals array in local storage
        localStorage.setItem("favouriteList", JSON.stringify(arr));
        // update the displayed lisits of meals 
        showMealList();
        showFavMealList();
    }