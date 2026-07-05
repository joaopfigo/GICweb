# GIC - Grupo de Investimento Coletivo

Plataforma simples para calcular:

- `Principal`, `Porcentagem` e `% Taxa`
- Juros flutuante da carteira
- Valor da parcela de empréstimo com dias extras

## Como abrir

Abra o arquivo `index.html` no navegador.

## Regras usadas

`Porcentagem = Principal X % Taxa ÷ 100`

`Principal = Porcentagem X 100 ÷ % Taxa`

`% Taxa = Porcentagem X 100 ÷ Principal`

No juros flutuante:

`X = Recebido de juro no mês X Fundo social ÷ 100`

`Y = Recebido de juro no mês - X`

`H = Y ÷ Principal (Carteira)`

`% Taxa aplicada = H X 100`
