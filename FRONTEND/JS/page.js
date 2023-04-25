const port = 3000;
const ip_add = "localhost";
const url = `http://${ip_add}:${port}`;
const container = document.querySelector(".second_content");
const pickers = document.querySelectorAll(".picker");
const pantalon_button = document.querySelectorAll(".pantalon_button");

let pantalons
let filteredPantalons

pantalon_button.forEach(button => {
    button.addEventListener("click", () => {
        GetPantalons(button.dataset.sexe);
        setTimeout(() => {
            DisplayPantalons();
        }, 100);

    });
});

function GetAllPantalons() {
    fetch(url + "/pantalons")
        .then((response) => response.json())
        .then((data) => {
            const pantalonsFemme = data.Femme.pantalons;
            const pantalonsHomme = data.Homme.pantalons;
            const pantalons = pantalonsFemme.concat(pantalonsHomme);
            filteredPantalons = pantalons;
        });
}

// Fetching data from the server
function GetPantalons(sexe) {
    fetch(url + "/pantalons/" + sexe)
        .then((response) => response.json())
        .then((data) => {
            filteredPantalons = data;
        });
}

// Displaying data from the server
function DisplayPantalons() {
    container.innerHTML = "";
    console.log(filteredPantalons);
    filteredPantalons.forEach(pantalon => {
        let pantalonCTN = document.createElement("div");
        pantalonCTN.classList.add("pantalon_item");
        container.innerHTML += `
            <img src="${pantalon.img_1}" alt="${pantalon.name}" />
            <div class="card-body">
                <h3>${pantalon.name}</h3>
                <p>${pantalon.price}€</p>
                <button onclick="AddToCart(${pantalon.id})">Ajouter au panier</button>
            </div>
        `;
        container.appendChild(pantalonCTN);
    });
}

// Filtering data from the server
pickers.forEach(picker => {    
    picker.addEventListener("click", () => {
        filterByColor(picker.classList[2]);
        setTimeout(() => {
            DisplayPantalons();
        }, 100);
    });
});

// Filtering data color 
function filterByColor(color){
    GetAllPantalons();
    setTimeout(() => {
        if (color !== "all"){
            filteredPantalons = filteredPantalons.filter(pantalon => pantalon.colors === color);
            container.innerHTML = "";
            if (filteredPantalons.length <= 0){
                container.innerHTML = `
                    <h3>Aucun pantalon trouvé</h3>`;   
            }
        }
    }, 100);
    
}
