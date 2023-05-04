const port = 3000;
const ip_add = "localhost";
const url = `http://${ip_add}:${port}`;
const carrousel = document.querySelector(".container_carrousel");

let pantalons


let id = localStorage.getItem("details");
if (id) {
    GetPantalonById(id);
} else {
    window.location.href = "index.html";
}

function GetPantalonById(id) {
    fetch(`${url}/pantalon/${id}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            DisplayPantalon(data);
        })
        .catch(err => console.log(err))
}

function DisplayPantalon(pantalon) {
    const imgUrls = [pantalon.img_1, pantalon.img_2, pantalon.img_3];
    let currentImgIndex = 0;
  
    const carrouselImg = document.createElement("img");
    carrouselImg.src = "../" + imgUrls[currentImgIndex];
    carrousel.appendChild(carrouselImg);
  
    const leftArrow = document.createElement("button");
    leftArrow.innerHTML = "&#10094;"; // Unicode arrow symbol pointing left
    leftArrow.classList.add("arrow-button", "left-arrow");
    leftArrow.addEventListener("click", () => {
      currentImgIndex--;
      if (currentImgIndex < 0) {
        currentImgIndex = imgUrls.length - 1;
      }
      carrouselImg.src = "../" + imgUrls[currentImgIndex];
    });
    carrousel.appendChild(leftArrow);
  
    const rightArrow = document.createElement("button");
    rightArrow.innerHTML = "&#10095;"; // Unicode arrow symbol pointing right
    rightArrow.classList.add("arrow-button", "right-arrow");
    rightArrow.addEventListener("click", () => {
      currentImgIndex++;
      if (currentImgIndex >= imgUrls.length) {
        currentImgIndex = 0;
      }
      carrouselImg.src = "../" + imgUrls[currentImgIndex];
    });
    carrousel.appendChild(rightArrow);
  
    const containerMarque = document.querySelector(".container_marque");
    const title = document.createElement("h1");
    title.textContent = pantalon.name;
    containerMarque.appendChild(title);
  
    const containerDescription = document.querySelector(".container_description");
    const description = document.createElement("p");
    const fullDescription = document.createElement("p");
    fullDescription.style.display = "none";
    if (pantalon.description.length > 150) {
      description.textContent = pantalon.description.substring(0, 150) + "...";
      fullDescription.textContent = pantalon.description;
    } else {
      description.textContent = pantalon.description;
    }
    containerDescription.appendChild(description);
    containerDescription.appendChild(fullDescription);
  
    const fullDescriptionBtn = document.createElement("button");
    fullDescriptionBtn.textContent = "Voir la description complète";
    fullDescriptionBtn.classList.add("full-description-btn");
    fullDescriptionBtn.addEventListener("click", () => {
      if (description.style.display === "none") {
        description.style.display = "block";
        fullDescription.style.display = "none";
        fullDescriptionBtn.textContent = "Voir la description complète";
      } else {
        description.style.display = "none";
        fullDescription.style.display = "block";
        fullDescriptionBtn.textContent = "Voir moins";
      }
    });
    containerDescription.appendChild(fullDescriptionBtn);
  
    const totalPrice = calculateTotalPriceWithReduction(pantalon);
    const priceElement = document.createElement("p");
    priceElement.textContent = `Prix total: ${totalPrice} €`;
    containerMarque.appendChild(priceElement);
}

function calculateTotalPriceWithReduction(pantalon) {
    let total = pantalon.price;
    if (pantalon.quantity > 0) {
        total *= pantalon.quantity;
    }
    let reduction = pantalon.reduction || 0;
    return total - (total * reduction / 100);
}

function changeImage(img, newSrc) {
    img.src = newSrc;
}

//change the cart icon
function toggleCart(){
    cartCtn.classList.toggle("open_cart");
    if (cartCtn.classList.contains("open_cart")){
        carIcon.src = "ASSETS/IMG/close.svg";
    } else {
        carIcon.src = "ASSETS/IMG/cart.png";
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
