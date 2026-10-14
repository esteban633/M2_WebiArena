import "./style.css";
import { obtenerMarcas, obtenerModelos } from "./api.js";
import { mostrarCargando, mostrarError, pintarMarcas, pintarModelos } from "./render.js";

const contenedorMarcas = document.querySelector("#marcas");
const detalle = document.querySelector("#detalle");
const buscador = document.querySelector("#buscador");

let marcas = [];
let marcaActual = null; //para ignorar respuestas viejas si el usuario pulsa rápido

async function cargarMarcas() {
  mostrarCargando(contenedorMarcas, "⏳ Cargando marcas…");
  try {
    marcas = await obtenerMarcas();
    pintarMarcas(contenedorMarcas, marcas);
  } catch (error) {
    mostrarError(
      contenedorMarcas,
      `No se pudieron cargar las marcas (${error.message}).`,
      cargarMarcas
    );
  }
}

async function cargarModelos(nombreMarca) {
  marcaActual = nombreMarca;
  mostrarCargando(detalle, `⏳ Cargando modelos de ${nombreMarca}…`);
  try {
    const modelos = await obtenerModelos(nombreMarca);
    if (marcaActual !== nombreMarca) return; //el usuario ya eligió otra marca
    pintarModelos(detalle, nombreMarca, modelos);
  } catch (error) {
    if (marcaActual !== nombreMarca) return;
    mostrarError(
      detalle,
      `No se pudieron cargar los modelos (${error.message}).`,
      () => cargarModelos(nombreMarca)
    );
  }
}

//Buscador: filtramos el array en memoria, sin volver a pedir nada a la API
buscador.addEventListener("input", () => {
  const texto = buscador.value.trim().toLowerCase();
  const filtradas = marcas.filter((m) => m.nombre.toLowerCase().includes(texto));
  pintarMarcas(contenedorMarcas, filtradas);
});

//Delegación de eventos: UN listener en el contenedor para todas las tarjetas
contenedorMarcas.addEventListener("click", (event) => {
  const tarjeta = event.target.closest("button[data-marca]");
  if (!tarjeta || !contenedorMarcas.contains(tarjeta)) return;
  cargarModelos(tarjeta.dataset.marca);
});

cargarMarcas();
