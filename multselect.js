//Multiselect para atividade ou serviço (Escolher duas opções simultaneas)
document.addEventListener('DOMContentLoaded', function () {
        const multiselectInput = document.getElementById('atividade-servico');
        const multiselectDropdown = document.getElementById('atividade-servico-dropdown');
        const checkboxes = multiselectDropdown.querySelectorAll('input[type="checkbox"]');

        // Mostrar/esconder dropdown ao clicar no input
        multiselectInput.addEventListener('click', function () {
            multiselectDropdown.classList.toggle('show');
        });

        // Atualizar o input com as opções selecionadas e limitar a 2 seleções
        checkboxes.forEach(function (checkbox) {
            checkbox.addEventListener('change', function () {
                const selectedOptions = [];
                let selectedCount = 0;

                checkboxes.forEach(function (item) {
                    if (item.checked) {
                        selectedCount++;
                        selectedOptions.push(item.parentElement.textContent.trim());
                    }
                });

                if (selectedOptions.length > 0) {
                    multiselectInput.textContent = selectedOptions.join(', ');
                } else {
                    multiselectInput.textContent = 'Selecione uma ou mais opções';
                }

                // Limitar a 2 opções
                if (selectedCount >= 2) {
                    checkboxes.forEach(function (item) {
                        if (!item.checked) {
                            item.disabled = true; // Desabilitar os outros
                        }
                    });
                } else {
                    checkboxes.forEach(function (item) {
                        item.disabled = false; // Habilitar novamente se menos de 2 selecionadas
                    });
                }
            });
        });

        // Fechar o dropdown se clicar fora
        document.addEventListener('click', function (e) {
            if (!multiselectInput.contains(e.target) && !multiselectDropdown.contains(e.target)) {
                multiselectDropdown.classList.remove('show');
            }
        });
    });