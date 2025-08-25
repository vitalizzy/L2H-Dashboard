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

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        // Check if the result has a success property (old format)
        if (result && typeof result.success !== 'undefined') {
            if (!result.success) {
                throw new Error(result.message || 'Error al obtener los datos de la hoja de cálculo.');
            }
            return result.data;
        }

        // If no success property, assume the result is the data directly
        if (Array.isArray(result)) {
            return result;
        }

        // If it's an object with data property
        if (result && result.data && Array.isArray(result.data)) {
            return result.data;
        }

        throw new Error('Formato de respuesta inesperado del servidor.');
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error(`Error al conectar con Google Sheets: ${error.message}`);
    }
}
