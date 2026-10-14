// localStorage solo guarda texto, así que serializo con JSON
const PREFIJO = "cardex:";
const DURACION = 24 * 60 * 60 * 1000; //24 horas en milisegundos

export function getCache(clave) {
  try {
    const texto = localStorage.getItem(PREFIJO + clave);
    if (!texto) return null;

    const { guardado, datos } = JSON.parse(texto);
    if (Date.now() - guardado > DURACION) {
      localStorage.removeItem(PREFIJO + clave); //caducada
      return null;
    }
    return datos;
  } catch {
    //JSON corrupto o localStorage no disponible, actua como si hubiera cache
    return null;
  }
}

export function setCache(clave, datos) {
  try {
    localStorage.setItem(PREFIJO + clave, JSON.stringify({ guardado: Date.now(), datos }));
  } catch {
    //Si no cabe o esta bloqueado, no pasa nada: simplemente no se cachea
  }
}
