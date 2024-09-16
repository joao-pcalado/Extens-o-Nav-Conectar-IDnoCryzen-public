// Aguarda o carregamento completo da página
window.onload = function() {
    console.log('Página carregada! Pronto para iniciar a automação.');
    // Enviar mensagem de sucesso para o Service Worker
    chrome.runtime.sendMessage({ action: 'injectionSuccess' });
};

// Receber mensagem do service worker para iniciar a automação
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startAutomation") {
        console.log("Mensagem de automação recebida:", message.capturedMessage);
        automateClicks(message.capturedMessage);
    }
});

// Função de automação com atrasos
function automateClicks(capturedMessage) {
    const firstElement = document.querySelector('#app > div.app-content > div.lobby-wrapper > div.play > div.play-btn-cont > div > div.join-wrapper > div.join-by-id');
    if (firstElement) {
        setTimeout(() => {
            firstElement.click();
            console.log("Clique no primeiro elemento realizado!");

            const inputElement = document.querySelector('#modal-target > div > div > div > div > div.btns > div.input-wrapper.input > input');
            if (inputElement) {
                setTimeout(() => {
                    // Inserir o valor no campo de input
                    inputElement.value = capturedMessage;

                    // Disparar eventos para garantir que o valor seja reconhecido
                    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                    inputElement.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log("Mensagem capturada inserida!");

                    const secondElement = document.querySelector('#modal-target > div > div > div > div > div.btns > div.base-button.text-shadow-1.green.join');
                    if (secondElement) {
                        setTimeout(() => {
                            secondElement.click();
                            console.log("Clique no segundo elemento realizado!");
                        }, 1000); // Atraso de 1 segundo antes do segundo clique
                    } else {
                        console.log("Segundo elemento não encontrado.");
                    }
                }, 1000); // Atraso de 1 segundo antes de inserir a mensagem
            } else {
                console.log("Elemento de input não encontrado.");
            }
        }, 1000); // Atraso de 1 segundo antes do primeiro clique
    } else {
        console.log("Primeiro elemento não encontrado.");
    }
}
