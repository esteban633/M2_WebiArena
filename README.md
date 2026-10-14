# Cardex

Una "Pokédex" de coches: lista las marcas de coches y, al pulsar una, muestra sus modelos.
Proyecto de la **Unidad 2 (M2 · Async Odyssey)** de Desarrollo Web 1.

Datos: [API vPIC de NHTSA](https://vpic.nhtsa.dot.gov/api/) (pública, sin clave).

## Requisitos cumplidos

- Aplicación creada con **Vite** (JavaScript vanilla).
- Consumo de una API pública real con **fetch + async/await**.
- **Módulos ES** (`import` / `export`) repartidos en varios ficheros.
- **Métodos de array**: `map`, `filter`, `toSorted`, junto con `Set` para quitar duplicados.
- Renderizado en el DOM con estados de **carga**, **error** (con botón "Reintentar") y **vacío**.
- **BONUS**: caché en `localStorage` (24 h) para no repetir peticiones.

## Cómo ejecutarlo

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # versión de producción en /dist
```

## Estructura

```
cardex/
├── index.html        # estructura de la página
├── package.json
├── README.md
└── src/
    ├── main.js       # arranque, eventos y flujo de la aplicación
    ├── api.js        # peticiones con fetch (marcas y modelos)
    ├── cache.js      # caché en localStorage
    ├── render.js     # funciones que pintan en el DOM
    └── style.css     # estilos
```

## Uso de IA

- **Herramienta:** Claude
- **Qué hice con IA:** Su principal aportacion fue generar el esqueleto y la estructura de los ficheroas, asi como el borrador de este readmi para tenerlo bien estructurado y ordenado.
- **Prompts relevantes:**
  1. "Explicame un ejercicio sencillo prar realizar, acorde a los apuntes"
  2. "No quiero que sea de Pokémon, me gusta lo de la Pokédex de coches"
- **Qué escribí a mano:** Toda la explicacion del ejercicio en el readmi, asi como correccion de cosas que no entendía en el codigo

## Autopsia

**1. Caché en `localStorage` con caducidad de 24 h, usando la URL como clave.**
Lo elegí porque sobrevive a recargar la página y las marcas casi nunca cambian.
Alternativa descartada: una caché en memoria con un `Map`, más sencilla pero que se pierde al recargar,
así que no cumpliría bien el objetivo de no repetir peticiones. El inconveniente de mi opción es que
`localStorage` solo guarda texto (hay que usar `JSON.stringify`/`JSON.parse`) y puede fallar o estar
bloqueado, por eso va dentro de `try/catch`.

**2. Delegación de eventos: un único listener en el contenedor de tarjetas.**
Las tarjetas se vuelven a crear cada vez que se escribe en el buscador, y con un solo listener
(`event.target.closest(...)`) no hay que volver a registrar nada. Alternativa descartada: un
`addEventListener` en cada tarjeta, que son ~195 listeners que habría que recrear tras cada filtrado.
