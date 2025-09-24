// Aguarda o carregamento completo da página
document.addEventListener("DOMContentLoaded", function () {
    // Adiciona o evento de clique ao botão
    document.getElementById("nova-arqueacao").addEventListener("click", function () {
        // Limpa todos os campos de entrada
        const inputs = document.querySelectorAll("input");
        inputs.forEach(input => {
            input.value = ""; // Limpa os campos de texto
            if (input.type === "checkbox" || input.type === "radio") {
                input.checked = false; // Desmarca checkboxes e radio buttons
            }
        });

        // Limpa todos os campos de seleção
        const selects = document.querySelectorAll("select");
        selects.forEach(select => {
            select.selectedIndex = 0; // Reseta para a primeira opção
        });

        // Recarrega a página sem usar o cache
        location.reload(true);
    });
});
