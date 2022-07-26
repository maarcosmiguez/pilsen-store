class Ampliacion extends HTMLElement {
  connectedCallback() {
    console.log("Se llama a mi primer compoente");

    this.innerHTML = document.getElementById("primer-componente.html").innerHTML;
    inicializarApp();
  }
}

customElements.define("primer-componente", Ampliacion);

// CERVEZA
customElements.define(
  "page-cerveza",
  class extends HTMLElement {
    connectedCallback() {
      console.log("Se mostró el listado de cerveza");
      this.innerHTML = document.getElementById("page-cerveza.html").innerHTML;
      cargarCerveza();
    }
  }
);

// COMPRAS
customElements.define(
  "page-compras",
  class extends HTMLElement {
    connectedCallback() {
      console.log("Bienvenido al carrito");
      this.innerHTML = document.getElementById("page-compras.html").innerHTML;
      escribirListadoItems()
    }
  }
);

// FERNET
customElements.define(
  "page-fernet",
  class extends HTMLElement {
    connectedCallback() {
      console.log("Se mostró el listado de fernet");
      this.innerHTML = document.getElementById("page-fernet.html").innerHTML;
      cargarFernet();
    }
  }
);

// INICIO
customElements.define(
  "page-inicio",
  class extends HTMLElement {
    connectedCallback() {
      console.log("Se ha iniciado correctamente la app.");
      this.innerHTML = document.getElementById("page-inicio.html").innerHTML;
      cargarInicio();
      cargarProductos();
    }
  }
);
