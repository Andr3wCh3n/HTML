let listBookHTML = document.querySelector('.listBook');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let books = [];
let cart = [];


iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})

const addDataToHTML = () => {
    // remove datas default from HTML

    // add new datas
    if (books.length > 0) // if has data
    {
        books.forEach(book => {
            let newBook = document.createElement('div');
            newBook.dataset.id = book.id;
            newBook.classList.add('item');
            newBook.innerHTML =
                `<img src="${book.image}" alt="">
                <h2>${book.book_name}</h2>
                <div class="price">$${book.price}</div>
                <button class="addCart">Add To Cart</button>`;
            listBookHTML.appendChild(newBook);
        });
    }
}
listBookHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let id_book = positionClick.parentElement.dataset.id;
        addToCart(id_book);
    }
})
const addToCart = (book_id) => {
    let positionThisbookInCart = cart.findIndex((value) => value.book_id == book_id);
    if (cart.length <= 0) {
        cart = [{
            book_id: book_id,
            quantity: 1
        }];
    } else if (positionThisbookInCart < 0) {
        cart.push({
            book_id: book_id,
            quantity: 1
        });
    } else {
        cart[positionThisbookInCart].quantity = cart[positionThisbookInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
}
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity = totalQuantity + item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.book_id;

            let positionbook = books.findIndex((value) => value.id == item.book_id);
            let info = books[positionbook];
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
            <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                ${info.book_name}
                </div>
                <div class="totalPrice">$${info.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus">-</span>
                    <span>${item.quantity}</span>
                    <span class="plus">+</span>
                </div>
            `;
        })
    }
    iconCartSpan.innerText = totalQuantity;
}

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let book_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if (positionClick.classList.contains('plus')) {
            type = 'plus';
        }
        changeQuantityCart(book_id, type);
    }
})
const changeQuantityCart = (book_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.book_id == book_id);
    if (positionItemInCart >= 0) {
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                break;

            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                } else {
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
}

const initApp = () => {
    // get data book
    fetch('books.json')
        .then(response => response.json())
        .then(data => {
            books = data;
            addDataToHTML();

            // get data cart from memory
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
            }
        })
}
initApp();