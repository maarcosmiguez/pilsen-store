inicializarApp();

function inicializarApp() {
inicializarState();
}

function inicializarState() {
  const listadoProductos = obtenerListado();
  state.listado = listadoProductos;
}

// INICIO
function cargarInicio(){
  resetFiltrado();
  resetRelatedSearch();
}

const API_URL = "https://api.mercadolibre.com/sites/MLU/";
const API_SEARCH = "search?q=";
const API_STORE = "official_store_id=533";
const API_RELATED = "https://api.mercadolibre.com/sites/MLU/related_searches";
const API_ITEM = "https://api.mercadolibre.com/items/";
const API_QUESTIONS = "https://api.mercadolibre.com/questions/";
const API_REVIEW = "https://api.mercadolibre.com/reviews/item/"
const $nav = document.querySelector("ion-nav");
const $menu = document.querySelector("ion-menu");

function guardarStorage(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

  function obtenerStorage(clave, valorPorDefecto) {
const local = JSON.parse(localStorage.getItem(clave));
return local || valorPorDefecto;
}

function guardarListado() {
  guardarStorage("listadoProductos", state.listado);
}

function obtenerListado() {
return obtenerStorage("listadoProductos", []);
}
  
  async function payAlert() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Ingrese los datos de su tarjeta';
    alert.buttons = ['OK'];
    alert.inputs = [
      {
        placeholder: 'Nombre completo'
      },
      {
        type: 'number',
        placeholder: 'Numero de tarjeta',
        min: 10,
        max: 12
      },
      {
        type: 'number',
        placeholder: '3 digitos de seguridad'
      }
    ];

    document.body.appendChild(alert);
    await alert.present();
  }


function escribirListadoItems() {
   for (let item of state.listado)
    {document.querySelector("#carrito").innerHTML ="";
     fetchHtmlItem(item);
   }}

 function fetchHtmlItem(itemId){
  fetch(`${API_ITEM}${itemId}`)
  .then((res) => res.json())
  .then((item) => {
    generarHtmlItem(item);
  })
  .catch(console.error)
 }

 function generarHtmlItem(item) {
  let itemHtml = "";
  itemHtml = /*html*/ `
  <ion-item data-id="${item.id}" button>
  <ion-thumbnail slot="start">
    <img style="object-fit: contain" src="${item.pictures[0].url}" />
  </ion-thumbnail>
  <ion-label>
    <h3>${item.title}</h3>
    <p>$${item.price}</p>
  </ion-label>
  <ion-button slot="end" class="eliminar" color="danger">Eliminar</ion-button>
</ion-item>
    `;
    document.querySelector("#carrito").innerHTML += itemHtml;
    agregarEventosItems();

}

function agregarEventosItems(){
  const itemEliminar = document.querySelectorAll(".eliminar");
  for (let e of itemEliminar)
    {e.addEventListener("click", borrarItem)}
}

 function borrarItem(ev) {
   ev.stopPropagation();
   console.log("borrar item");
   const $item = ev.target.closest("ion-item");
   const id = $item.getAttribute("data-id");

   borrarItemListado(id);
   $item.remove();
   guardarListado();

   document.querySelector("#carrito").innerHTML = "";
 escribirListadoItems();
 }

function borrarItemListado(id) {
state.listado = state.listado.filter((item) => item !== id);
}


function guardarItem(){
  const itemGuardar = document.querySelectorAll(".guardar");
  for (let e of itemGuardar)
    {
    e.addEventListener("click", guardarId);
  }
}

function guardarId (){
  let idGuardar = this.getAttribute("data-idProducto");
  state.listado.push(idGuardar);
  guardarLocal(idGuardar);
}

function guardarLocal(idGuardar){
  console.log("guarde en listado" + idGuardar);
  guardarListado();
}


function ampliarItem(){
  const itemAmpliar = document.querySelectorAll(".ampliar");
  for (let e of itemAmpliar)
    {
    e.addEventListener("click", ampliarId);
  }
}

function ampliarId (){
  let idAmpliar = this.getAttribute("data-idProducto");
  state.listado.push(idAmpliar);
  ampliacion(idAmpliar);
  reviewFetch(idAmpliar);
}

function ampliacion(idAmpliar){
  fetch(`${API_ITEM}${idAmpliar}`)
  .then((res) => res.json())
  .then((item) => {
    resultadoAmpliacion(item);
  })
  .catch(console.error)
}


function resultadoAmpliacion(item){
  const modalAmpliacion = document.querySelector("#modalAmpliacion");
  modalAmpliacion.innerHTML =
  `

  <ion-content> 
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button onclick="modal.isOpen = false">Volver</ion-button>
      </ion-buttons>
      <ion-title>${item.title}</ion-title>
      <ion-buttons slot="end">
      
        <ion-button onclick="modal.isOpen = false" class="guardar" color="success" strong="true">Agregar</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding bg-ampliacion">
  <ion-card class="ampliacion">
  <figure style="width:55%">
  <img src="${item.pictures[0].url}"/>
  </figure>
         <ion-card-header>
           <ion-card-subtitle style="font-size:1.5rem" color="primary">$${item.price}</ion-card-subtitle>
           <ion-card-title style="font-size: 1.8rem" color="dark">${item.title}</ion-card-title>
         </ion-card-header>
         <div class="ion-padding">
         <ion-chip color="success">
         <ion-icon name="cart"></ion-icon>
         <ion-label class="guardar" onclick="modal.isOpen = false" data-idProducto="${item.id}">Agregar</ion-label>
         </ion-chip>
         <div id="review" style="display:inline-block"></div>
         </div>
       </ion-card>

  </ion-content>

  `
  guardarItem();
}

function reviewFetch(idAmpliar){
  fetch(`${API_REVIEW}${idAmpliar}`)
  .then((res) => res.json())
  .then((item) => {
    resultadoReview(item);
  })
  .catch(console.error)
}

function resultadoReview(review){
  console.log(review);
  let $divReview = document.querySelector("#review");
  if (review.reviews.length === 0){
    $divReview.innerHTML = 
    `
    <ion-chip color="secondary">
    <ion-icon name="close-circle-outline"></ion-icon>
        <ion-label>Sin calificaciones</ion-label>
    </ion-chip>
    `
  }
  else {
    $divReview.innerHTML = 
    `
    <ion-chip color="secondary">
    <ion-icon name="star"></ion-icon>
    <ion-label>${review.rating_average}/5</ion-label>
    </ion-chip>
    `
  }
}

function resetRelatedSearch(){
  let sectionRelated = document.querySelector(".related");
  sectionRelated.classList.add("hide");
  let $divRelated = document.querySelector("page-inicio #related");
  $divRelated.innerHTML = "";
}

function resetFiltrado(){
  let $filtrado = document.querySelector("page-inicio #listado-filtrado");
  $filtrado.innerHTML = "";
}

function mostrarSectionRelated(){
  let $sectionRelated = document.querySelector(".related");
  $sectionRelated.classList.remove("hide");
}

function mostrarRecomendados(){
  let $recomendados = document.querySelector("#listado-recomendaciones");
  $recomendados.classList.remove("hide");
}

function ocultarRecomendados(){
  let $recomendados = document.querySelector("#listado-recomendaciones");
  $recomendados.classList.add("hide");
}

// EVENTS
function searchBar() {
  const $searchMain = document.querySelector("page-inicio #search-bar-main");
  // const ctabuscar = document.querySelector("page-inicio #cta-buscar");
  // ctabuscar.addEventListener("click", escribirBusqueda)
  $searchMain.addEventListener("keyup", escribirBusqueda);
}

function escribirBusqueda() {
  const $searchMain = document.querySelector("page-inicio #search-bar-main");
  const buscado = $searchMain.value;
  if (buscado === "") {
    let $filtrado = document.querySelector("page-inicio #listado-filtrado");
    $filtrado.innerHTML = "";
    mostrarRecomendados();
    resetFiltrado();
    resetRelatedSearch();
  } else {
    fetch(`${API_URL}${API_SEARCH}${buscado}&${API_STORE}`)
      .then((res) => res.json())
      .then((apiRes) => {
        console.log(apiRes.results);
        mostrarProductoFiltrado(apiRes.results, buscado);
      })
      // .then(relatedSearch)
      .catch(console.error)
  }
}

function mostrarProductoFiltrado(producto, buscado) {
  if ((producto == "")) {
    relatedSearch(buscado);
    mostrarRecomendados();
  }
  else {
  resetFiltrado();
  ocultarRecomendados();
  resetRelatedSearch();
  productoS = producto.slice(1,15);
  for (let product of productoS) {
    let html = "";
    html = /*html*/ `
      <ion-item>
      <ion-thumbnail slot="start">
        <img style="object-fit: contain" src="${product.thumbnail}"/>
      </ion-thumbnail>
      <ion-label>
        <h3>${product.title}</h3>
        <p>$${product.price}</p>
      </ion-label>

      
      
      <ion-button color="secondary" onclick="modal.isOpen = true" class="ampliar" data-idProducto="${product.id}">Abrir</ion-button>
      
      <ion-chip color="success">
      <ion-icon name="cart"></ion-icon>
      <ion-label class="guardar" data-idProducto="${product.id}">Agregar</ion-label>
      </ion-chip>
    </ion-item>`;
    let $filtrado = document.querySelector("page-inicio #listado-filtrado");
    $filtrado.innerHTML += html;

  }

guardarItem();
ampliarItem();
  
}
}

function relatedSearch(buscado) {
  console.log(buscado);
  fetch(`${API_RELATED}?q=${buscado}&${API_STORE}`)
    .then((res) => res.json())
    .then((apiRes) => {
      mostrarRelatedSearch(apiRes.related_searches);
    })
    .catch(console.error)
}

function mostrarRelatedSearch(related) {
  resetFiltrado();
  mostrarSectionRelated();
  let $divRelated = document.querySelector("page-inicio #related");
  $divRelated.innerHTML = "";
  for (let rel of related) {
  let html = "";
  html =
/*html*/
   ` <ion-chip outline color="secondary">
   <ion-label class="otraTienda" onclick="presentAlert()" data-idRel="${rel}">${rel} </ion-label>
   </ion-chip>
  `;
 $divRelated.innerHTML += html;
 
  }

  let nuevaBusqueda = document.querySelectorAll(".otraTienda");
  nuevaBusqueda.forEach((element) => {
  element.addEventListener("click", otrasTiendas);
  });
}

function otrasTiendas(){
  let nuevoQ = this.getAttribute("data-idRel");
  console.log(nuevoQ);
  dataOtraTienda(nuevoQ);
}

async function presentAlert() {
  const alert = document.createElement('ion-alert');
  alert.header = 'Atención';
  alert.subHeader = 'Estás productos no son parte de la tienda oficial de Pilsen.';
  alert.message = 'Se podrán aplicar recargos.';
  alert.buttons = ['OK'];

  document.body.appendChild(alert);
  await alert.present();
}

function dataOtraTienda(nuevoQ){
  fetch(`${API_URL}${API_SEARCH}${nuevoQ}`)
  .then((res) => res.json())
  .then((apiRes) => {
    resultsOtrasTiendas(apiRes.results);
    console.log(apiRes.results)
  })
  .catch(console.error)
}

function resultsOtrasTiendas(x){
  resetFiltrado();
  resetRelatedSearch();
  resultado = x.slice(1, 15);
  for (let result of resultado) {
    let html = "";
    html = /*html*/ `
      <ion-item>
      <ion-thumbnail slot="start">
        <img style="object-fit: contain" src="${result.thumbnail}" />
      </ion-thumbnail>
      <ion-label>
        <h3>${result.title}</h3>
        <p>$${result.price}</p>
      </ion-label>

      
      <ion-button color="secondary" onclick="modal.isOpen = true" class="ampliar" data-idProducto="${result.id}">Abrir</ion-button>
      
      <ion-chip color="success">
      <ion-icon name="cart"></ion-icon>
      <ion-label class="guardar" data-idProducto="${result.id}">Agregar</ion-label>
      </ion-chip>

    </ion-item>`;
    let $filtrado = document.querySelector("page-inicio #listado-filtrado");
    $filtrado.innerHTML += html;
  }
  guardarItem();
  ampliarItem();
}

function navegar(page) {
  $nav.push(page);
  $menu.close();
}

function nuevaNavegacion(page) {
  $nav.setRoot(page);
}

function navegarMenu(page) {
  nuevaNavegacion(page);
  cerrarMenu();
}

function cerrarMenu() {
  $menu.close();
}

function cargarProductos() {
  fetch(`${API_URL}search?${API_STORE}`)
    .then((res) => res.json())
    .then((apiRes) => {
      mostrarProducto(apiRes.results);
    })
    .then(searchBar)
    .catch(console.error)
}

function mostrarProducto(productos) {
  producto = productos.slice(1, 20);
  for (let product of producto) {
    let html = "";
    html = /*html*/ `
      <ion-item>
      <ion-thumbnail slot="start">
        <img style="object-fit: contain" src="${product.thumbnail}" />
      </ion-thumbnail>
      <ion-label>
        <h3>${product.title}</h3>
        <p>$${product.price}</p>
      </ion-label>

      
      <ion-button color="secondary" onclick="modal.isOpen = true" class="ampliar" data-idProducto="${product.id}">Abrir</ion-button>
      
      <ion-chip color="success">
      <ion-icon name="cart"></ion-icon>
      <ion-label class="guardar" data-idProducto="${product.id}">Agregar</ion-label>
      </ion-chip>

    </ion-item>
    `;
    document.querySelector("page-inicio #listado-recomendaciones").innerHTML += html;
  }
  guardarItem();
  ampliarItem();
}

function cargarCerveza() {
  fetch(`${API_URL}${API_SEARCH}cerveza&${API_STORE}`)
    .then((res) => res.json())
    .then((apiRes) => {
      mostrarCerveza(apiRes.results);
    })
    .catch(console.error)
}

function mostrarCerveza(productos) {
  producto = productos.slice(1, 15);
  for (let product of producto) {
    let html = "";
    html = /*html*/ `
      <ion-item>
      <ion-thumbnail slot="start">
        <img style="object-fit: contain" src="${product.thumbnail}" />
      </ion-thumbnail>
      <ion-label>
        <h3>${product.title}</h3>
        <p>$${product.price}</p>
      </ion-label>

      
      <ion-button color="secondary" onclick="modal.isOpen = true" class="ampliar" data-idProducto="${product.id}">Abrir</ion-button>
      
      <ion-chip color="success">
      <ion-icon name="cart"></ion-icon>
      <ion-label class="guardar" data-idProducto="${product.id}">Agregar</ion-label>
      </ion-chip>

    </ion-item>`;
    document.querySelector("#listado-recomendaciones-cerveza").innerHTML += html;
  }
  guardarItem();
  ampliarItem();
}

function cargarFernet() {
  fetch(`${API_URL}${API_SEARCH}fernet&${API_STORE}`)
    .then((res) => res.json())
    .then((apiRes) => {
      mostrarFernet(apiRes.results);
    })
    .catch(console.error)
}

function mostrarFernet(productos) {
  producto = productos.slice(1, 15);
  for (let product of producto) {
    let html = "";
    html = /*html*/ `
      <ion-item>
      <ion-thumbnail slot="start">
        <img style="object-fit: contain" src="${product.thumbnail}" />
      </ion-thumbnail>
      <ion-label>
        <h3>${product.title}</h3>
        <p>$${product.price}</p>
      </ion-label>

      
      <ion-button color="secondary" onclick="modal.isOpen = true" class="ampliar" data-idProducto="${product.id}">Abrir</ion-button>
      
      <ion-chip color="success">
      <ion-icon name="cart"></ion-icon>
      <ion-label class="guardar" data-idProducto="${product.id}">Agregar</ion-label>
      </ion-chip>

    </ion-item>`;
    document.querySelector("#listado-recomendaciones-fernet").innerHTML += html;
  }

  guardarItem();
  ampliarItem();
}

