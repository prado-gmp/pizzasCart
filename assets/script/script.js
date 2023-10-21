//VARIAVEIS DE ESCOPO GERAL
let cart = [];
let modalQt = 1;
let modalKey = 0;

//--MAPEAMENTO: ELEMENTOS DA TELA
pizzaList.map((item, index) => {
    //CRIANDO A VARIÁVEL E CLONANDO O MODELO DO PROJETO
    let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);
    
    //PRENCHIMENTO DO MODELO DA HOME
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    
    //SELEÇÃO DE CADA ITEM INDIVIDUAL
    pizzaItem.setAttribute('data-key', index);

    //--EVENT CLICK: BOTÃO: MODAL
    pizzaItem.querySelector('a').addEventListener('click', (e) => {

        //EVITAMENTO DO COMPORTAMENTO PADRÃO AO CLICAR
        e.preventDefault();

        //INDIVIDUALIZAÇÃO DE CADA ITEM
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;
        
        //PREECHIMENTO DO MODAL
        document.querySelector('.pizzaBig img').src = pizzaList[key].img;
        document.querySelector('.pizzaInfo h1').innerHTML = pizzaList[key].name;
        document.querySelector('.pizzaInfo--desc').innerHTML = pizzaList[key].description;
        document.querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaList[key].price.toFixed(2)}`
        //REMOÇÃO DO ITEM PRÉ SELECIONADO
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
        //DETERMINANDO OS TAMANHOS DAS PIZZAS
        document.querySelectorAll(".pizzaInfo--size").forEach((size, sizeIndex) => {
            //RESET DA QUANTIDADE DE PIZZAS DO MODAL;
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaList[key].sizes[sizeIndex];
        });

        //RESET DA QUANTIDADE DE PIZZAS, TODA VEZ QUE ELE FOR ABERTO
        document.querySelector('.pizzaInfo--qt').innerHTML = modalQt;

        //APARECIMENTO DO MODAL
        document.querySelector('.pizzaWindowArea').style.display = 'flex';

        //OPACIDADE DA ANIMAÇÃO DE ENTRADA DO MODAL
        document.querySelector('.pizzaWindowArea').style.opacity = '0'
        setTimeout(() => {
        document.querySelector('.pizzaWindowArea').style.opacity = '1'
        }, 300)
    });

    //JUNÇÃO DA VARIAVEL 'pizzaItem' COM A TAG 'pizza-area'
    document.querySelector(".pizza-area").append(pizzaItem);
});     

//--MODAL EVENTS--
function closeModal() {
    document.querySelector('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        document.querySelector('.pizzaWindowArea').style.display = 'none';
    }, 500);    
};
    document.querySelectorAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

//EVENT CLICK: ADD BUTTON
document.querySelector('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    document.querySelector('.pizzaInfo--qt').innerHTML = modalQt;
});

//EVENT CLICK:LESS BUTTON
document.querySelector('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if(modalQt > 1) {
        modalQt--;
        document.querySelector('.pizzaInfo--qt').innerHTML = modalQt;
    };
});

//EVENT CLICK: MUDANÇA DOS TAMANHOS 
document.querySelectorAll(".pizzaInfo--size").forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected')
    });
});

//EVENT CLICK: CART BUTTON
document.querySelector('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(document.querySelector('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaList[modalKey].id+ '@' + size;
    let key = cart.findIndex((item) => item.identifier == identifier);

    if(key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id:pizzaList[modalKey].id,
            size,
            qt: modalQt
        });
    }

    updateCart();
    closeModal();
});

document.querySelector('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
        document.querySelector('aside').style.left = '0';
    }
});
document.querySelector('.menu-closer').addEventListener('click', () => {
    document.querySelector('aside').style.left = '100vw'
})

//CART AREA
function updateCart() {

    document.querySelector('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        document.querySelector('aside').classList.add('show');
        document.querySelector('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let pizzaItem = pizzaList.find((item) => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = document.querySelector('.models .cart--item').cloneNode(true);
            
            let pizzaSizeName;

            //MODIFICAÇÃO DOS NUMEROS 0, 1 E 2, PARA AS LETRAS CORREPONDENTES AOS TAMANHOS;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

            //PREENCHIMENTO DOS ITENS DO CARRINHO
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=> {
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=> {
                cart[i].qt++;
                updateCart();
            });
        
            document.querySelector('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        document.querySelector('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        document.querySelector('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        document.querySelector('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`

    } else {
        document.querySelector('aside').classList.remove('show');
        document.querySelector('aside').style.left = '100vw';
    }
}

