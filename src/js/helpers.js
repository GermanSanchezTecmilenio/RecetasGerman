import { TIMEOUT_SEC } from './config.js';

const timeout = s =>
  new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Request took too long! (${s}s)`)), s * 1000);
  });

export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    // Repropaga para que el controlador/vistas muestren el error en UI
    throw err;
  }
};

