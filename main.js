function calcularOddsMinimas(O1, O2) {
  const oddsMinimasO2 = [], oddsMinimasO1 = [];
  if (O1 > 1) {
    let O2min = 1 / (1 - (1 / O1)) + 0.01;
    for (let i = 0; i < 5; i++) {
      oddsMinimasO2.push(O2min + i * 0.05);
    }
  }
  if (O2 > 1) {
    let O1min = 1 / (1 - (1 / O2)) + 0.01;
    for (let i = 0; i < 5; i++) {
      oddsMinimasO1.push(O1min + i * 0.05);
    }
  }
  return { oddsMinimasO2, oddsMinimasO1 };
}

function calcularApostas(T, O1, O2) {
  const fatorDeArbitragem = (1 / O1) + (1 / O2);
  if (fatorDeArbitragem >= 1) {
    const { oddsMinimasO2, oddsMinimasO1 } = calcularOddsMinimas(O1, O2);
    return {
      erro: "Não é possível garantir lucro com essas odds.",
      fatorDeArbitragem,
      oddsMinimasO2,
      oddsMinimasO1
    };
  }
  const retornoGarantido = T / fatorDeArbitragem;
  const aposta1 = retornoGarantido / O1;
  const aposta2 = retornoGarantido / O2;
  const lucroGarantido = retornoGarantido - T;
  return { apostaOdd1: aposta1, apostaOdd2: aposta2, retornoGarantido, lucroGarantido };
}

function showModal(content, extraClass = "") {
  const modal = document.getElementById('customModal');
  const modalContent = modal.querySelector('.modal-content');
  document.getElementById('modalBody').innerHTML = content;
  modal.style.display = 'block';
  modalContent.className = 'modal-content'; // Reseta as classes
  if (extraClass) {
    modalContent.classList.add(extraClass);
  }
}

// Adiciona o listener ao formulário
document.getElementById('formAposta').addEventListener('submit', function(event) {
  event.preventDefault(); // Impede o recarregamento da página

  // Pega os valores dos inputs (ajuste os IDs se forem diferentes)
  const T = parseFloat(document.getElementById('valor_aposta').value.replace(',', '.'));
  const O1 = parseFloat(document.getElementById('odds1').value.replace(',', '.'));
  const O2 = parseFloat(document.getElementById('odds2').value.replace(',', '.'));

  // Validação básica aprimorada
  if (isNaN(T) || T <= 0) {
    showModal("Por favor, insira um valor de aposta válido e maior que zero.", "modal-red");
    return;
  }
  if (isNaN(O1) || O1 <= 1) {
    showModal("O valor da Odd1 deve ser maior que 1.", "modal-red");
    return;
  }
  if (isNaN(O2) || O2 <= 1) {
    showModal("O valor da Odd2 deve ser maior que 1.", "modal-red");
    return;
  }

  const resultado = calcularApostas(T, O1, O2);
  const resultadoDiv = document.getElementById('resultado');

  if (resultado.erro) {
    // CASO RED: Não há lucro, então mostra as sugestões
    let cruzamentosMsg = "";
    if (resultado.oddsMinimasO2 && resultado.oddsMinimasO2.length > 0) {
      cruzamentosMsg += `<br><br>Para garantir lucro com Odd1 = ${O1}, a Odd2 precisa ser pelo menos:<br>`;
      cruzamentosMsg += resultado.oddsMinimasO2
        .map(o => `<span class="odds-sugestao">${o.toFixed(2)}</span>`)
        .join(" ");
    }
    if (resultado.oddsMinimasO1 && resultado.oddsMinimasO1.length > 0) {
      // Adiciona o "OU" entre as sugestões
      cruzamentosMsg += `<br><br><strong style="font-size: 1.2em;">OU</strong><br><br>`;
      cruzamentosMsg += `Para garantir lucro com Odd2 = ${O2}, a Odd1 precisa ser pelo menos:<br>`;
      cruzamentosMsg += resultado.oddsMinimasO1
        .map(o => `<span class="odds-sugestao">${o.toFixed(2)}</span>`)
        .join(" ");
    }
    
    let msg = `<div class="modal-status-title">Deu <strong>RED</strong></div><br><strong>${resultado.erro}</strong>${cruzamentosMsg}`;
    showModal(msg, "modal-red");
    resultadoDiv.className = 'red';
    resultadoDiv.innerHTML = msg;

  } else {
    // CASO GREEN: Há lucro, não mostra sugestões
    let msg = `<div class="modal-status-title">Deu <strong>GREEN</strong></div><br>
      <strong>Aposta Odd1:</strong> R$ ${resultado.apostaOdd1.toFixed(2)}<br>
      <strong>Aposta Odd2:</strong> R$ ${resultado.apostaOdd2.toFixed(2)}<br>
      <strong>Retorno Garantido:</strong> R$ ${resultado.retornoGarantido.toFixed(2)}<br>
      <strong>Lucro Garantido:</strong> R$ ${resultado.lucroGarantido.toFixed(2)}`;
    
    showModal(msg, "green");
    resultadoDiv.className = 'green';
    resultadoDiv.innerHTML = msg;
  }
});

document.getElementById('closeModal').onclick = function() {
  document.getElementById('customModal').style.display = 'none';
};

window.onclick = function(event) {
  if (event.target == document.getElementById('customModal')) {
    document.getElementById('customModal').style.display = 'none';
  }
};