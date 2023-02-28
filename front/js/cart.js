// Récupération de l'élément contenant les articles du panier
const cartItemsContainer = document.querySelector('#cart__items');

// Récupération du panier à partir du localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

cart.sort((a, b) => a.id - b.id);

// Ajout d'une variable pour le prix total du panier
cart.price = 0;

// Parcours de l'array de produits du panier
cart.forEach(item => {
    // Récupération des données du produit
    let productId = item.id;
    let productColor = item.color;
    let productQuantity = item.quantity;

    // Récupération des détails du produit à partir de l'API
    fetch(`http://localhost:3000/api/products/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Le produit n'a pas pu être récupéré");
            }
            return response.json();
        })
        .then(data => {

            // Création de l'élément article pour le produit
            const cartItem = document.createElement('article');
            cartItem.classList.add('cart__item');
            cartItem.dataset.id = productId;
            cartItem.dataset.color = productColor;

            // Création de l'élément img pour l'image du produit
            const img = document.createElement('img');
            img.src = data.imageUrl;
            img.alt = data.altTxt;


            // Création de l'élément div pour l'image du produit
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('cart__item__img');
            imgContainer.appendChild(img);


            // Création de l'élément h2 pour le nom du produit
            const productName = document.createElement('h2');
            productName.textContent = data.name;

            // Création de l'élément p pour la couleur du produit
            const productColorPara = document.createElement('p');
            productColorPara.textContent = productColor;

            // Création de l'élément p pour le prix du produit
            const productPrice = document.createElement('p');

            // Formatage du prix du produit en utilisant la fonction Intl.NumberFormat
            const priceFormatter = new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR',
            });
            productPrice.textContent = priceFormatter.format(data.price);


            // Création de l'élément div pour la description du produit
            const descriptionContainer = document.createElement('div');
            descriptionContainer.classList.add('cart__item__content__description');
            descriptionContainer.appendChild(productName);
            descriptionContainer.appendChild(productColorPara);
            descriptionContainer.appendChild(productPrice);


            // Création de l'élément p pour la quantité du produit
            const quantityLabel = document.createElement('p');
            quantityLabel.textContent = 'Qté : ';


            // Création de l'élément input pour la quantité du produit
            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.classList.add('itemQuantity');
            quantityInput.name = 'itemQuantity';
            quantityInput.min = 1;
            quantityInput.max = 100;
            quantityInput.value = productQuantity;


            // Création de l'élément div pour la quantité du produit
            const quantityContainer = document.createElement('div');
            quantityContainer.classList.add('cart__item__content__settings__quantity');
            quantityContainer.appendChild(quantityLabel);
            quantityContainer.appendChild(quantityInput);


            // Création de l'élément p pour le bouton de suppression du produit
            const deleteButton = document.createElement('p');
            deleteButton.classList.add('deleteItem');
            deleteButton.textContent = 'Supprimer';


            // Création de l'élément div pour le bouton de suppression du produit
            const deleteContainer = document.createElement('div');
            deleteContainer.classList.add('cart__item__content__settings__delete');
            deleteContainer.appendChild(deleteButton);


            // Création de l'élément div pour les paramètres de l'article du panier
            const settingsContainer = document.createElement('div');
            settingsContainer.classList.add('cart__item__content__settings');
            settingsContainer.appendChild(quantityContainer);
            settingsContainer.appendChild(deleteContainer);


            // Création de l'élément div pour le contenu de l'article du panier
            const contentContainer = document.createElement('div');
            contentContainer.classList.add('cart__item__content');
            contentContainer.appendChild(descriptionContainer);
            contentContainer.appendChild(settingsContainer);


            // Ajout de tous les éléments à l'élément article du panier
            cartItem.appendChild(imgContainer);
            cartItem.appendChild(contentContainer);


            // Ajout de la quantité totale d'éléments au panier
            let totalQuantity = 0;
            for (let i = 0; i < cart.length; i++) {
                totalQuantity += parseInt(cart[i].quantity);
            }

            const cartQuantity = document.querySelector('#totalQuantity');
            cartQuantity.textContent = totalQuantity;
            cartItemsContainer.appendChild(cartItem);

            // Ajout du prix du produit au prix total du panier

            console.log(cart.price += data.price * productQuantity);
            const totalPrice = document.querySelector('#totalPrice');
            totalPrice.textContent = priceFormatter.format(cart.price);

            // Ajout d'un écouteur d'événement sur le bouton de suppression d'un produit
            deleteButton.addEventListener('click', (event) => {
                event.preventDefault();
                cartItemsContainer.removeChild(cartItem);
                cart = cart.filter(item => !(item.id === productId && item.color === productColor));
                localStorage.setItem('cart', JSON.stringify(cart));
                location.reload();
            });

            // Ajout d'un écouteur d'événement sur le bouton de modification de la quantité d'un produit
            quantityInput.addEventListener('change', (event) => {
                event.preventDefault();
                const newQuantity = parseInt(quantityInput.value);
                if (isNaN(newQuantity)) {
                    alert('La quantité doit être un nombre!');
                    return;
                }
                cart = cart.map(item => {
                    if (item.id === productId && item.color === productColor) {
                        item.quantity = newQuantity;
                    }
                    return item;
                });
                localStorage.setItem('cart', JSON.stringify(cart));
                location.reload();
            });

        })
        .catch(error => {
            console.error(error);
        });
});

const hideInputErrorMessage = (id) => {
    const invalidInput = document.querySelector(`#${id}ErrorMsg`)
    invalidInput.innerText = ''
}

const displayInputErrorMessage = (inputType, id) => {
    const invalidInput = document.querySelector(`#${id}ErrorMsg`)
    switch (inputType) {
        case 'firstName':
            invalidInput.innerText = 'Votre prénom semble être incorrect.'
        case 'lastName':
            invalidInput.innerText = 'Votre nom semble être incorrect.'
        case 'address':
            invalidInput.innerText = 'Votre adresse est invalide.'
        case 'city':
            invalidInput.innerText = 'Votre ville semble être incorrecte.'
        case 'email':
            invalidInput.innerText = 'Votre adresse email est invalide.'
        default:
            invalidInput.innerText = 'Ce champs est invalide.'
    }
}

const getRegex = (inputType) => {
    switch (inputType) {
        case 'firstName':
        case 'lastName':
        case 'city':
            return /(\D{2})+/
        case 'address':
            return /\d+(\s\w+)+/
        case 'email':
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        default:
            return /(.+)/
    }
}

const checkAllInputs = (inputDivs) => {
    const contactObject = {
        firstName: null,
        lastName: null,
        address: null,
        city: null,
        email: null
    }

    inputDivs.forEach((div) => {
        const input = div.querySelector('input')
        const regex = getRegex(input.name)
        const isValid = input.value.match(regex) ? true : false
        if (isValid) {
            hideInputErrorMessage(input.id)
            contactObject[input.name] = input.value
        } else {
            displayInputErrorMessage(input.name, input.id)
        }
    })
    return contactObject
}

const postOrder = async (contactObject) => {
    const cart = JSON.parse(localStorage.getItem('cart'))
    const productIds = cart.map((item) => item.id)
    const uniqueIds = [...new Set(productIds)]
    let response = await fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({contact: contactObject, products: uniqueIds})
    });
    const data = await response.json()
    return data
}

const handleFormSubmit = async (e) => {
    e.preventDefault()
    const inputDivs = document.querySelectorAll('.cart__order__form__question')
    const contactObject = checkAllInputs(inputDivs)
    if (Object.values(contactObject).every((value) => value !== null )) {
        const { orderId } = await postOrder(contactObject)
        window.location = `/front/html/confirmation.html?orderid=${orderId}`;
    } else {
        console.log('the form is not valid')
    }
}

const orderButton = document.querySelector('#order')
orderButton.addEventListener('click', (e) => {handleFormSubmit(e)})