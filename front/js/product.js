
// Récupération de l'ID du produit à partir de la chaîne de requête de l'URL
var searchParams = new URLSearchParams(window.location.search);
var productId = searchParams.get('id');

// Récupération des détails du produit à partir de l'API
fetch(`http://localhost:3000/api/products/${productId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Les produits n'ont pas pu être récupérés");
        }
        return response.json();
    })
    .then(data => {
        // Récupération des éléments de la page à mettre à jour
        const productName = document.querySelector('#title');
        const productPrice = document.querySelector('#price');
        const productDescription = document.querySelector('#description');
        const productImg = document.querySelector('#item__img');

        // Mise à jour des éléments de la page avec les données du produit
        productName.textContent = data.name;
        productDescription.textContent = data.description;
        productPrice.textContent = data.price;
        console.log(data.price)

        // Création de la balise img
        const img = document.createElement('img');
        img.src = data.imageUrl;
        img.alt = data.altTxt;

        // Ajout de la balise img à l'élément productImg
        productImg.appendChild(img);


        // Récupération de l'élément select
        const colorSelect = document.querySelector('#colors');

        // Loop through the colors array
        for (let i = 0; i < data.colors.length; i++) {
            // Création de l'élément option
            const option = document.createElement('option');
            // Définition de la valeur de l'élément option
            option.value = data.colors[i];
            // Définition du contenu de l'élément option
            option.textContent = data.colors[i];
            // Ajout de l'élément option à la liste
            colorSelect.appendChild(option);
        }

    })
    .catch(error => {
        console.error(error);
    });



// Récupération des détails du produit à partir de l'API
fetch(`http://localhost:3000/api/products/${productId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Les produits n'ont pas pu être récupérés");
        }
        return response.json();
    })
    .then(data => {
        // Récupération des éléments de la page
        const addToCartButton = document.querySelector('#addToCart');
        const quantityInput = document.querySelector('#quantity');
        const colorSelect = document.querySelector('#colors');

        // Gestion du clic sur le bouton "Ajouter au panier"
        addToCartButton.addEventListener('click', () => {
            // Récupération de la quantité et de la couleur sélectionnées
            let quantity = parseInt(quantityInput.value); // Parse the quantity string to an integer
            const color = colorSelect.value;

            // Chargement du panier depuis localStorage
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Recherche de l'item dans le panier
            let item = cart.find(i => i.id === productId && i.color === color);

            // Si l'item n'est pas dans le panier, on l'ajoute
            if (!item) {
                item = { id: productId, quantity: quantity, color: color };
                cart.push(item);
            }
            // Si l'item est déjà dans le panier, on met à jour la quantité
            else {
                item.quantity += quantity; // Increment the quantity as an integer
            }

            // Enregistrement du panier dans localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            console.log(cart);

        });

    })
    .catch(error => {
        console.error(error);
    });
