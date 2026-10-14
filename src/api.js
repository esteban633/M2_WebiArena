import { getCache, setCache } from "./cache.js";

const BASE = "https://vpic.nhtsa.dot.gov/api/vehicles";

//Pide una URL y devuelve el JSON. Primero mira la cache
async function pedirJSON(url) {
  const cacheado = getCache(url);
  if (cacheado) return cacheado;

  const respuesta = await fetch(url);

  //fetch no rechaza con errores HTTP, hay que comprobarlo
  if (!respuesta.ok) {
    throw new Error(`HTTP ${respuesta.status}: ${respuesta.statusText}`);
  }

  const datos = await respuesta.json();
  setCache(url, datos);
  return datos;
}

//Devuelve  id, nombre  ordenado alfabéticamente
export async function obtenerMarcas() {
  const datos = await pedirJSON(`${BASE}/GetMakesForVehicleType/car?format=json`);

  return datos.Results
    .map((m) => ({ id: m.MakeId, nombre: m.MakeName }))
    .toSorted((a, b) => a.nombre.localeCompare(b.nombre));
}

//Devuelve un array de nombres de modelo, sin repetidos y ordenados
export async function obtenerModelos(marca) {
  const datos = await pedirJSON(
    `${BASE}/GetModelsForMake/${encodeURIComponent(marca)}?format=json`
  );

  const nombres = datos.Results.map((m) => m.Model_Name);
  return [...new Set(nombres)].toSorted((a, b) => a.localeCompare(b));
}
