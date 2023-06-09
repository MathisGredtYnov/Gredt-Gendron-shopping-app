const port = 3000;
const ip_add = "localhost";
const url = `http://${ip_add}:${port}`;
const carrousel = document.querySelector(".container_carrousel");
const carIcon = document.querySelector(".cart_icon");
const cartCtn = document.querySelector(".cart_ctn");
const containerPanier = document.querySelector(".container_panier");

let pantalons
let filteredPantalons

document.addEventListener("DOMContentLoaded", () => {
    GetAllPantalons();
    afficherContenuPanier();
  });

let id = localStorage.getItem("details");
if (id) {
    GetPantalonById(id);
} else {
    window.location.href = "index.html";
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
  
    const containerPanier = document.querySelector(".container_panier");
    const addPanierBtn = document.createElement("button");
    addPanierBtn.textContent = "Ajouter au panier";
    addPanierBtn.classList.add("add_to_cart");
    addPanierBtn.setAttribute("onclick", `AddToCart(${pantalon.id}); toggleCart(); setTimeout(() => {toggleCart();}, 1500);`);
    containerPanier.appendChild(addPanierBtn);

    const continueShoppingBtn = document.createElement("button");
    continueShoppingBtn.textContent = "Continuer mes achats";
    continueShoppingBtn.classList.add("continue-shopping-btn");
    continueShoppingBtn.addEventListener("click", () => {
    window.location.href = "../index.html";
    });
    containerPanier.appendChild(continueShoppingBtn);
  
    const totalPrice = calculateTotalPriceWithReduction(pantalon);
    const priceElement = document.createElement("p");
    priceElement.textContent = `Prix total: ${totalPrice} €`;
    containerMarque.appendChild(priceElement);
}

function afficherContenuPanier() {
    const panier = JSON.parse(localStorage.getItem("cart"));
    const conteneur = document.querySelector(".cart_ctn");
  
    if (panier && conteneur) {
      conteneur.innerHTML = ""; // effacer le contenu existant du conteneur
  
      let totalPrice = 0;
  
      panier.forEach((pantalon) => {
        const pantalonDiv = document.createElement("div");
        pantalonDiv.classList.add("cart_item");
  
        pantalonDiv.innerHTML = `
          <div class="cart_image">
            <img src="../${pantalon.img_1}" alt="${pantalon.name}" />
          </div>
          <div class="cart_description">
            <h3>${pantalon.name}</h3>
            <div class="cart_counter">
              <button onclick="RemoveOneFromCart(${pantalon.id})">-</button>
              <span class="counter">${pantalon.quantity}</span>
              <button onclick="AddToCart(${pantalon.id})">+</button>
            </div>
            <p>${calculateTotalPriceWithReduction(pantalon)}€</p>
            <button class="supr" onclick="RemoveFromCart(${pantalon.id})">Supprimer</button>
          </div>
        `;
  
        conteneur.appendChild(pantalonDiv);
  
        totalPrice += calculateTotalPriceWithReduction(pantalon);
      });
  
      const totalPriceElement = document.createElement("p");
      totalPriceElement.classList.add("total_price");
      totalPriceElement.textContent = `Total: ${totalPrice}€`;
      conteneur.appendChild(totalPriceElement);
  
      const commanderButton = document.createElement("button");
      commanderButton.classList.add("commander");
      commanderButton.textContent = "Commander";
      conteneur.appendChild(commanderButton);
    }
  }


//change the image
function changeImage(img, newSrc) {
    img.src = newSrc;
}

//change the cart icon
function toggleCart(){
    cartCtn.classList.toggle("open_cart");
    if (cartCtn.classList.contains("open_cart")){
        carIcon.src = "../ASSETS/IMG/close.svg";
    } else {
        carIcon.src = "../ASSETS/IMG/cart.png";
    }
}

//event listener
carIcon.addEventListener("click", toggleCart);
let cart = JSON.parse(localStorage.getItem("cart")) || [];

//add item to cart
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
  afficherContenuPanier();
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
    afficherContenuPanier();
    
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
    afficherContenuPanier();
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