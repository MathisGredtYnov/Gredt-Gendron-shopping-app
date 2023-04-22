const port = 3000;
const ip_add = "localhost";
const url = `http://${ip_add}:${port}`;
const container = document.querySelector(".second_content");
const pickers = document.querySelectorAll(".picker");

let pantalons
let filteredPantalons

// Fetching data from the server
function GetPantalons() {
    fetch(url + "/pantalons")
        .then((response) => response.json())
        .then((data) => {
            pantalons = data;
            filteredPantalons = pantalons;
            console.log(data);
            DisplayPantalons();
        });
}

// Displaying data from the server
function DisplayPantalons() {
    container.innerHTML = "";
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
    picker.addEventListener("click", SelectItem);
});

function SelectItem(e){
    let picker = e.target;
    let color = e.target.classList[2];
    pickers.forEach((e) => {
        e.classList.remove("selected");
    });
    picker.classList.add("selected");
    console.log(color);
    filterByColor(color);
}

// Filtering data color 
function filterByColor(color){
    if (color === "all"){
        filteredPantalons = pantalons;
        DisplayPantalons();
    } else {
        filteredPantalons = pantalons.filter(pantalon => pantalon.colors === color);
        container.innerHTML = "";
        if (filteredPantalons.length <= 0){
            container.innerHTML = `
                <h3>Aucun pantalon trouvé</h3>`;   
        } else {
            DisplayPantalons();
        }
    }
}
