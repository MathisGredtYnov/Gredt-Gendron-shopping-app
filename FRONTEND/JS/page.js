const port = 3000;
const ip_add = "localhost";
const url = `http://${ip_add}:${port}`;
const container = document.querySelector(".second_content");
const pantalon_button = document.querySelectorAll(".pantalon_button");
const carIcon = document.querySelector(".cart_icon");
const cartCtn = document.querySelector(".cart_ctn");
const filterImg = document.querySelector(".filter");

let pantalons
let filteredPantalons

document.querySelector(".color_picker_ctn").addEventListener("change", GetSelectedValue);
document.querySelector(".sexe_picker_ctn").addEventListener("change", GetSelectedValue);
document.querySelector(".price_picker_ctn").addEventListener("change", GetSelectedOrder);

GetAllPantalons();
setTimeout(() => {
    DisplayPantalons();
}, 100);

function GetSelectedValue() {
    let selected_color_input = document.querySelector(".color_picker_ctn input:checked");
    let selected_sexe_input = document.querySelector(".sexe_picker_ctn input:checked");
    if (selected_color_input && selected_sexe_input) {
        let selected_color = selected_color_input.value;
        let selected_sexe = selected_sexe_input.value;
        if (selected_color === "all" && selected_sexe === "all") {
            filteredPantalons = pantalons;
        } else if (selected_color === "all") {
            filteredPantalons = pantalons.filter(pantalon => pantalon.sexe === selected_sexe);
        } else if (selected_sexe === "all") {
            filteredPantalons = pantalons.filter(pantalon => pantalon.colors === selected_color);
        } else {
            filteredPantalons = pantalons.filter(pantalon => pantalon.colors === selected_color && pantalon.sexe === selected_sexe);
        }
        container.innerHTML = "";
        if (filteredPantalons.length <= 0) {
            container.innerHTML = `
                <h3>Aucun pantalon trouvé</h3>`;
        }
        DisplayPantalons();
    }
}

//SortByPrice
function GetSelectedOrder() {
    let selected_price = document.querySelector(".price_picker_ctn input:checked").value;
    console.log(selected_price)
    if (selected_price === "ascending") {
        console.log(filteredPantalons)
        console.log("tri croissant")
        filteredPantalons.sort((a, b) => calculateTotalPriceWithReduction(a) - calculateTotalPriceWithReduction(b));
        console.log(filteredPantalons)
        DisplayPantalons();
    } else if (selected_price === "descending") {
        console.log("tri decroissant")
        filteredPantalons.sort((a, b) => calculateTotalPriceWithReduction(b) - calculateTotalPriceWithReduction(a));
        DisplayPantalons();
    } else {
        alert("c'est pas bien de bidouiller le code")
    }
}
    


function GetAllPantalons() {
    fetch(url + "/pantalons")
        .then((response) => response.json())
        .then((data) => {
            pantalons = data.Femme.pantalons.concat(data.Homme.pantalons);
            filteredPantalons = pantalons;
        })
        .catch(error => {
            console.log(error);
        })
}

// Displaying data from the server
function DisplayPantalons() {
    container.innerHTML = "";
    filteredPantalons.forEach(pantalon => {
        let pantalonCTN = document.createElement("div");
        pantalonCTN.classList.add("pantalon_item");
        pantalonCTN.innerHTML = `
            <div class="pantalon_image">
                <img src="${pantalon.img_1}" alt="${pantalon.name}" onmouseenter="this.src='${pantalon.img_2}'" onmouseleave="this.src='${pantalon.img_1}'" />
            </div>
            <div class="pantalon_description">
                <h3>${pantalon.name}</h3>
                <p>${pantalon.reduction ? `<span class="prix_barre">${pantalon.price}${pantalon.devise}</span> <span class="prix_reduit">${pantalon.price - (pantalon.price * pantalon.reduction / 100)}${pantalon.devise} (- ${pantalon.reduction}%)</span>` : `${pantalon.price}${pantalon.devise}`}</p>
                <button onclick="AddToCart(${pantalon.id}); toggleCart();setTimeout(() => {toggleCart();}, 1500);" class="add_to_cart">Ajouter au panier</button>
                <button onclick="Details(${pantalon.id});" class="details_button">Plus de détails</button>
            </div>
        `;
        container.appendChild(pantalonCTN);
    });
}

function Details(id){
    localStorage.setItem("details", id);
    window.location.href = "details.html";
}

function changeImage(img, newSrc) {
    img.src = newSrc;
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
    let itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        cart[itemIndex].quantity++;
        cart[itemIndex].totalPrice = cart[itemIndex].quantity * cart[itemIndex].price;
    } else {
        pantalonChoice.quantity = 1;
        pantalonChoice.totalPrice = pantalonChoice.price;
        cart.push(pantalonChoice);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    LoadCart();
}

// Displaying data from the cart
function LoadCart() {
    cartCtn.innerHTML = "";
    let cartCounts = {};
    let totalPrice = 0;
    cart.forEach(pantalon => {
        if (cartCounts[pantalon.id]) {
            cartCounts[pantalon.id] += pantalon.quantity;
        } else {
            cartCounts[pantalon.id] = 1;
        }
        totalPrice += calculateTotalPriceWithReduction(pantalon);
    });

    Object.entries(cartCounts).forEach(([id, count]) => {
        let pantalon = filteredPantalons.find(pantalon => pantalon.id === parseInt(id));
        let cartItem = document.createElement("div");
        cartItem.classList.add("cart_item");
        cartItem.innerHTML = `
            <div class="cart_image">
                <img src="${pantalon.img_1}" alt="${pantalon.name}" />
            </div>
            <div class="cart_description">
                <h3>${pantalon.name}</h3>
                <div class="cart_counter">
                    <button onclick="RemoveOneFromCart(${pantalon.id})">-</button>
                    <span class ="counter">${countDuplicates(cart, pantalon)}</span>
                    <button onclick="AddToCart(${pantalon.id})">+</button>
                </div>
                <p>${calculateTotalPriceWithReduction(pantalon) * count}€</p>
                <button class = "supr" onclick="RemoveFromCart(${pantalon.id})">Supprimer</button>
            </div>
        `;
        cartCtn.appendChild(cartItem);
    });

    let totalPriceElement = document.createElement("p");
    totalPriceElement.classList.add("total_price");
    totalPriceElement.textContent = "Total: " + totalPrice + "€";
    cartCtn.appendChild(totalPriceElement);

    let commanderButton = document.createElement("button");
    commanderButton.classList.add("commander");
    commanderButton.textContent = "Commander";
    cartCtn.appendChild(commanderButton);
}

//remove item from cart
function RemoveFromCart(id) {
    const indexToRemove = cart.findIndex((pantalon) => pantalon.id == id);
    if (indexToRemove === -1) {
        return;
    }
    const pantalonToRemove = cart[indexToRemove];
    const pantalonCount = countDuplicates(cart, pantalonToRemove);

    cart.splice(indexToRemove, 1);

    // Mettre à jour le prix total de l'article en fonction de la quantité
    pantalonToRemove.totalPrice = pantalonToRemove.price * pantalonCount * (1 - pantalonToRemove.discount / 100);
    localStorage.setItem("cart", JSON.stringify(cart));
    LoadCart();
}

function RemoveOneFromCart(id) {
    let indexToRemove = cart.findIndex((pantalon) => pantalon.id == id);
    if (indexToRemove === -1) {
        return;
    }
    let pantalonToRemove = cart[indexToRemove];
    pantalonToRemove.quantity--;

    if (pantalonToRemove.quantity === 0) {
        cart.splice(indexToRemove, 1);
    }

    // Mettre à jour le prix total de l'article en fonction de la quantité
    pantalonToRemove.totalPrice = pantalonToRemove.price * pantalonToRemove.quantity * (1 - pantalonToRemove.discount / 100);
    localStorage.setItem("cart", JSON.stringify(cart));
    LoadCart();
}

//Quantité d'articles dans le panier
function countDuplicates(arr, value) {
    let product = arr.find(p => p.id === value.id);
    return product ? product.quantity : 0;
}

//Calcul du prix total avec réduction
function calculateTotalPriceWithReduction(pantalon) {
    let total = pantalon.price;
    if (pantalon.quantity > 0) {
        total *= pantalon.quantity;
    }
    let reduction = pantalon.reduction || 0;
    return total - (total * reduction / 100);
}