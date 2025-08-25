/**
 * Fetches data from the specified Google Sheet API URL.
 * @param {string} url The URL of the Google Apps Script web app.
 * @returns {Promise<Array>} A promise that resolves with the data array.
 * @throws {Error} Throws an error if the fetch fails or the API returns an error.
 */
export async function fetchData(url) {
    if (!url || url === 'URL_DE_TU_API_AQUÍ') {
        throw new Error('Por favor, introduce la URL de tu API de Google Sheets en js/config.js.');
    }

    const response = await fetch(url);
    const result = await response.json();

    if (!result.success) {
        throw new Error(result.message || 'Error al obtener los datos de la hoja de cálculo.');
    }

    return result.data;
}
