fetch('http://localhost:3000/api/products')
    .then(function(response) {
        if (response.ok) {
            // Conversion de la réponse en objet JavaScript
            return response.json();
        } else {
            // Erreur de la requête, affichage d'une erreur à l'utilisateur
        }
    })
    .then(function(data) {
        // Parcours de l'ensemble des produits
        data.forEach(function(product) {
            // Création d'un élément HTML pour chaque produit
            var productElement = document.createElement('div');
            productElement.innerHTML = `
                <a href="../html/product.html?id=${product._id}">
                <article>
                  <img src="${product.imageUrl}" alt="Lorem ipsum dolor sit amet, Kanap name1">
                  <h3 class="productName">${product.name}</h3>
                  <p class="productDescription">${product.description}</p>
                  </article>
                </a>
            `;
            // Ajout de l'élément au DOM
            document.getElementById('items').appendChild(productElement);
        });
    });

