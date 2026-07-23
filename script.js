const dinheiro = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const percentual = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

const campos = [
  "Principal",
  "Porcentagem",
  "taxa",
  "carteira",
  "dinheiroEmprestado",
  "recebidoJuro",
  "fundoSocial",
  "valorInvestidor",
  "emprestimoPrincipal",
  "jurosPagar",
  "parcelas",
  "diasExtras",
];

const $ = (id) => document.getElementById(id);
let instalarApp = null;

function numero(valor) {
  if (typeof valor !== "string") return Number(valor) || 0;
  const limpo = valor
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.-]/g, "");
  return Number(limpo) || 0;
}

function mostrarErro(elemento, mensagem) {
  elemento.classList.add("error");
  elemento.textContent = mensagem;
}

function calcularRegra() {
  const regraTipo = $("regraTipo").value;
  const Principal = numero($("Principal").value);
  const Porcentagem = numero($("Porcentagem").value);
  const taxa = numero($("taxa").value);
  const resultado = $("regraResultado");
  const explicacao = $("regraExplicacao");
  const formula = $("regraFormula");

  $("Principal").disabled = regraTipo === "Principal";
  $("Porcentagem").disabled = regraTipo === "Porcentagem";
  $("taxa").disabled = regraTipo === "taxa";
  document.querySelectorAll(".formula-item").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.resultado === regraTipo);
  });
  resultado.classList.remove("error");

  if (regraTipo === "Porcentagem") {
    const valor = (Principal * taxa) / 100;
    resultado.textContent = dinheiro.format(valor);
    explicacao.textContent =
      "A Porcentagem é o valor em dinheiro calculado sobre o Principal.";
    formula.textContent = "Porcentagem = Principal X % Taxa ÷ 100";
    return;
  }

  if (regraTipo === "Principal") {
    if (taxa === 0) {
      mostrarErro(resultado, "Informe a % Taxa");
      return;
    }
    const valor = (Porcentagem * 100) / taxa;
    resultado.textContent = dinheiro.format(valor);
    explicacao.textContent =
      "O Principal é o valor total que recebeu essa Porcentagem.";
    formula.textContent = "Principal = Porcentagem X 100 ÷ % Taxa";
    return;
  }

  if (Principal === 0) {
    mostrarErro(resultado, "Informe o Principal");
    return;
  }
  const valor = (Porcentagem * 100) / Principal;
  resultado.textContent = `${percentual.format(valor)}%`;
  explicacao.textContent =
    "A % Taxa mostra quanto a Porcentagem representa dentro do Principal.";
  formula.textContent = "% Taxa = Porcentagem X 100 ÷ Principal";
}

function calcularFlutuante() {
  const carteira = numero($("carteira").value);
  const recebidoJuro = numero($("recebidoJuro").value);
  const fundoSocial = numero($("fundoSocial").value);
  const valorInvestidor = numero($("valorInvestidor").value);

  const X = (recebidoJuro * fundoSocial) / 100;
  const Y = recebidoJuro - X;
  const H = carteira > 0 ? Y / carteira : 0;
  const taxa = H * 100;
  const Porcentagem = (valorInvestidor * taxa) / 100;

  $("resultadoX").textContent = dinheiro.format(X);
  $("resultadoY").textContent = dinheiro.format(Y);
  $("resultadoH").textContent = `${percentual.format(taxa)}%`;
  $("flutuanteExplicacao").textContent =
    `Com ${dinheiro.format(valorInvestidor)} investidos, a Porcentagem deste mês ` +
    `é ${dinheiro.format(Porcentagem)}.`;
}

function calcularEmprestimo() {
  const Principal = numero($("emprestimoPrincipal").value);
  const taxa = numero($("jurosPagar").value);
  const parcelas = Math.max(1, Math.round(numero($("parcelas").value)));
  const diasExtras = Math.max(0, Math.round(numero($("diasExtras").value)));

  const juros30dias = (Principal * taxa) / 100;
  const jurosPorDia = juros30dias / 30;
  const jurosExtras = jurosPorDia * diasExtras;
  const amortizacao = Principal / parcelas;
  const valorParcela = amortizacao + juros30dias + jurosExtras;

  $("juros30dias").textContent = dinheiro.format(juros30dias);
  $("jurosExtras").textContent = dinheiro.format(jurosExtras);
  $("valorParcela").textContent = dinheiro.format(valorParcela);
}

function trocarPainel(mode) {
  document.querySelectorAll(".mode-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === mode);
  });

  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === mode);
  });
}

document.querySelectorAll(".mode-button").forEach((button) => {
  button.addEventListener("click", () => trocarPainel(button.dataset.mode));
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  instalarApp = event;
  $("installButton").hidden = false;
  $("installHelp").textContent =
    "Toque em instalar para colocar o GIC na tela inicial do celular.";
});

$("installButton").addEventListener("click", async () => {
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

  if (instalarApp) {
    instalarApp.prompt();
    await instalarApp.userChoice;
    instalarApp = null;
    return;
  }

  $("installHelp").textContent = isIOS
    ? 'No iPhone, abra no Safari, toque em compartilhar e escolha "Adicionar à Tela de Início".'
    : "Se o botão de instalação não aparecer, abra o menu do navegador e escolha instalar app.";
});

campos.forEach((id) => {
  $(id).addEventListener("input", () => {
    calcularRegra();
    calcularFlutuante();
    calcularEmprestimo();
  });
});

$("regraTipo").addEventListener("change", calcularRegra);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

calcularRegra();
calcularFlutuante();
calcularEmprestimo();
