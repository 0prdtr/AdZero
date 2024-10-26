// Código existente
document.getElementById('dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Cargar URL en iframe
document.getElementById('load-url-button').addEventListener('click', () => {
    const url = document.getElementById('url-input').value;
    if (url) {
        document.getElementById('web-frame').src = url;
    }
});

// Función para activar pantalla completa en el iframe
function goFullscreen() {
    const iframe = document.getElementById('web-frame');
    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.mozRequestFullScreen) { // Firefox
        iframe.mozRequestFullScreen();
    } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari y Opera
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) { // Edge e Internet Explorer
        iframe.msRequestFullscreen();
    }
}

// Bloqueador avanzado de anuncios
function advancedAdBlock() {
    // Array de selectores CSS comúnmente utilizados por anuncios y pop-ups avanzados
    const adSelectors = [
        '.ad', 
        '.advertisement', 
        '[id*="ad"]', 
        '[class*="ad"]', 
        '[class*="banner"]', 
        '[id*="popup"]',
        '.modal',
        '[class*="popup"]',
        '[id*="modal"]',
        '[class*="sponsored"]',
        '[class*="promo"]',
        '.ad-content'
    ];

    // Eliminar elementos seleccionados del DOM
    adSelectors.forEach(selector => {
        const ads = document.querySelectorAll(selector);
        ads.forEach(ad => ad.remove());
    });

    // Observador de mutación para eliminar elementos nuevos que aparezcan después de cargar la página
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Verifica si es un elemento
                    adSelectors.forEach(selector => {
                        if (node.matches(selector) || node.querySelector(selector)) {
                            node.remove();
                        }
                    });
                }
            });
        });
    });

    // Configurar el observador de mutación
    observer.observe(document.body, { childList: true, subtree: true });
}

// Ejecutar bloqueador avanzado de anuncios
document.getElementById('web-frame').addEventListener('load', () => {
    const iframe = document.getElementById('web-frame');
    iframe.contentWindow.eval(`(${advancedAdBlock.toString()})()`);
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

// Este script se inyecta en la página cargada para evitar técnicas anti-bloqueo de anuncios
(function() {
    // Sobrescribe la función `adblockDetected` utilizada por algunos sitios para detectar AdBlock
    window.adblockDetected = function() {
        console.log("Bypassing adblock detection...");
        // O realiza alguna otra acción para anular la detección
    };

    // Eliminar mensajes de anti-bloqueo conocidos
    const antiAdBlockSelectors = [
        '#adblock-popup', '.adblock-modal', '[id*="anti-ad"]'
    ];
    antiAdBlockSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.remove());
    });

    // Observador de mutación para detectar nuevos elementos de detección de bloqueadores de anuncios
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    antiAdBlockSelectors.forEach(selector => {
                        if (node.matches(selector) || node.querySelector(selector)) {
                            node.remove();
                        }
                    });
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();

// Función para aplicar filtros basados en listas de bloqueo
function applyBlockList() {
    const blockList = [
        "*://*.doubleclick.net/*",
        "*://*.ads.example.com/*",
        "*://*.tracking.example.net/*",
    ];

    // Bloquear URLs específicas basadas en la lista
    blockList.forEach(pattern => {
        const regex = new RegExp(pattern.replace(/\*/g, ".*").replace(/\./g, "\\."));
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            if (regex.test(arguments[1])) {
                console.warn("Blocked request to:", arguments[1]);
                return;
            }
            originalOpen.apply(this, arguments);
        };
    });
}

applyBlockList();

// Sobrescribir métodos de detección de adblock conocidos
(function() {
    // Sobrescribir la función global de detección de AdBlock si existe
    if (window.adblockDetected) {
        window.adblockDetected = function() {
            console.log("Adblock detection function overridden.");
        };
    }

    // Observador de mutación para ocultar mensajes de anti-bloqueo
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Si el nodo es un elemento
                    if (node.classList && (node.classList.contains('adblock-message') || node.classList.contains('adblock-warning'))) {
                        node.remove(); // Eliminar nodo si coincide con clases conocidas
                    }
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();

// Función para descargar y aplicar listas de bloqueo desde un servidor remoto
async function updateBlockList() {
    try {
        const response = await fetch('https://example.com/blocklist.txt');
        const blockListText = await response.text();
        
        // Procesar y aplicar las reglas de bloqueo (similar a applyBlockList)
        const blockList = blockListText.split('\n').filter(line => line && !line.startsWith('!'));
        applyBlockListFromServer(blockList);
    } catch (error) {
        console.error("Failed to update block list:", error);
    }
}

function applyBlockListFromServer(blockList) {
    blockList.forEach(pattern => {
        const regex = new RegExp(pattern.replace(/\*/g, ".*").replace(/\./g, "\\."));
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            if (regex.test(arguments[1])) {
                console.warn("Blocked request to:", arguments[1]);
                return;
            }
            originalOpen.apply(this, arguments);
        };
    });
}

updateBlockList();
