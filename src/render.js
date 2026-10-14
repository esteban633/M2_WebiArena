// Funciones que pintan en el DOM. Usamos textContent (nunca innerHTML)
// para que ningún dato de la API pueda inyectar HTML (XSS).

function vaciar(contenedor) {
  contenedor.replaceChildren();
}

function crearParrafo(texto, clase) {
  const p = document.createElement("p");
  p.textContent = texto;
  if (clase) p.className = clase;
  return p;
}

// --- Estados: cargando, error, vacío ---

export function mostrarCargando(contenedor, texto = "⏳ Cargando…") {
  vaciar(contenedor);
  contenedor.append(crearParrafo(texto, "estado"));
}

export function mostrarError(contenedor, mensaje, onReintentar) {
  vaciar(contenedor);
  contenedor.append(crearParrafo(`⚠ ${mensaje}`, "estado error"));

  const boton = document.createElement("button");
  boton.textContent = "Reintentar";
  boton.addEventListener("click", onReintentar);
  contenedor.append(boton);
}

// --- Datos ---

export function pintarMarcas(contenedor, marcas) {
  vaciar(contenedor);

  if (marcas.length === 0) {
    contenedor.append(crearParrafo("No hay marcas que coincidan.", "estado"));
    return;
  }

  const lista = document.createElement("div");
  lista.className = "rejilla";

  for (const marca of marcas) {
    const tarjeta = document.createElement("button");
    tarjeta.className = "tarjeta";
    tarjeta.dataset.marca = marca.nombre; // lo leerá la delegación de eventos

    const numero = document.createElement("span");
    numero.className = "numero";
    numero.textContent = `#${marca.id}`;

    const nombre = document.createElement("strong");
    nombre.textContent = marca.nombre;

    tarjeta.append(numero, nombre);
    lista.append(tarjeta);
  }

  contenedor.append(lista);
}

export function pintarModelos(contenedor, marca, modelos) {
  vaciar(contenedor);

  const titulo = document.createElement("h2");
  titulo.textContent = marca;
  contenedor.append(titulo);

  if (modelos.length === 0) {
    contenedor.append(crearParrafo("Esta marca no tiene modelos registrados.", "estado"));
    return;
  }

  contenedor.append(crearParrafo(`${modelos.length} modelos`, "contador"));

  const ul = document.createElement("ul");
  for (const modelo of modelos) {
    const li = document.createElement("li");
    li.textContent = modelo;
    ul.append(li);
  }
  contenedor.append(ul);
}
