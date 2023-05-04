const port = 3000;
const ip_add = "localhost";
const url = `http://${ip_add}:${port}`;
let images = ["image1.jpg", "image2.jpg", "image3.jpg"];
let currentImage = 0;
let shortDescriptionText = ""; 
let fullDescriptionText = ""; 

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    // Utilisez les données JSON ici
  })
  .catch(error => {
    console.error('Une erreur s\'est produite lors de la récupération des données JSON : ', error);
  });

function changeImage(index) {
    currentImage = index;
    document.getElementById("image-container").src = images[currentImage];
}

function toggleDescription() {
    const shortDescription = document.getElementById("short-description");
    const fullDescription = document.getElementById("full-description");
    const toggleDescriptionBtn = document.getElementById("toggle-description");

    if (shortDescription.hidden) {
        shortDescription.hidden = false;
        fullDescription.hidden = true;
        toggleDescriptionBtn.textContent = "Voir plus";
    } else {
        shortDescription.hidden = true;
        fullDescription.hidden = false;
        toggleDescriptionBtn.textContent = "Voir moins";
    }
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
    // Assurez-vous que la première image est affichée au chargement de la page
    changeImage(0);

    // Configurez la description courte et complète
    document.getElementById("short-description").textContent = shortDescriptionText;
    document.getElementById("full-description").textContent = fullDescriptionText;
});