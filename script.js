
const toggleButton = document.getElementById('dark-mode-toggle');
const body = document.body;

toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
});
// Neutraliza scripts que verifican la carga de anuncios
window.addEventListener('DOMContentLoaded', (event) => {
    // Sobrescribe ciertos métodos que usan los sitios para detectar adblock
    const noop = () => {};
    const overwriteDetectionMethods = () => {
        // Métodos que frecuentemente se sobrescriben para evitar detección
        window.AdBlockDetected = noop;
        document.AdBlockDetected = noop;
        window.BlockedAds = false;
    };
    
    // Intento inicial para sobrescribir métodos
    overwriteDetectionMethods();

    // Vuelve a intentar después de un tiempo para scripts cargados dinámicamente
    setTimeout(overwriteDetectionMethods, 2000);
});
