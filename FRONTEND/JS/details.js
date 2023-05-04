const port = 3000;
const ip_add = "localhost";
const url = `http://${ip_add}:${port}`;
const carrousel = document.querySelector(".container_carrousel");

let pantalons


let id = localStorage.getItem("details");
if (id) {
    GetPantalonById(id);
    console.log(id)
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
  carrouselImg.src = imgUrls[currentImgIndex];
  carrousel.appendChild(carrouselImg);

  const leftArrow = document.createElement("button");
  leftArrow.innerHTML = "&#10094;"; // Unicode arrow symbol pointing left
  leftArrow.classList.add("arrow-button", "left-arrow");
  leftArrow.addEventListener("click", () => {
      currentImgIndex--;
      if (currentImgIndex < 0) {
          currentImgIndex = imgUrls.length - 1;
      }
      carrouselImg.src = imgUrls[currentImgIndex];
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
      carrouselImg.src = imgUrls[currentImgIndex];
  });
  carrousel.appendChild(rightArrow);

  const containerMarque = document.querySelector(".container_marque");

  const title = document.createElement("h1");
  title.textContent = pantalon.name;
  containerMarque.appendChild(title);

  if (pantalon.reduction) {
    const discountPrice = Math.round(pantalon.prix * (1 - pantalon.reduction / 100));
    const discount = document.createElement("p");
    discount.textContent = `Prix avec réduction: ${discountPrice} € (-${pantalon.reduction}%)`;
    containerMarque.appendChild(discount);
  }
}









