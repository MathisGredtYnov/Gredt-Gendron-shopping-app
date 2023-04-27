const port = 3000;
const ip_add = "localhost";
const url = `http://${ip_add}:${port}`;
const container = document.querySelector(".second_content");
const pickers = document.querySelectorAll(".picker");
const pantalon_button = document.querySelectorAll(".pantalon_button");
const carIcon = document.querySelector(".cart_icon");
const cartCtn = document.querySelector(".cart_ctn");

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
        pantalonCTN.innerHTML = `
            <div class="pantalon_image">
                <img src="${pantalon.img_1}" alt="${pantalon.name}" />
            </div>
            <div class="pantalon_description">
                <h3>${pantalon.name}</h3>
                <p>${pantalon.price}€</p>
                <h1>${pantalon.description}</h1>
                <button onclick="AddToCart(${pantalon.id}); toggleCart();setTimeout(() => {toggleCart();}, 1500);" class="add_to_cart">Ajouter au panier</button>
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

//change the cart icon
function toggleCart(){
    cartCtn.classList.toggle("open_cart");
    if (cartCtn.classList.contains("open_cart")){
        carIcon.src = "../ASSETS/IMG/cross.png";
    } else {
        carIcon.src = "../ASSETS/IMG/cart.png";
    }
}

//event listener
carIcon.addEventListener("click", toggleCart);


let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Adding data to the cart
function AddToCart(id){
    let pantalonChoice = filteredPantalons.find(pantalon => pantalon.id === id);
    console.log("oui" + pantalonChoice)
    cart.push(pantalonChoice);
    localStorage.setItem("cart", JSON.stringify(cart));
    LoadCart();
}

// Displaying data from the cart
function LoadCart() {
    cartCtn.innerHTML = "";
    cart.forEach(pantalon => {
        let cartItem = document.createElement("div");
        cartItem.classList.add("cart_item");
        cartItem.innerHTML = `
            <div class="cart_image">
                <img src="${pantalon.img_1}" alt="${pantalon.name}" />
            </div>
            <div class="cart_description">
                <h3>${pantalon.name}</h3>
                <p>${pantalon.price}€</p>
                <button onclick="RemoveFromCart(${pantalon.id})">Supprimer</button>
            </div>
        `;
        cartCtn.appendChild(cartItem);
    });
}

//remove item from cart
function RemoveFromCart(id){
    let indexToRemove = cart.find(pantalon => pantalon.id == id);
    cart.splice(indexToRemove, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    LoadCart();
    
}



