let previousCapturedMessage = '';
let previousMessage = null;

self.addEventListener('install', event => {
    console.log('Service Worker instalado');
});

self.addEventListener('activate', event => {
    console.log('Service Worker ativado');

    function checkTab() {
        chrome.tabs.query({}, function(tabs) {
            let tabOpen = false;
            let tabId;
            for (let tab of tabs) {
                if (tab.url === "https://cryzen.io/play") {
                    tabOpen = true;
                    tabId = tab.id;
                    break;
                }
            }
            if (tabOpen) {
                console.log("A aba 'https://cryzen.io/play' está aberta.");

                // Fetch para obter a mensagem capturada
                fetch('http://localhost:3000/capturedMessage')
                    .then(response => response.json())
                    .then(data => {
                        if (data.capturedMessage && data.capturedMessage !== previousMessage) {
                            console.log('Nova mensagem capturada:', data.capturedMessage);
                            previousMessage = data.capturedMessage;
                        } else if (data.capturedMessage && data.capturedMessage === previousMessage) {
                            // Verificar se a URL é https://cryzen.io/play
                            clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
                                clients.forEach(client => {
                                    if (client.url === 'https://cryzen.io/play' && !client.focused) {
                                        client.focus();
                                        // Chamar a função de automação
                                        automateClicks(data.capturedMessage);
                                    }
                                });
                            });
                        } else if (!data.capturedMessage) {
                            console.warn('Nenhuma mensagem capturada encontrada.');
                        }

                        // Atualizar a mensagem capturada
                        let capturedMessage = data.capturedMessage; // Atualize esta linha conforme necessário
                        
                        // Exibir a mensagem capturada no console
                        console.log("Mensagem capturada:", capturedMessage);

                        if (capturedMessage !== previousCapturedMessage) {
                            previousCapturedMessage = capturedMessage;
                            chrome.scripting.executeScript({
                                target: { tabId: tabId },
                                files: ['content-script.js']
                            }, () => {
                                console.log('Content script injetado!');
                                chrome.tabs.sendMessage(tabId, { action: 'startAutomation', capturedMessage: capturedMessage });
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao buscar a mensagem capturada:', error);
                    });
            }
        });
    }

    setInterval(checkTab, 30000); // Verifica a cada 30 segundos (melhor pra leitura)
});

// Listener para mensagens do content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'injectionSuccess') {
        console.log('Injeção do content script foi um sucesso!');
    }
});