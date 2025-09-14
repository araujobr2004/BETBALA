function calcularApostas(T, O1, O2) {
  // T = total a investir
  // O1 = odd do site 1
  // O2 = odd do site 2

  // Fator de Arbitragem
  const fatorDeArbitragem = (1 / O1) + (1 / O2);

  if (fatorDeArbitragem >= 1) {
    // Calcular odds mínimas para arbitragem com O1 fixo
    const oddsMinimas = [];
    let O2min = 1 / (1 - (1 / O1));
    O2min += 0.01; // Garante que o fator de arbitragem será < 1
    const incremento = 0.05;
    for (let i = 0; i < 5; i++) {
      oddsMinimas.push(O2min + i * incremento);
    }
    return {
      erro: "Não é possível garantir lucro com essas odds.",
      fatorDeArbitragem: fatorDeArbitragem,
      oddsMinimas: oddsMinimas
    };
  }

  // Calcular retorno garantido
  const retornoGarantido = T / fatorDeArbitragem;

  // Calcular apostas individuais
  const aposta1 = retornoGarantido / O1;
  const aposta2 = retornoGarantido / O2;

  // Calcular lucro garantido
  const lucroGarantido = retornoGarantido - T;

  return {
    apostaOdd1: aposta1,
    apostaOdd2: aposta2,
    retornoGarantido: retornoGarantido,
    lucroGarantido: lucroGarantido
  };
}

if (resultado.erro) {
    let msg = `<strong>${resultado.erro}</strong>`;
    if (resultado.oddsMinimas) {
        msg += `<br><br>Para garantir lucro com Odd1 = ${parseFloat(odds1)}, a Odd2 precisa ser pelo menos:<br>`;
        msg += resultado.oddsMinimas
            .map(o => `<span class="odds-sugestao">${o.toFixed(2)}</span>`)
            .join(" ");
    }
    showModal(msg);
    document.getElementById('resultado').textContent = resultado.erro;
} else {
    alert(
        `Aposta Odd1: R$ ${resultado.apostaOdd1.toFixed(3)}\n` +
        `Aposta Odd2: R$ ${resultado.apostaOdd2.toFixed(3)}\n` +
        `Retorno Garantido: R$ ${resultado.retornoGarantido.toFixed(3)}\n` +
        `Lucro Garantido: R$ ${resultado.lucroGarantido.toFixed(3)}`
    );
    document.getElementById('resultado').innerHTML =
        `<div>
            <strong>Aposta Odd1:</strong> R$ ${resultado.apostaOdd1.toFixed(3)}<br>
            <strong>Aposta Odd2:</strong> R$ ${resultado.apostaOdd2.toFixed(3)}<br>
            <strong>Retorno Garantido:</strong> R$ ${resultado.retornoGarantido.toFixed(3)}<br>
            <strong>Lucro Garantido:</strong> R$ ${resultado.lucroGarantido.toFixed(3)}
        </div>`;
}