// Desabilitando botão de motores caso sem propulsão
document.addEventListener('DOMContentLoaded', function() {
    const simRadioButton = document.getElementById('dados-motor-nota-sim');
    const naoRadioButton = document.getElementById('dados-motor-nota-nao');
    const propulsaoSelect = document.getElementById('propulsao');
    const btnProximo6 = document.getElementById('botaoproximo6');
    
    function atualizarDadosMotorNota() {
        console.log('Função acionada'); // Para verificar se a função é chamada

        if (propulsaoSelect.value === 'sem-propulsão') {
            simRadioButton.checked = false; // Desmarca "Sim"
            naoRadioButton.checked = true;   // Marca "Não"
            simRadioButton.disabled = true;  // Desabilita "Sim"
        } else {
            naoRadioButton.checked = false;   // Desmarca "Não"
            simRadioButton.disabled = false;   // Habilita "Sim"
        }

        // Habilita o botão se uma opção válida for selecionada
        if (propulsaoSelect.value !== '') {
            btnProximo6.disabled = false; // Habilita o botão
        } else {
            btnProximo6.disabled = true; // Desabilita o botão se nenhuma opção for selecionada
        }
    }

    // Adiciona o evento de mudança no select de propulsão e nos radio buttons
    propulsaoSelect.addEventListener('change', atualizarDadosMotorNota);
    
    // Adiciona eventos para os radio buttons para habilitar o botão quando selecionados
    simRadioButton.addEventListener('change', function() {
        btnProximo6.disabled = !simRadioButton.checked; // Habilita o botão se "Sim" for selecionado
    });
    
    naoRadioButton.addEventListener('change', function() {
        btnProximo6.disabled = !naoRadioButton.checked; // Habilita o botão se "Não" for selecionado
    });
});
