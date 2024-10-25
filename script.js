// Modo oscuro
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
// Función para cambiar DNS (Instrucción al usuario)
function changeDNS(dns) {
    let dnsInfo = {
        adguard: "AdGuard DNS: 176.103.130.130",
        google: "Google DNS: 8.8.8.8",
        cloudflare: "Cloudflare DNS: 1.1.1.1"
    };
    alert(`To change DNS, please configure it manually in your device settings.\n\nSelected: ${dnsInfo[dns] || "Default"}`);
}
