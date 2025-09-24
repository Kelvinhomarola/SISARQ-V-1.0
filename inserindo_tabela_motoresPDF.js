document.getElementById("btn-gerar-pdf").addEventListener("click", function () {
    const inserirTabelaMotores = document.querySelector('input[name="dados-motor-nota"]:checked').value === 'sim'; // Verifica se "Sim" foi selecionado
    const doc = new jsPDF();

    // Conteúdo do PDF

    if (inserirTabelaMotores) {
        // Gera a tabela de motores no PDF se "Sim" for selecionado
        doc.text("Dados dos Motores", 10, posY); // Adiciona o título da tabela

        const tabela = document.getElementById("tabela-dados-motores");
        const linhasTabela = tabela.getElementsByTagName("tr");

        posY += 10; // Ajusta a posição vertical

        // Itera sobre as linhas da tabela e adiciona ao PDF
        for (let i = 0; i < linhasTabela.length; i++) {
            const celulas = linhasTabela[i].getElementsByTagName("td");

            let linhaTexto = "";
            for (let j = 0; j < celulas.length; j++) {
                linhaTexto += celulas[j].innerText + " "; // Concatena o conteúdo das células
            }

            doc.text(linhaTexto, 10, posY);
            posY += 10; // Ajusta a posição para a próxima linha
        }
    } else {
        // Caso "Não" seja selecionado, a tabela não será adicionada
        doc.text("Dados dos motores não foram incluídos conforme solicitado.", 10, posY);
    }

    // Salva ou exibe o PDF gerado
    doc.save("relatorio.pdf");
});
