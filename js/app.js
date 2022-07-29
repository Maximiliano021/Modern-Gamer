let btnBuy, carritoCanvas, spanCantidadProd, btnCarrito, mainHTML, allProductos, modalBody, modalFooter, detalle,valorClick;
let carrito = [];

class Producto {
    constructor(nombre, srcImagen, precio, categoria, id) {
        this.nombre = nombre;
        this.srcImagen = srcImagen;
        this.precio = precio;
        this.categoria = categoria;
        this.id = id;
    }
}

const productos = [
    new Producto("iPhone 13", "./assets/Iphone13.png", 110.182, "CELULAR", 1),
    new Producto("iPhone 12 PLUS", "./assets/Iphone12.png", 95.5282, "CELULAR", 2),
    new Producto("iPhone 10", "./assets/Iphone10.jpg", 90.5182, "CELULAR", 3),
    new Producto("MacBook Pro 13", "./assets/MacBookPro13.png", 120.299, "NOTEBOOK", 4),
    new Producto("MacBook Pro MAX", "./assets/MacBookProMax.png", 150.519, "NOTEBOOK", 5),
    new Producto("MacBook Air M1", "./assets/MacBookAir.png", 250.429, "NOTEBOOK", 6),
    new Producto("iPad Pro Plus", "./assets/IpadProPlus.png", 10.206, "IPAD", 7),
    new Producto("iPad Pro 2", "./assets/IpadPro2.png", 9.119, "IPAD", 8),
    new Producto("iPad Plus", "./assets/IPadPlus.jpg", 10.119, "IPAD", 9),
    new Producto("Smartwatch FK88", "./assets/SmartwatchFK88.png", 92.361, "RELOJ", 10),
    new Producto("Smartwatch T500", "./assets/SmartwatchT500.png", 92.361, "RELOJ", 11),
    new Producto("Smartwatch Series 7", "./assets/SmartWatchSeries7.png", 92.361, "RELOJ", 12),
    new Producto("Airpod Pro", "./assets/AirpodPro.png", 51.213, "AURICULAR", 13),
    new Producto("Airpod Pro 1", "./assets/Airpods1.jpg", 51.213, "AURICULAR", 14),
    new Producto("Airpod 2da Generacion", "./assets/Airpod2daGeneracion.png", 51.213, "AURICULAR", 15),
]

class productoACarrito {
    constructor(producto, cantidad) {
        this.producto = producto;
        this.cantidad = cantidad;
        this.precioTotal = this.producto.precio;
    }
}

function app() {
    crearHTML();
    asignarClassId();
    document.addEventListener('DOMContentLoaded',iniciarLocalStorage);
    document.addEventListener('click', eventoClick);
}

let crearHTML = () => {
    let main = document.createElement('div');
    main.innerHTML = `
        <div class="row m-4 container">                           
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">COMPRA</h5>
                        <button type="button" class="btn-close close-modal" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                    
                    </div>
                    <div class="modal-footer">
                    </div>
                </div>
            </div>
        </div>
        <div class="main" data-aos="fade-zoom-in" data-aos-delay="100">
            <div class="categoria row" id="NOTEBOOK"></div>
            <div class="categoria row" id="IPAD"></div>
            <div class="categoria row" id="CELULAR"></div>
            <div class="categoria row" id="RELOJ"></div>
            <div class="categoria row" id="AURICULAR"></div>
            <div class="categoria all-productos"></div>
        </div>`;
    main.classList.add('container')
    document.querySelector('.content').append(main);
    mostrarProductos();
}

function mostrarProductos() {
    let delay = 100,contentCagoria, categoria;
    productos.forEach(producto => {
        categoria = document.getElementById(`${producto.categoria}`);
        contentCagoria = document.createElement('div');
        productoHTML = document.createElement('div');

        productoHTML.innerHTML = `
            <div class="card bg-transparent" style="width: 16rem;" data-aos="fade-zoom-in" data-aos-delay="${delay}">
                <div class="contain-img p-3 bg-white">
                <img src="${producto.srcImagen}" class="card-img-top prod-img" alt="${producto.nombre}">
                </div>
                <div class="card-body ">
                <h5 class="card-title fw-bold text-center">${producto.nombre}</h5>
                <p class="card-text fw-light">and make up the bulk of the card's content.</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="fw-bold precio fs-6">$${producto.precio} USD</span>
                    <button type="button" id="${producto.id}" class="btn btn-primary agregar" data-bs-toggle="modal" data-bs-target="#exampleModal">COMPRAR</button>
                </div>
                </div>
                </div>
            </div>`;
        delay == 300 ? delay = 100 : delay += 100;
        contentCagoria.innerHTML = `<h3 class="fw-bolder">LO MEJOR DE LA CATEGORIA ${producto.categoria}</h3><p class="w-50">${lorem()}</p>`;
        
        if (categoria.textContent == '')
            categoria.append(contentCagoria);
        
        productoHTML.classList.add('col', 'producto');
        categoria.append(productoHTML);
    })
}

function eventoClick(e) {
    targetSelect = e.target;
    
    /* Encontrar el producto en la matriz de productos y luego actualizar el carrito. */
    if ( targetSelect.classList.contains('agregar') || (targetSelect.classList.contains('buy-prod')) ) {
        e.preventDefault();        
        let productoDevuelto = productos.find(e => e.id == targetSelect.id);
        targetSelect.classList.contains('buy-prod') ? actualizarCarrito(productoDevuelto) 
        : btnCarrito.click(); detalleProducto(productoDevuelto);
    }
    if ( targetSelect.classList.contains('btn-deleteProd' ))
        eliminarCarrito(targetSelect);

    if (targetSelect.classList.contains('no-buy'))
        btnCloseCanvas.click() //cerramos canvas;

    if ( targetSelect.classList.contains('inputCantidad' )) {
        const nuevoValor = targetSelect.value;
        const elegido = carrito.find(e => e.producto.id == targetSelect.id)
        if (nuevoValor != '') {
            elegido.cantidad = Number(nuevoValor)
            elegido.precioTotal = (elegido.cantidad * elegido.producto.precio).toFixed(3); 
            carritoUI();
            sincronizarLocalStorage();
        }
    }
}

function actualizarCarrito(nuevoProducto) {
    const prodEncontrado = carrito.find(prod => prod.producto.id == nuevoProducto.id)

    if (prodEncontrado == undefined) {
        const cargarProducto = new productoACarrito(nuevoProducto, 1);
        carrito.push(cargarProducto);
    }
    else {
        prodEncontrado.cantidad++;
        prodEncontrado.precioTotal += prodEncontrado.precioTotal;
    }
    mostrarAlert('Agregado');
    sincronizarLocalStorage();
    carritoUI();
}

function carritoUI() {
    let detalleProducto;
    carritoCanvas.innerHTML = '';
    let totalCantidad = 0;
    carrito.forEach(prod => {
        detalleProducto = document.createElement('div')
        detalleProducto.innerHTML = `
            <div class="d-flex justify-content-between">
                <img src="${prod.producto.srcImagen}" class="img-prod-carrito" alt="...">
                <h5 class="card-title fw-bold text-center">${prod.producto.nombre}</h5>
                <button type="button" class="btn-close btn-deleteProd" id="${prod.producto.id}" aria-label="Close"></button>
                </div>
                <div class="d-block m-2">
                <div class="d-flex justify-content-between">
                    <div class="d-flex justify-content-center">
                    <label>Cantidad</label>
                    <input style="width:50px" class="mx-2 inputCantidad" id="${prod.producto.id}" type="number" min="1" value="${prod.cantidad}">
                    </div>
                    <span class="fw-bold precio fs-5">$${prod.precioTotal} USD</span>
                </div>
            </div>`;
        totalCantidad += prod.cantidad;
        detalleProducto.classList.add('producto-carrito');
        carritoCanvas.append(detalleProducto);
    })
    let totalSuma = 0;
    carrito.map(prod=> totalSuma+= prod.producto.precio*prod.cantidad)
    document.getElementById('totalCarrito').textContent = totalSuma.toFixed(3);

    //actualiza cantidad de productos en carrito por HTML
    totalCantidad == 0 ? spanCantidadProd.textContent = ''
    : spanCantidadProd.textContent = totalCantidad;
}

function detalleProducto(selectProducto) {
    let detalle = document.createElement('div');
    document.querySelector('.close-modal').click();

    modalFooter.textContent = '';
    modalBody.textContent = '';
    modalFooter.innerHTML = `
        <button type="button" class="btn btn-secondary no-buy" data-bs-dismiss="modal">Cancelar</button>
        `;
    detalle.innerHTML = `
        <div class="row d-flex justify-content-center align-items-center p-sm-0 ">
            <div class="d-block col-12 col-lg-6 col-mb-2 justify-content-center">
            <img src="${selectProducto.srcImagen}" class="card-img card-img-top" alt="...">
            </div>
            <div class="col-11 col-lg-6 col-mb-10 justify-content-start p-1 p-lg-0 my-3 my-lg-0">
            <div class="description col-12 col-lg-12">
                <h2 class="description-title mb-4">${selectProducto.nombre}</h2>
                <p class="text-black-50 mb-3">${lorem()}</p>
                <div class="col-12 col-lg-6 d-lg-block d-flex justify-content-lg-center justify-content-between  align-items-center">
                <div class="col-5 my-1 d-flex justify-content-lg-start justify-content-between align-items-center">
                    <span class="fs-3 text-black precio fw-bold">${selectProducto.precio}</span>
                    <label class="text-center descuento mx-3 pb-1 pe-2 ps-2">50%</label>
                </div>
                <strike class="opacity-25 fw-bold">$250.00</strike>
                </div>
            </div>
            <form class="mx-auto my-lg-0 mx-lg-0 d-lg-flex d-block justify-content-start col-10 col-lg-12 align-items-center">
                <div class="d-flex justify-content-lg-center justify-content-between">
                    <button class="btn btn-primary buy-prod" id="${selectProducto.id}">
                      AGREGAR
                  </button>
                </div>
            </form>
            </div>
        </div>`;
    
    detalle.classList.add('container');
    modalBody.append(detalle);
}

function eliminarCarrito(elemento) {
    let prodCarrito = carrito.find(prod => prod.producto.id == elemento.id)
    carrito = carrito.filter(prod => prod.producto.id != prodCarrito.producto.id)
    sincronizarLocalStorage();
    carritoUI();
}   

function lorem() {
    return "Lorem Ipsum is simply dummy text of the printing. Lorem Ipsum has been the industry's standard dummy text ever since."
}

function asignarClassId(){
    modalBody = document.querySelector('.modal-body')
    modalFooter = document.querySelector('.modal-footer')
    spanCantidadProd = document.querySelector('.cantidad-prod');
    btnCarrito = document.querySelector('.btn-cart');
    mainHTML = document.querySelector('.main');
    allProductos = document.querySelector('.all-productos');
    btnCloseCanvas = document.querySelector('.close-canvas');

    carritoCanvas = document.getElementById('lista-carrito');
}

function iniciarLocalStorage(){
    carrito = JSON.parse( localStorage.getItem('carrito') ) || [];
    carrito != []? carritoUI() : '';
}

function sincronizarLocalStorage(){
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function mostrarAlert(mensaje){
    Toastify({
        text: mensaje, 
        duration: 1000,
        position: "center"
        }).showToast();
}

app();