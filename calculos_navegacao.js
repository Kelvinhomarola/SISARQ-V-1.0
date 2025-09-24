// ==========================
// VARIÁVEIS GLOBAIS
// ==========================
let materialCasco = '';
let contorno = 0;
let bocaMoldada = 0;
let pontalMoldado = 0;
let comprimentoArqueacao = 0;
let pontal = 0;
let F = 0;
let M = 0;
let coeficienteConvencional = 0;
let volumeConvencional = 0;
let comprimentoRegra = 0;
let caladoLeve = 0;
let caladoCarregado = 0;
let densidadeAgua = 0;
let deslocamentoCarregado = 0;
let deslocamentoLeve = 0;
let porteBruto = 0;
let deslocamentoLeveVal = 0;
let deslocamentoCarregadoVal = 0;
let caladoLeveInput;
let caladoCarregadoInput;
let caladoLeveCalculado;
let caladoCarregadoCalculado;
let row = 0;
let comprimento = 0; 
let largura = 0;
let altura = 0;
let volumeCasco = 0;
let volumeAcimaConv = 0;
let volumeV = 0;
let volumeEstimado = 0;
let volumeInformado = 0;
let volumeFinal = 0;
let volumesFinais = 0;
let soma = 0;
let tabela = 0;
let volumeInformadoInputs = 0;
let numLinhas = 0;
let numLinhasMotor = 0;
let arqBruta = 0;
let K1 = 0;
let k2Calc = 0;
let formula1ArqLiq = 0;
let valor25PorcentoArqueacaoBruta = 0;
let formula2ArqLiq = 0;
let parte1;
let parte2;
let parte3;
let formula3ArqLiq = 0;
let erroExibido = false;
let parteFinal = 0;
let trintaPorcentoAB = 0;
let arqLiq = 0;
let tiposNavegacao;
let radioDoce;
let radioSalgada;
let totalCarga = 0;
let cargaAbaixo = 0;
let cargaAcima = 0;
let N1 = 0;
let N2 = 0;
let N3 = 0;

//==============================
// FUNÇÕES DE CÁLCULO
//==============================

function calcularCoeficienteConvencional() {
    materialCasco = document.getElementById('material-do-casco').value;

    if (materialCasco === 'madeira' || materialCasco === 'concreto') {
        coeficienteConvencional = 0.17;
    } else if (materialCasco === 'aço' || materialCasco === 'fibra-de-vidro' || materialCasco === 'aluminio') {
        coeficienteConvencional = 0.18;
    }

    document.getElementById('coeficiente-convencional').value = coeficienteConvencional;
    calcularF(); // Atualiza o coeficiente F sempre que o coeficiente convencional mudar
}

function calcularMultiplicadorM() {
    contorno = parseFloat(document.getElementById('contorno').value) || 0;
    bocaMoldada = parseFloat(document.getElementById('boca-moldada').value) || 0;

    M = Math.pow((contorno + bocaMoldada) / 2, 2)*coeficienteConvencional;
    document.getElementById('M-convencional').value = M.toFixed(2);
}

function calcularF() {
    contorno = parseFloat(document.getElementById('contorno').value) || 0;
    bocaMoldada = parseFloat(document.getElementById('boca-moldada').value) || 0;
    pontalMoldado = parseFloat(document.getElementById('pontal-moldado').value) || 0;
    coeficienteConvencional = parseFloat(document.getElementById('coeficiente-convencional').value) || 0;

    F = (Math.pow((contorno + bocaMoldada) / 2, 2) * coeficienteConvencional) / (bocaMoldada * pontalMoldado);

    document.getElementById('f-convencional').value = F.toFixed(2);
    document.getElementById('f-volume-do-casco').value = F.toFixed(2);
    verificarFaixaAplicacao(F);
}

function verificarFaixaAplicacao(F) {
    const metodoExpedito = document.getElementById('flexRadioDefault1');
    const volumeProjetista = document.getElementById('flexRadioDefault2');

    
    // Se F estiver dentro da faixa correta (entre 0.4 e 0.85)
    if (F >= 0.4 && F <= 0.85) {
        metodoExpedito.disabled = false;
        metodoExpedito.checked = true;  // Marca o "Método Expedito"
        volumeProjetista.checked = false;  // Desmarca o "Volume Projetista"
        showSection('convencional');  // Mostra a seção de "convencional"
    } else {
        // Se F estiver fora da faixa, marca "Volume Projetista" e mostra os campos correspondentes
        metodoExpedito.disabled = true;
        volumeProjetista.checked = true;
        showSection('volume-do-casco');  // Mostra a seção de "Volume do Casco"
    }
}

function calcularVolumeConvencional() {
    contorno = parseFloat(document.getElementById('contorno').value) || 0;
    bocaMoldada = parseFloat(document.getElementById('boca-moldada').value) || 0;
    coeficienteConvencional = parseFloat(document.getElementById('coeficiente-convencional').value) || 0;
    comprimentoArqueacao = parseFloat(document.getElementById('comprimento-arqueacao').value) || 0;

    volumeConvencional = Math.pow((contorno + bocaMoldada) / 2, 2) * coeficienteConvencional * comprimentoArqueacao;
    document.getElementById('convencional-volume-do-casco').value = volumeConvencional.toFixed(2);

    document.getElementById('m-volume-do-casco').value = volumeConvencional.toFixed(2);


}

function atualizarCalculos() {
    calcularMultiplicadorM();
    calcularF();
    calcularVolumeConvencional();
}


// Função que soma os valores de carga abaixo e acima e atualiza o campo "espacos-carga-arq-liq"
function atualizarEspacosCargaArqLiq() {
    cargaAbaixo = parseFloat(document.getElementById('input-carga-abaixo').value) || 0;
    cargaAcima = parseFloat(document.getElementById('input-carga-acima').value) || 0;

    totalCarga = cargaAbaixo + cargaAcima;

    // Atualiza o campo de espacos-carga-arq-liq com o valor somado
    document.getElementById('espacos-carga-arq-liq').value = totalCarga.toFixed(2);
}


//==============================
// CALCULO DA DETERMINAÇÃO DOS CALADOS NA ABA 4
//==============================
document.addEventListener('DOMContentLoaded', function () {
    // Função para calcular e preencher os campos de calado
    function calcularCalados() {
        // Obtenção de valores dos campos necessários
        comprimentoRegra = parseFloat(document.getElementById('comprimento-de-regra').value);
        bocaMoldada = parseFloat(document.getElementById('boca-moldada').value);
        coeficienteConvencional = parseFloat(document.getElementById('f-convencional').value);
        pontalMoldado = parseFloat(document.getElementById('pontal-moldado').value);
        tiposNavegacao = document.getElementById('tipos-de-navegacao').value;
        radioDoce = document.getElementById('agua-doce');
        radioSalgada = document.getElementById('agua-salgada');


    // Verifica a densidade da água selecionada (Doce ou Salgada)
        const densidadeAguaSelecionada = document.querySelector('input[name="densidade-agua"]:checked');
        const densidadeAgua = densidadeAguaSelecionada.value === "1.000" ? 1.000 : 1.025;

    // Cálculo do Calado Leve (0.5 * Pontal Moldado)
        caladoLeveCalculado = (0.5 * pontalMoldado).toFixed(3);
        caladoCarregadoCalculado = (0.75 * pontalMoldado).toFixed(3);

    // Se os campos estiverem vazios ou não, usamos os valores do input ou os calculados
        caladoLeveInput = parseFloat(document.getElementById("calado-leve").value);
        caladoCarregadoInput = parseFloat(document.getElementById("calado-carregado").value);

    // Se os campos estiverem vazios, preenche com os valores calculados
        if (!caladoLeveInput) {
            document.getElementById("calado-leve").value = caladoLeveCalculado;
            caladoLeveInput = parseFloat(caladoLeveCalculado);
        }
        if (!caladoCarregadoInput) {
            document.getElementById("calado-carregado").value = caladoCarregadoCalculado;
            caladoCarregadoInput = parseFloat(caladoCarregadoCalculado);
        }

    // Cálculo do Deslocamento Leve
        deslocamentoLeve = (comprimentoRegra * bocaMoldada * densidadeAgua * coeficienteConvencional * caladoLeveInput).toFixed(3);
        document.getElementById("deslocamento-leve").value = deslocamentoLeve;

    // Cálculo do Deslocamento Carregado
        const deslocamentoCarregado = (comprimentoRegra * bocaMoldada * densidadeAgua * coeficienteConvencional * caladoCarregadoInput).toFixed(3);
        document.getElementById("deslocamento-carregado").value = deslocamentoCarregado;

    // Cálculo do Porte Bruto (Deslocamento Carregado - Deslocamento Leve)
        const porteBruto = (deslocamentoCarregado - deslocamentoLeve).toFixed(3);
        document.getElementById("porte-bruto").value = porteBruto;

    // Habilita a edição dos campos
        document.getElementById("calado-leve").disabled = false;
        document.getElementById("calado-carregado").disabled = false;
        document.getElementById("deslocamento-leve").disabled = false;
        document.getElementById("deslocamento-carregado").disabled = false;
        document.getElementById("porte-bruto").disabled = false;


//==============================
// REFERENTE A ABA DE ARQ BRUTA
//==============================
    // Atualiza o campo total-volume (que agora é um input)
        document.getElementById("total-volume").value = soma;

    // Atualiza também o V2, se necessário
        document.getElementById("v2").value = soma;


    // Obtém o valor do campo "convencional-volume-do-casco" (V1)
        volumeCasco = parseFloat(document.getElementById('convencional-volume-do-casco').value);

        // Atribui o valor ao campo V1
        document.getElementById('v1').value = volumeCasco.toFixed(2);

        // Obtém o valor do campo "total-volume" (V2)
        volumeAcimaConv = parseFloat(document.getElementById('total-volume').value);

        // Atribui o valor ao campo V2
        document.getElementById('v2').value = volumeAcimaConv;

        // Soma os valores de V1 e V2
        volumeV = volumeAcimaConv + volumeCasco;

        // Atribui o valor total ao campo "volume-total-arq-bruta"
        document.getElementById('volume-total-arq-bruta').value = volumeV.toFixed(2); // Exibe o volume total com 2 casas decimais

         // Calcula o valor de K1 = (0.2 + 0.02 * log10(V))
        if (volumeV > 0) {  // Apenas calcula se o volume for maior que zero
            K1 = (0.2 + 0.02 * Math.log10(volumeV));
            
            // Atribui o valor de K1 ao campo correspondente (adicione o campo no HTML com id="k1")
            document.getElementById('k1').value = K1.toFixed(4);
        } else {
            // Se volumeV for zero ou inválido, zera o valor de K1
            document.getElementById('k1').value = '';
        }

        //calculando arqueacao bruta
        arqBruta = volumeV * K1;

        document.getElementById('arqueacao-bruta').value = Math.floor(arqBruta);

        const aviso = "Para embarcações com AB maior ou igual a 20 o Vistoriador Naval do GVI deverá realizar os cálculos e emitir o Certificado Nacional de Arqueação, de acordo com o Capítulo 7 da NORMAM-202/DPC. Não será possível gerar a Nota PDF!";
        const btnRevisar = document.getElementById('btn-revisar-dados'); // Botão "Revisar Dados"
        const btnGerarPDF = document.getElementById('btn-gerar-pdf'); // Botão "Gerar PDF"

        if (arqBruta >= 20) {
        alert(aviso); // Exibe o alerta se AB >= 20
        btnRevisar.disabled = true; // Desabilita o botão "Revisar Dados"
        btnGerarPDF.disabled = true; // Desabilita o botão "Gerar PDF"
    } else {
        // Habilita os botões se AB < 20
        btnRevisar.disabled = false;
        btnGerarPDF.disabled = false;
    }


//==============================
// REFERENTE ARQ LIQ
//==============================     
         //*************calculando k2 e enviando os calculos para o campo (Não teve jeito, GAMBIARRA)*********************
    cargaAbaixo = parseFloat(document.getElementById('input-carga-abaixo').value);
    cargaAcima = parseFloat(document.getElementById('input-carga-acima').value);

    totalCarga = cargaAbaixo + cargaAcima;

         k2Calc = (0.2 + 0.02 * Math.log10(totalCarga));// ********LEMBRAR: REF A ARQ LIQ, ONDE ESTÁ VOLUME DO CASCO SUBSTITUIR POR VOLUME DO ESPAÇOS DE CARGA Vc

         document.getElementById('k2').value = k2Calc.toFixed(4);

          // Verifica se pontalMoldado é diferente de zero para evitar divisão por zero
         if (pontalMoldado === 0) {
            document.getElementById('k2').value = '0';
            return; // Retorna se pontalMoldado for zero
        }

        

        //************calculando n1+n2 *********************
        N1 = parseFloat(document.getElementById('numero-passageiros-beliches').value);
        N2 = parseFloat(document.getElementById('numero-demais-passageiros').value);
        N3 = parseFloat(document.getElementById('numeros-de-profissionais').value);

        // Soma os valores
        let totalPassageiros = N1 + N2 + N3;

        // Verifica se o total é menor que 13
        if (totalPassageiros < 13) {
            totalPassageiros = 0;
        }

        // Atualiza o campo de resultado (substitua pelo id do campo onde deseja exibir o resultado)
        document.getElementById('n1-n2').value = totalPassageiros;



        //************calculando formula1 arq liq *******************
        formula1ArqLiq = Math.pow((4 * caladoCarregadoInput / (3 * pontalMoldado)), 2);

    // Verifica se o resultado é maior que 1
        if (formula1ArqLiq > 1) {
            alert("Erro: O valor calculado para a fórmula é maior que 1. Verifique os dados informados.");
        document.getElementById('formula-arq-liq').value = ''; // Limpa o campo de resultado
    } else {
        // Se tudo estiver correto, atribui o valor calculado ao campo correspondente
        document.getElementById('formula-arq-liq').value = formula1ArqLiq.toFixed(2);
    }


    //*****************  calculando formula2 arq liq ***************************
    formula2ArqLiq = k2Calc*(totalCarga)*formula1ArqLiq;
    
    // Cálculo de 25% da Arqueação Bruta
    valor25PorcentoArqueacaoBruta = 0.25 * arqBruta;


    // Verifica se o valor de formula1-arq-liq é maior ou igual a 25% de arqueacao-bruta
    if (formula2ArqLiq > valor25PorcentoArqueacaoBruta) {
        // Usa o valor de formula2-arq-liq
        formula2ArqLiq = formula2ArqLiq;
    } else {
        // Usa 25% da Arqueação Bruta
        formula2ArqLiq = valor25PorcentoArqueacaoBruta;
    }

    // Atualiza o campo com o resultado
    document.getElementById("formula2-arq-liq").value = formula2ArqLiq.toFixed(2);



    //************** calculando formula3 arq liq *****************************
    // Verifica se pontalMoldado é diferente de zero para evitar divisão por zero
       // Verificação de erros
    if (pontalMoldado === 0 || volumeCasco === 0) {
        if (!erroExibido) {
            alert("O valor de Pontal Moldado ou Volume do Casco não pode ser zero.");
                erroExibido = true; // Marca que o erro foi exibido
            }
            return; // Apenas retorna sem limpar o campo
        }

        // Cálculo da fórmula 3 de arqueação líquida
        parteFinal = (1.25 * (arqBruta + 10000) / 10000) * (N1 + (N2 / 10));

        // Verifica o resultado da fórmula 1 e calcula a fórmula 3
        if (formula1ArqLiq >= 0.25 * arqBruta) {
            formula3ArqLiq = formula2ArqLiq + parteFinal;
        } else {
            formula3ArqLiq = 0.25 * arqBruta;
        }

        // Atualiza o campo com o valor calculado
        document.getElementById('formula3-arq-liq').value = formula3ArqLiq.toFixed(2);


        // Cálculo da fórmula 4 de arqueação líquida
        // Calcular 30% da arqueação bruta
        trintaPorcentoAB = parseFloat(0.30 * arqBruta);

        // Se formula3ArqLiq >= 30% de AB, usa o valor de formula3ArqLiq, senão usa 30% de AB
        if (parseFloat(formula3ArqLiq) >= trintaPorcentoAB) {
            document.getElementById('formula4-arq-liq').value = parseFloat(formula3ArqLiq).toFixed(2);
        } else {
            document.getElementById('formula4-arq-liq').value = trintaPorcentoAB.toFixed(2);
        }
        

      // Cálculo da arqueação líquida
    // Verifica se ARQUEAÇÃO LÍQUIDA CALCULADA é maior que a Arqueação Bruta
        if (formula3ArqLiq > arqBruta) {
            arqLiq = Math.floor(arqBruta);
        } else if (formula3ArqLiq < trintaPorcentoAB) {
            arqLiq = Math.floor(trintaPorcentoAB);        
        } else {
        arqLiq = Math.floor(formula3ArqLiq); // Arredonda para baixo o valor de formula3ArqLiq
    }

    // Atribui o valor da Arqueação Líquida ao campo correspondente, sem casas decimais
    document.getElementById('arqueacao-liquida').value = Math.floor(arqLiq);
}

    // Evento para recalcular os valores quando a densidade da água for alterada
document.querySelectorAll('input[name="densidade-agua"]').forEach(radio => {
    radio.addEventListener('change', calcularCalados);
});

// Adiciona o listener para os inputs de tipos de navegação
document.querySelectorAll('input[name="tipos-de-navegacao"]').forEach(radio => {
    radio.addEventListener('change', calcularCalados);
});

    // Eventos para recalcular os valores quando calado-leve ou calado-carregado forem alterados
document.getElementById('calado-leve').addEventListener('input', calcularCalados);
document.getElementById('calado-carregado').addEventListener('input', calcularCalados);
document.getElementById('pontal-moldado').addEventListener('input', calcularCalados);
//document.getElementById('caladoCarregadoInput').addEventListener('input', calcularCalados);
document.getElementById('convencional-volume-do-casco').addEventListener('input', calcularCalados);
document.getElementById('arqueacao-bruta').addEventListener('input',calcularCalados);
document.getElementById('tipos-de-navegacao').addEventListener('change',calcularCalados);
document.getElementById('agua-doce').addEventListener('change',calcularCalados);
document.getElementById('agua-salgada').addEventListener('change',calcularCalados);


    // Evento para calcular os valores ao entrar na aba de determinação dos calados
document.getElementById('det-calados-tab').addEventListener('shown.bs.tab', function () {
    calcularCalados();
});


    // Chama a função de cálculo de calados sempre que o valor do Pontal Moldado for alterado
document.getElementById('pontal-moldado').addEventListener('input', function () {
   // Limpa os campos de calado para recalcular com base no novo pontal
    document.getElementById("calado-leve").value = '';
    document.getElementById("calado-carregado").value = '';
    calcularCalados();
});



    // Chama o cálculo inicial para já preencher os valores ao carregar a página
calcularCalados();
});




//==============================
// CALCULO DO VOLUME ACIMA DO CONVÉS NA ABA 3
//==============================
function criarLinhas() {
    numLinhas = parseInt(document.getElementById("numero-linhas").value);

    if (numLinhas > 50) {
        alert("O número máximo de linhas é 50.");
        numLinhas = 50;
    }

    const tabela = document.getElementById("tabela-volumes").getElementsByTagName("tbody")[0];

    for (let i = 0; i < numLinhas; i++) {
        const row = tabela.insertRow();
        row.innerHTML = `
        <td><input type="text" class="form-control" name="nome[]"></td>
        <td><input type="number" class="form-control" name="comprimento[]" oninput="calcularVolume(this)"></td>
        <td><input type="number" class="form-control" name="largura[]" oninput="calcularVolume(this)"></td>
        <td><input type="number" class="form-control" name="altura[]" oninput="calcularVolume(this)"></td>
        <td><input type="text" class="form-control" name="volumeEstimado[]" readonly></td>
        <td><input type="number" class="form-control" name="volumeInformado[]" oninput="atualizarVolume(this)"></td>
        <td><input type="text" class="form-control" name="volumeFinal[]" readonly></td>
        `;
    }
    atualizarSoma(); // Atualiza a soma após criar novas linhas
}

function calcularVolume(element) {
    row = element.closest("tr");
    comprimento = parseFloat(row.querySelector('input[name="comprimento[]"]').value) || 0;
    largura = parseFloat(row.querySelector('input[name="largura[]"]').value) || 0;
    altura = parseFloat(row.querySelector('input[name="altura[]"]').value) || 0;

    volumeEstimado = comprimento * largura * altura;
    row.querySelector('input[name="volumeEstimado[]"]').value = volumeEstimado.toFixed(3);

    atualizarVolume(row.querySelector('input[name="volumeInformado[]"]')); // Atualiza também a coluna de volume final
}

function atualizarVolume(element) {
    row = element.closest("tr");
    volumeEstimado = parseFloat(row.querySelector('input[name="volumeEstimado[]"]').value) || 0;
    volumeInformado = parseFloat(row.querySelector('input[name="volumeInformado[]"]').value) || 0;

    volumeFinal = volumeInformado > 0 ? volumeInformado : volumeEstimado;
    row.querySelector('input[name="volumeFinal[]"]').value = volumeFinal;

    atualizarSoma(); // Atualiza a soma ao mudar o volume
}

function atualizarSoma() {
    volumesFinais = document.querySelectorAll('input[name="volumeFinal[]"]');
    soma = 0;

    volumesFinais.forEach(input => {
        soma += parseFloat(input.value) || 0;
    });


//==============================
// REFERENTE A ABA DE ARQ BRUTA
//==============================
    // Atualiza o campo total-volume (que agora é um input)
    document.getElementById("total-volume").value = soma;

    // Atualiza também o V2, se necessário
    document.getElementById("v2").value = soma;


    // Obtém o valor do campo "convencional-volume-do-casco" (V1)
    volumeCasco = parseFloat(document.getElementById('convencional-volume-do-casco').value);

        // Atribui o valor ao campo V1
    document.getElementById('v1').value = volumeCasco.toFixed(2);

        // Obtém o valor do campo "total-volume" (V2)
    volumeAcimaConv = parseFloat(document.getElementById('total-volume').value);

        // Atribui o valor ao campo V2
    document.getElementById('v2').value = volumeAcimaConv;

        // Soma os valores de V1 e V2
    volumeV = volumeAcimaConv + volumeCasco;

        // Atribui o valor total ao campo "volume-total-arq-bruta"
        document.getElementById('volume-total-arq-bruta').value = volumeV.toFixed(2); // Exibe o volume total com 2 casas decimais

         // Calcula o valor de K1 = (0.2 + 0.02 * log10(V))
        if (volumeV > 0) {  // Apenas calcula se o volume for maior que zero
            K1 = (0.2 + 0.02 * Math.log10(volumeV));
            
            // Atribui o valor de K1 ao campo correspondente (adicione o campo no HTML com id="k1")
            document.getElementById('k1').value = K1.toFixed(4);
        } else {
            // Se volumeV for zero ou inválido, zera o valor de K1
            document.getElementById('k1').value = '';
        }

        //calculando arqueacao bruta
        arqBruta = volumeV * K1;

        document.getElementById('arqueacao-bruta').value = Math.floor(arqBruta);

        const aviso = "Para embarcações com AB maior ou igual a 20 o Vistoriador Naval do GVI deverá realizar os cálculos e emitir o Certificado Nacional de Arqueação, de acordo com o Capítulo 7 da NORMAM-202/DPC.";
        const btnRevisar = document.getElementById('btn-revisar-dados'); // Botão "Revisar Dados"
        const btnGerarPDF = document.getElementById('btn-gerar-pdf'); // Botão "Gerar PDF"

        if (arqBruta >= 20) {
        alert(aviso); // Exibe o alerta se AB >= 20
        btnRevisar.disabled = true; // Desabilita o botão "Revisar Dados"
        btnGerarPDF.disabled = true; // Desabilita o botão "Gerar PDF"
    } else {
        // Habilita os botões se AB < 20
        btnRevisar.disabled = false;
        btnGerarPDF.disabled = false;
    }



//==============================
// REFERENTE ARQ LIQ
//==============================

         //*************calculando k2 e enviando os calculos para o campo (Não teve jeito, GAMBIARRA)*********************
    cargaAbaixo = parseFloat(document.getElementById('input-carga-abaixo').value) || 0;
    cargaAcima = parseFloat(document.getElementById('input-carga-acima').value) || 0;

    totalCarga = cargaAbaixo + cargaAcima;

         k2Calc = (0.2 + 0.02 * Math.log10(totalCarga));// ********LEMBRAR: REF A ARQ LIQ, ONDE ESTÁ VOLUME DO CASCO SUBSTITUIR POR VOLUME DO ESPAÇOS DE CARGA Vc

         document.getElementById('k2').value = k2Calc.toFixed(4);

          // Verifica se pontalMoldado é diferente de zero para evitar divisão por zero
         if (pontalMoldado === 0) {
            document.getElementById('k2').value = '0';
            return; // Retorna se pontalMoldado for zero
        }



        //************calculando n1+n2 *********************
        N1 = parseFloat(document.getElementById('numero-passageiros-beliches').value);
        N2 = parseFloat(document.getElementById('numero-demais-passageiros').value);
        N3 = parseFloat(document.getElementById('numeros-de-profissionais').value);

        // Soma os valores
        let totalPassageiros = N1 + N2 + N3;

        // Verifica se o total é menor que 13
        if (totalPassageiros < 13) {
            totalPassageiros = 0;
        }

        document.getElementById('n1-n2').value = totalPassageiros;



        //************calculando formula1 arq liq *******************
        formula1ArqLiq = Math.pow((4 * caladoCarregadoInput / (3 * pontalMoldado)), 2);

    // Verifica se o resultado é maior que 1
        if (formula1ArqLiq > 1) {
            alert("Erro: O valor calculado para a fórmula é maior que 1. Verifique os dados informados.");
        document.getElementById('formula-arq-liq').value = ''; // Limpa o campo de resultado
    } else {
        // Se tudo estiver correto, atribui o valor calculado ao campo correspondente
        document.getElementById('formula-arq-liq').value = formula1ArqLiq.toFixed(2);
    }


    //*****************  calculando formula2 arq liq ***************************
    formula2ArqLiq = k2Calc*(totalCarga)*formula1ArqLiq;
    
    // Cálculo de 25% da Arqueação Bruta
    valor25PorcentoArqueacaoBruta = 0.25 * arqBruta;


    // Verifica se o valor de formula1-arq-liq é maior ou igual a 25% de arqueacao-bruta
    if (formula2ArqLiq > valor25PorcentoArqueacaoBruta) {
        // Usa o valor de formula2-arq-liq
        formula2ArqLiq = formula2ArqLiq;
    } else {
        // Usa 25% da Arqueação Bruta
        formula2ArqLiq = valor25PorcentoArqueacaoBruta;
    }

    // Atualiza o campo com o resultado
    document.getElementById("formula2-arq-liq").value = formula2ArqLiq.toFixed(2);



    //************** calculando formula3 arq liq *****************************
    // Verifica se pontalMoldado é diferente de zero para evitar divisão por zero
       // Verificação de erros
    if (pontalMoldado === 0 || volumeCasco === 0) {
        if (!erroExibido) {
            alert("O valor de Pontal Moldado ou Volume do Casco não pode ser zero.");
                erroExibido = true; // Marca que o erro foi exibido
            }
            return; // Apenas retorna sem limpar o campo
        }

        // Cálculo da fórmula 3 de arqueação líquida
        parteFinal = (1.25 * (arqBruta + 10000) / 10000) * (N1 + (N2 / 10));

        // Verifica o resultado da fórmula 1 e calcula a fórmula 3
        if (formula1ArqLiq >= 0.25 * arqBruta) {
            formula3ArqLiq = formula2ArqLiq + parteFinal;
        } else {
            formula3ArqLiq = 0.25 * arqBruta;
        }

        // Atualiza o campo com o valor calculado
        document.getElementById('formula3-arq-liq').value = formula3ArqLiq.toFixed(2);


        // Cálculo da fórmula 4 de arqueação líquida
        // Calcular 30% da arqueação bruta
        trintaPorcentoAB = parseFloat(0.30 * arqBruta);

        // Se formula3ArqLiq >= 30% de AB, usa o valor de formula3ArqLiq, senão usa 30% de AB
        if (parseFloat(formula3ArqLiq) >= trintaPorcentoAB) {
            document.getElementById('formula4-arq-liq').value = parseFloat(formula3ArqLiq).toFixed(2);
        } else {
            document.getElementById('formula4-arq-liq').value = trintaPorcentoAB.toFixed(2);
        }
        

         // Cálculo da arqueação líquida
    // Verifica se ARQUEAÇÃO LÍQUIDA CALCULADA é maior que a Arqueação Bruta
        if (formula3ArqLiq > arqBruta) {
            arqLiq = Math.floor(arqBruta);
        } else if (formula3ArqLiq < trintaPorcentoAB) {
            arqLiq = Math.floor(trintaPorcentoAB);        
        } else {
        arqLiq = Math.floor(formula3ArqLiq); // Arredonda para baixo o valor de formula3ArqLiq
    }

    // Atribui o valor da Arqueação Líquida ao campo correspondente, sem casas decimais
    document.getElementById('arqueacao-liquida').value = Math.floor(arqLiq);
}         

function excluirCampos() {
    tabela = document.getElementById("tabela-volumes").getElementsByTagName("tbody")[0];

    if (tabela.rows.length > 0 && confirm("Tem certeza que deseja excluir todas as linhas?")) {
        while (tabela.rows.length > 0) {
            tabela.deleteRow(0);
        }
    }

    atualizarSoma(); // Atualiza a soma após excluir campos
}


// ==========================
// EVENTOS E CHAMADAS INICIAIS
// ==========================
document.addEventListener('DOMContentLoaded', function () {
    // Chama a função para calcular e atualizar a soma quando o volume é alterado
    const volumeInformadoInputs = document.querySelectorAll('input[name="volumeInformado[]"]');
    volumeInformadoInputs.forEach(input => {
        input.addEventListener('input', function() {
            atualizarSoma(); // Atualiza a soma ao mudar o valor
            calcularCalados();
        });
    });

    // Exemplo para criar linhas - chame essa função em algum lugar para testá-la
    criarLinhas(); // Adiciona linhas inicialmente para o teste
});




// ==========================
// ABA 5 - VOLUMES DO ESPAÇOS DE CARGA
// ==========================
function verificarTransporteCarga() {
    const sim = document.getElementById('tranporta-carga-sim').checked;
    
    // Habilita ou desabilita os rádios seguintes baseados na escolha de carga
    document.getElementById('tranporta-carga-abaixo-sim').disabled = !sim;
    document.getElementById('tranporta-carga-abaixo-nao').disabled = !sim;
    document.getElementById('tranporta-carga-acima-sim').disabled = !sim;
    document.getElementById('tranporta-carga-acima-nao').disabled = !sim;

    // Habilita ou desabilita também os campos de input (m³)
    if (!sim) {
        document.getElementById('input-carga-abaixo').style.display = 'none';
        document.getElementById('input-carga-abaixo').disabled = true;
        document.getElementById('input-carga-acima').style.display = 'none';
        document.getElementById('input-carga-acima').disabled = true;
    }
}

// Verifica se a embarcação transporta carga abaixo do convés e mostra o campo de input
function verificarCargaAbaixoConves() {
    sim = document.getElementById('tranporta-carga-abaixo-sim').checked;
    const input = document.getElementById('input-carga-abaixo');

    if (sim) {
        input.style.display = 'block';
        input.disabled = false;
    } else {
        input.style.display = 'none';
        input.disabled = true;
    }

    // Atualiza o valor em espacos-carga-arq-liq sempre que o input for mostrado ou alterado
    atualizarEspacosCargaArqLiq();
}

// Verifica se a embarcação transporta carga acima do convés e mostra o campo de input
function verificarCargaAcimaConves() {
    sim = document.getElementById('tranporta-carga-acima-sim').checked;
    input = document.getElementById('input-carga-acima');

    if (sim) {
        input.style.display = 'block';
        input.disabled = false;
    } else {
        input.style.display = 'none';
        input.disabled = true;
    }

     // Atualiza o valor em espacos-carga-arq-liq sempre que o input for mostrado ou alterado
    atualizarEspacosCargaArqLiq();

}

// Função que soma os valores de carga abaixo e acima e atualiza o campo "espacos-carga-arq-liq"
function atualizarEspacosCargaArqLiq() {
    cargaAbaixo = parseFloat(document.getElementById('input-carga-abaixo').value) || 0;
    cargaAcima = parseFloat(document.getElementById('input-carga-acima').value) || 0;

    totalCarga = cargaAbaixo + cargaAcima;

    k2Calc = (0.2 + 0.02 * Math.log10(totalCarga));

    document.getElementById('k2').value = k2Calc.toFixed(4);

    // Atualiza o campo de espacos-carga-arq-liq com o valor somado
    document.getElementById('espacos-carga-arq-liq').value = totalCarga.toFixed(2);
}




//==============================
// ABA 7 - DADOS DOS MOTORES
//=============================
// Função para adicionar linhas de motores
function criarLinhasMotor() {
    const tabelaMotor = document.getElementById("tabela-dados-motores").getElementsByTagName("tbody")[0];
    const linhasExistentes = tabelaMotor.rows.length; // Contagem de linhas existentes

    let numLinhasMotor = parseInt(document.getElementById("numero-linhas-Motor").value);

    // Calcula quantas linhas podem ser adicionadas sem exceder o limite de 3
    let linhasPermitidas = 3 - linhasExistentes;

    if (numLinhasMotor > linhasPermitidas) {
        alert(`Você pode adicionar no máximo 3 linha(s).`);
        numLinhasMotor = linhasPermitidas;  // Corrige o número de linhas que podem ser adicionadas
    }

    // Insere as novas linhas até o limite
    for (let i = 0; i < numLinhasMotor; i++) {
        const row = tabelaMotor.insertRow();
        row.innerHTML = `
        <td><input type="text" class="form-control" name="fabricante[]"></td>
        <td><input type="text" class="form-control" name="modelo[]"></td>
        <td><input type="text" class="form-control" name="numeroSerie[]"></td>
        <td><input type="number" class="form-control" name="potencia[]" min="0" step="0.01" placeholder="kW"></td>
        <td><input type="number" class="form-control" name="rpm[]" min="0" placeholder="RPM"></td>
        <td>
        <select class="form-control" name="combustivel[]">
        <option value="-">-</option>
        <option value="Diesel">Diesel</option>
        <option value="Gasolina">Gasolina</option>
        <option value="Eletrico">Elétrico</option>
        <option value="Outro">Outro</option>
        </select>
        </td>
        `;
    }
}

function excluirCamposMotor() {
    const tabelaMotor = document.getElementById("tabela-dados-motores").getElementsByTagName("tbody")[0];

    if (tabelaMotor.rows.length > 0 && confirm("Tem certeza que deseja excluir todas as linhas?")) {
        while (tabelaMotor.rows.length > 0) {
            tabelaMotor.deleteRow(0);
        }
    }
}




//=========================================================
//ASSOCIANDO O TIPO DE NAVEGAÇÃO
//=========================================================

function atualizarTiposNavegacao() {
 tiposNavegacao = document.getElementById('tipos-de-navegacao').value;
 radioDoce = document.getElementById('agua-doce');
 radioSalgada = document.getElementById('agua-salgada');

 if (tiposNavegacao === 'interior-area-1' || tiposNavegacao === 'interior-area-2' || tiposNavegacao === 'apoio-portuario') {
        // Habilita Doce (1.000) sem marcar, desabilita Salgada
    radioSalgada.disabled = true;
    radioDoce.disabled = false;
} else if (tiposNavegacao === 'longo-curso' || tiposNavegacao === 'cabotagem' || tiposNavegacao === 'apoio-maritimo') {
        // Habilita Salgada (1.025) sem marcar, desabilita Doce
    radioDoce.disabled = true;
    radioSalgada.disabled = false;
}
}



//==============================
// ABA 8 - ARQUEAÇÃO BRUTA E LIQUIDA
//=============================
document.addEventListener('DOMContentLoaded', function () {
    function copiarValorVolume() {
        atualizarSoma();
        calcularCalados();
        atualizarTiposNavegacao();
        atualizarEspacosCargaArqLiq();
    }

    // Função que atualiza os cálculos e copia os valores para "v1", "v2" e "volume-total-arq-bruta"
    function atualizarCalculos() {
        calcularMultiplicadorM();
        calcularF();
        calcularVolumeConvencional();
        calcularCalados();
        atualizarSoma();
        atualizarTiposNavegacao();
        atualizarEspacosCargaArqLiq();

        // Após calcular o volume, copia os valores para os campos "v1", "v2" e "volume-total-arq-bruta"
        copiarValorVolume();
    }

    // Eventos para recalcular os valores quando os campos relevantes forem alterados
    document.getElementById('contorno').addEventListener('input', atualizarCalculos);
    document.getElementById('boca-moldada').addEventListener('input', atualizarCalculos);
    document.getElementById('comprimento-arqueacao').addEventListener('input', atualizarCalculos);
    document.getElementById('coeficiente-convencional').addEventListener('input', atualizarCalculos);
    document.getElementById('pontal-moldado').addEventListener('input', atualizarCalculos);
    document.getElementById('convencional-volume-do-casco').addEventListener('input', atualizarCalculos);
    document.getElementById('convencional-volume-do-casco').addEventListener('input', atualizarSoma);
    document.getElementById('numero-passageiros-beliches').addEventListener('input', atualizarSoma);
    document.getElementById('numero-demais-passageiros').addEventListener('input', atualizarSoma);
    document.getElementById('numeros-de-profissionais').addEventListener('input', atualizarSoma);
    document.getElementById('pontal-moldado').addEventListener('input', atualizarSoma);
    document.getElementById('calado-carregado').addEventListener('input', atualizarCalculos);
    //document.getElementById('calado-carregado').addEventListener('input', calcularCalados);
    document.getElementById('arqueacao-bruta').addEventListener('input', atualizarCalculos);
    //document.getElementById('arqueacao-bruta').addEventListener('input', calcularCalados);
    document.getElementById('formula-arq-liq').addEventListener('input', atualizarSoma);
    document.getElementById('formula2-arq-liq').addEventListener('input', atualizarSoma);
    document.getElementById('formula3-arq-liq').addEventListener('input', atualizarSoma);
    document.getElementById('formula3-arq-liq').addEventListener('input', calcularCalados);
    document.getElementById('pontal-moldado').addEventListener('input', calcularCalados);   
    document.getElementById('calado-carregado').addEventListener('input', atualizarSoma);
    document.getElementById('arqueacao-bruta').addEventListener('input', atualizarSoma);
    document.getElementById('arqueacao-bruta').addEventListener('input', calcularCalados);
    document.getElementById('numero-passageiros-beliches').addEventListener('input', calcularCalados);
    document.getElementById('numero-demais-passageiros').addEventListener('input', calcularCalados);
    document.getElementById('formula-arq-liq').addEventListener('input', calcularCalados);
    document.getElementById('formula2-arq-liq').addEventListener('input', calcularCalados);
    document.getElementById('formula3-arq-liq').addEventListener('input', calcularCalados);
    document.getElementById('formula4-arq-liq').addEventListener('input', calcularCalados);
    document.getElementById('formula-arq-liq').addEventListener('input', atualizarSoma);
    document.getElementById('formula2-arq-liq').addEventListener('input', atualizarSoma);
    document.getElementById('formula3-arq-liq').addEventListener('input', atualizarSoma);
    document.getElementById('formula4-arq-liq').addEventListener('input', atualizarSoma);
    document.querySelectorAll('input[name="tipos-de-navegacao"]').forEach(radio => {
        radio.addEventListener('change', calcularCalados);
    });
    document.getElementById('agua-doce').addEventListener('change',calcularCalados);
    document.getElementById('agua-salgada').addEventListener('change',calcularCalados);
    document.getElementById('total-volume').addEventListener('input', function () {
        copiarValorVolume(); // Atualiza a soma automaticamente ao alterar o campo "total-volume"
        atualizarSoma();
        calcularCalados();
    });

    // Chama o cálculo inicial ao carregar a página
    atualizarCalculos();
    calcularCalados();
    atualizarTiposNavegacao();
    atualizarEspacosCargaArqLiq();
});


//============================
//Observacoes
// ==========================
document.addEventListener('DOMContentLoaded', function() {
    // Função para preencher automaticamente o campo de ano e hora
    function preencherDataHoraAutomatica() {
        const agora = new Date(); // Obtém a data e hora atual

    // Obtém a data atual
    const diaAtual = agora.getDate().toString().padStart(2, '0'); // Obtém o dia e adiciona o zero à esquerda se necessário
    const mesAtual = (agora.getMonth() + 1).toString().padStart(2, '0'); // Obtém o mês (precisa adicionar 1) e adiciona o zero à esquerda
    const anoAtual = agora.getFullYear(); // Obtém o ano atual

    // Obtém a hora atual
    const horas = agora.getHours().toString().padStart(2, '0'); // Obtém as horas
    const minutos = agora.getMinutes().toString().padStart(2, '0'); // Obtém os minutos

    // Preenche os campos de ano, data e hora
    document.getElementById('anoField').value = anoAtual; // Preenche o campo de ano
    document.getElementById('horaField').value = `${horas}:${minutos}`; // Preenche o campo de hora no formato HH:MM
    document.getElementById('dataField').value = `${diaAtual}/${mesAtual}/${anoAtual}`; // Preenche o campo de data no formato DD/MM/YYYY

}

    // Função para validar o campo OM
function validarOM() {
    const omField = document.getElementById('omField').value;

        // Verifica se o OM tem exatamente 3 dígitos
    if (omField.length !== 3 || isNaN(omField)) {
        alert('O campo OM deve conter exatamente 3 dígitos numéricos.');
    }
}

    // Função para validar o campo Sequencial
function validarSequencial() {
    const sequencialField = document.getElementById('sequencialField').value;

        // Verifica se o sequencial tem exatamente 5 dígitos
    if (sequencialField.length !== 5 || isNaN(sequencialField)) {
        alert('O campo Sequencial deve conter exatamente 5 dígitos numéricos.');
    }
}

    // Adiciona eventos de validação para os campos OM e Sequencial ao sair do campo
document.getElementById('omField').addEventListener('focusout', validarOM);
document.getElementById('sequencialField').addEventListener('focusout', validarSequencial);

    // Preenche o ano e a hora automaticamente ao carregar a página
preencherDataHoraAutomatica();
});




// ==========================
// FUNÇÕES DE NAVEGAÇÃO
// ==========================
function nextTab(tabId) {
    atualizarCalculos();

    // Verifica se estamos saindo da primeira aba (por exemplo, aba com ID 'primeira-aba-id')
    const currentTabLink = document.querySelector('.nav-link.active');
    const currentTabContent = document.querySelector('.tab-pane.show.active');
    if (currentTabLink.id === 'caracteristicas-tab') {
        // Apenas para a primeira aba, exibe o alerta se F estiver fora do intervalo
        if (F < 0.4 || F > 0.85) {
            alert(`Valores fora do intervalo!\n F: ${F.toFixed(2)}\n M: ${M.toFixed(2)}\n coef: ${coeficienteConvencional.toFixed(2)}\n E volume do casco é: ${volumeConvencional.toFixed(2)}\n 
                A opção "VOLUME DO CASCO INFORMADO PELO PROJETISTA" será ativada para continuar.`);
        }
    }else if(currentTabLink.id === 'volumes-acima-tab') {
        alert('Selecione a densidade da água (Doce ou Salgada) para habilitar os campos e mostrar os resultados dos cálculos.');
    }

    if (currentTabLink && currentTabContent) {
        currentTabLink.classList.remove('active');
        currentTabContent.classList.remove('show', 'active');
    }

    const nextTabLink = document.getElementById(tabId);
    if (nextTabLink) {
        nextTabLink.classList.add('active');
    }

    const nextTabContent = document.querySelector(nextTabLink.getAttribute('href'));
    if (nextTabContent) {
        nextTabContent.classList.add('show', 'active');
    }
}

function showSection(section) {
    document.getElementById('convencional-section').style.display = 'none';
    document.getElementById('volume-do-casco-section').style.display = 'none';

    if (section === 'convencional') {
        document.getElementById('convencional-section').style.display = 'flex';
    } else if (section === 'volume-do-casco') {
        document.getElementById('volume-do-casco-section').style.display = 'flex';
    }
}


//=====================================
//FUNÇÃO PARA TORNAR OS CAMPOS OBRIGATÓRIOS
//=====================================
// Função que valida se os campos obrigatórios foram preenchidos
function validarCamposPrimeiraAba() {
    bocaMoldada = document.getElementById('boca-moldada').value.trim();
    pontalMoldado = document.getElementById('pontal-moldado').value.trim();
    numLinhas = document.getElementById('numero-linhas').value.trim();
    radioDoce = document.getElementById('agua-doce').checked;
    radioSalgada = document.getElementById('agua-salgada').checked;

    const dadosMotorNotaSim = document.getElementById('dados-motor-nota-sim').checked; 
    const dadosMotorNotaNao = document.getElementById('dados-motor-nota-nao').checked; 
    const numeroLinhasMotor = document.getElementById('numero-linhas-Motor').value.trim();
    const transportaCargaSim = document.getElementById('tranporta-carga-sim').checked; 
    const transportaCargaNao = document.getElementById('tranporta-carga-nao').checked;
    
    const btnProximo1 = document.getElementById('botaoproximo1');
    const btnProximo2 = document.getElementById('botaoproximo2');
    const btnProximo3 = document.getElementById('botaoproximo3');
    const btnProximo4 = document.getElementById('botaoproximo4');
    const btnProximo5 = document.getElementById('botaoproximo5');
    const btnProximo6 = document.getElementById('botaoproximo6');

    // Habilita ou desabilita as abas e botões com base nos campos preenchidos
    // 1. Verifica se boca e pontal estão preenchidos
    if (bocaMoldada !== '' && pontalMoldado !== '') {
        btnProximo1.disabled = false;  
        habilitarAba('passageiros-tab');  
        habilitarAba('volumes-acima-tab');
    } else {
        btnProximo1.disabled = true;  
        desabilitarAbas(['passageiros-tab', 'volumes-acima-tab', 'det-calados-tab', 'volumes-espacos-carga-tab', 'dados-motores-tab', 'arqueacao-bruta-liquida-tab', 'observacoes-tab']);
    }

    // 2. Verifica se o número de linhas está preenchido
    if (numLinhas !== '') {
        btnProximo3.disabled = false;  
        habilitarAba('det-calados-tab');  
    } else {
        btnProximo3.disabled = true;  
        desabilitarAbas(['det-calados-tab']);  
    }

    // 3. Verifica se a água é doce ou salgada
    if (radioDoce || radioSalgada) {
        btnProximo4.disabled = false;  
        habilitarAba('volumes-espacos-carga-tab');  
    } else {
        btnProximo4.disabled = true;  
        desabilitarAbas(['volumes-espacos-carga-tab']);  
    }

    // 4. Verifica se transporta carga
    if (transportaCargaSim || transportaCargaNao) {
        btnProximo5.disabled = false;
        habilitarAba('dados-motores-tab');
    } else {
        btnProximo5.disabled = true;
        desabilitarAbas(['dados-motores-tab']);
    }

    // 5. Verifica se os dados dos motores devem ser inseridos nas notas da arqueação
    if (dadosMotorNotaSim) {
        document.getElementById('numero-linhas-Motor').disabled = false;  
        document.getElementById('tabela-dados-motores').style.display = 'table'; 

    // Verifica se o campo de número de linhas está preenchido
        if (numeroLinhasMotor !== '') {
            btnProximo6.disabled = false;  
            habilitarAba('arqueacao-bruta-liquida-tab');  
        habilitarAba('observacoes-tab');  // Habilita a aba observações
    } else {
        btnProximo6.disabled = true;  
        desabilitarAbas(['arqueacao-bruta-liquida-tab', 'observacoes-tab']);  // Desabilita as abas se o campo não for preenchido
    }
} else if (dadosMotorNotaNao) {  // Se "Não" for selecionado
    document.getElementById('numero-linhas-Motor').disabled = true;  
    document.getElementById('tabela-dados-motores').style.display = 'none';
    btnProximo6.disabled = false;  
    // Habilita as abas independentemente da seleção "Não"
    habilitarAba('arqueacao-bruta-liquida-tab');  
    habilitarAba('observacoes-tab');  // Habilita a aba observações
} else {
    // Caso nenhum dos botões esteja selecionado, desabilita as abas
    document.getElementById('numero-linhas-Motor').disabled = true;  
    document.getElementById('tabela-dados-motores').style.display = 'none';
    btnProximo6.disabled = true;  
    desabilitarAbas(['arqueacao-bruta-liquida-tab', 'observacoes-tab']);  // Desabilita as abas
    }

}

// Função que habilita uma aba específica
function habilitarAba(tabId) {
    document.getElementById(tabId).classList.remove('disabled');
}

// Função que desabilita um conjunto de abas
function desabilitarAbas(tabs) {
    tabs.forEach(tabId => {
        document.getElementById(tabId).classList.add('disabled');
    });
}

// Função para adicionar o asterisco (*) nos campos obrigatórios
function adicionarAsteriscoObrigatorioPrimeiraAba() {
    const labelBocaMoldada = document.getElementById('label-boca-moldada');
    const labelPontalMoldado = document.getElementById('label-pontal-moldado');
    const labelNumeroLinhas = document.getElementById('label-numero-linhas');
    const labelAguaDoce = document.getElementById('label-agua-doce');
    const labelAguaSalgada = document.getElementById('label-agua-salgada');
    //const labelTransportaCarga = document.getElementById('label-transporta-carga');
    //const labelDadosMotorNota = document.getElementById('label-dados-do-motor');;
    const labelTransportaCarga = document.querySelector('label[for="tranporta-carga-sim"]');
    const labelDadosMotorNota = document.querySelector('label[for="dados-motor-nota-sim"]');
    

    labelBocaMoldada.innerHTML += ' <span style="color: red;">*</span>';
    labelPontalMoldado.innerHTML += ' <span style="color: red;">*</span>';
    labelNumeroLinhas.innerHTML += ' <span style="color: red;">*</span>';
    labelAguaDoce.innerHTML += ' <span style="color: red;">*</span>';
    labelAguaSalgada.innerHTML += ' <span style="color: red;">*</span>';
    labelTransportaCarga.innerHTML += ' <span style="color: red;"></span>';
    labelDadosMotorNota.innerHTML += ' <span style="color: red;"></span>';

}

// Função para desabilitar as abas iniciais
function desabilitarAbasIniciais() {
    desabilitarAbas(['passageiros-tab', 'volumes-acima-tab', 'det-calados-tab', 'volumes-espacos-carga-tab', 'dados-motores-tab', 'arqueacao-bruta-liquida-tab', 'observacoes-tab']);
}


// Chama a função para adicionar o asterisco nos campos obrigatórios ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
    adicionarAsteriscoObrigatorioPrimeiraAba();
    desabilitarAbasIniciais();

    // Valida os campos obrigatórios sempre que o conteúdo for alterado
    document.getElementById('boca-moldada').addEventListener('input', validarCamposPrimeiraAba);
    document.getElementById('pontal-moldado').addEventListener('input', validarCamposPrimeiraAba);
    document.getElementById('numero-linhas').addEventListener('input', validarCamposPrimeiraAba);
    document.getElementById('agua-doce').addEventListener('change', validarCamposPrimeiraAba);
    document.getElementById('agua-salgada').addEventListener('change', validarCamposPrimeiraAba);
    document.getElementById('tranporta-carga-sim').addEventListener('change', validarCamposPrimeiraAba);
    document.getElementById('tranporta-carga-nao').addEventListener('change', validarCamposPrimeiraAba);
    document.getElementById('numero-linhas-Motor').addEventListener('input', validarCamposPrimeiraAba);
    document.getElementById('dados-motor-nota-sim').addEventListener('change', validarCamposPrimeiraAba);
    document.getElementById('dados-motor-nota-nao').addEventListener('change', validarCamposPrimeiraAba);
});



// ==========================
// FUNÇÕES DE INTERFACE
// ==========================

// Essa função deve estar fora do window.onload
function mostrarContainerBalsa() {
   document.getElementById('balsa-tipoI-container').style.display = 'none';
   document.getElementById('balsa-tipoII-container').style.display = 'none';
   document.getElementById('flutuante-tipoI-container').style.display = 'none';
   document.getElementById('flutuante-tipoII-container').style.display = 'none';
   document.getElementById('flutuante-tipoIII-container').style.display = 'none';
   document.getElementById('catamara-tipoI-container').style.display = 'none';
   document.getElementById('catamara-tipoII-container').style.display = 'none';
   document.getElementById('trimara-container').style.display = 'none';

   const valorSelecionado = document.getElementById('tipo-casco-select').value;

   if (valorSelecionado === 'balsa-tipoI') {
    document.getElementById('balsa-tipoI-container').style.display = 'block';
} else if (valorSelecionado === 'balsa-tipoII') {
    document.getElementById('balsa-tipoII-container').style.display = 'block';
} else if (valorSelecionado === 'flutuante-tipoI') {
    document.getElementById('flutuante-tipoI-container').style.display = 'block';
} else if (valorSelecionado === 'flutuante-tipoII') {
    document.getElementById('flutuante-tipoII-container').style.display = 'block';
} else if (valorSelecionado === 'flutuante-tipoIII') {
    document.getElementById('flutuante-tipoIII-container').style.display = 'block';
} else if (valorSelecionado === 'catamara-tipoI') {
    document.getElementById('catamara-tipoI-container').style.display = 'block';
} else if (valorSelecionado === 'catamara-tipoII') {
    document.getElementById('catamara-tipoII-container').style.display = 'block';
} else if (valorSelecionado === 'trimara') {
    document.getElementById('trimara-container').style.display = 'block';
}


calcularCaladosDeslocamentoPorte();
}


//********************************************
//INCIO DO WINDOW.ONLOAD / CONTINUA SENDO FUNÇÃO DE INTERFACE 
//********************************************
window.onload = function() {
    showSection('volume-do-casco');

    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);

    });

    const tipoBalsaSelect = document.getElementById('tipo-casco-select');
    tipoBalsaSelect.addEventListener('change', mostrarContainerBalsa);


    // Chama as funções sempre que os rádios forem clicados
    //document.getElementById('agua-doce').addEventListener('change', verificarDensidadeAgua);
    //document.getElementById('agua-salgada').addEventListener('change', verificarDensidadeAgua);

    document.getElementById('tranporta-carga-sim').addEventListener('change', verificarTransporteCarga);
    document.getElementById('tranporta-carga-nao').addEventListener('change', verificarTransporteCarga);
    document.getElementById('tranporta-carga-abaixo-sim').addEventListener('change', verificarCargaAbaixoConves);
    document.getElementById('tranporta-carga-abaixo-nao').addEventListener('change', verificarCargaAbaixoConves);
    document.getElementById('tranporta-carga-acima-sim').addEventListener('change', verificarCargaAcimaConves);
    document.getElementById('tranporta-carga-acima-nao').addEventListener('change', verificarCargaAcimaConves);



    // Chama a função para atualizar quando o valor dos inputs mudar
    document.getElementById('input-carga-abaixo').addEventListener('input', atualizarEspacosCargaArqLiq);
    document.getElementById('input-carga-acima').addEventListener('input', atualizarEspacosCargaArqLiq);




    // Chama as funções inicialmente para garantir que os inputs estão no estado correto
    //verificarDensidadeAgua();
    verificarTransporteCarga();
    verificarCargaAbaixoConves();
    verificarCargaAcimaConves();

};


