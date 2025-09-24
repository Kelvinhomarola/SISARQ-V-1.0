const inputField = document.getElementById('boca-moldada');

    // Bloqueia letras e caracteres indesejados durante a digita��o
    inputField.addEventListener('keypress', function (e) {
        const char = String.fromCharCode(e.keyCode);

        // Permite apenas n�meros e uma v�rgula
        if (!/[0-9,]/.test(char)) {
            e.preventDefault();
        }

        // Impede mais de uma v�rgula
        if (char === ',' && this.value.includes(',')) {
            e.preventDefault();
        }
    });

    // Valida o valor final ap�s a entrada
    inputField.addEventListener('input', function () {
        // Converte a v�rgula para ponto temporariamente para fins de valida��o
        const numericValue = parseFloat(this.value.replace(',', '.'));

        // Limita o valor ao intervalo de 1 a 500
        if (numericValue < 1 || numericValue > 500) {
            this.value = ''; // Limpa o campo se o valor estiver fora do intervalo
        }
    });