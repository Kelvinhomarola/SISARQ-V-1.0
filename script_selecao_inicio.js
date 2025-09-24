 // Função para habilitar/desabilitar o botão Iniciar
        function habilitarBotao(habilitar) {
            const botao = document.getElementById('start-button');

            if (habilitar) {
                botao.disabled = false; // Habilita o botão
            } else {
                botao.disabled = true;  // Desabilita o botão
                alert("Em desenvolvimento"); // Exibe alerta
            }
        }

        // Função para as instruções
        function mostrarInstrucoes() {
            alert("Instruções: 1. Escolha uma opção. 2. Clique em 'Iniciar' ...");
        }

        // Função para redirecionar para outra página ao clicar em "Iniciar"
        function iniciar() {
            window.location.href = 'index.html'; // Redireciona para outra página
        }