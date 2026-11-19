# Binairo

Grades de Binairo (também chamado Takuzu) varridas inteiras até 8×8, em Node puro, sem dependência nenhuma.

Uma grade n×n de 0 e 1, com n par, é um **binairo** quando:

1. cada linha e cada coluna tem exatamente metade de zeros e metade de uns;
2. nenhuma linha nem coluna tem três iguais seguidos;
3. não há duas linhas iguais, nem duas colunas iguais.

```
1 1 0 1 0 0
1 0 1 1 0 0
0 1 0 0 1 1
1 1 0 0 1 0
0 0 1 1 0 1
0 0 1 0 1 1
```

(Esta é a primeira grade que `node exemplos/uso.js 6` monta.)

---

## Os quatro achados

**1. A terceira regra corta cada vez mais.** "Nada repetido" parece um detalhe. No 4×4 ela tira **20%** das grades que já passam nas duas primeiras (90 → 72). No 6×6 tira **63,11%** (11.222 → 4.140). No 8×8 tira **66,88%** (12.413.918 → 4.111.116).

**2. Toda grade 4×4 precisa de exatamente 4 dicas.** Para cada uma das 72, procurei o menor conjunto de casas reveladas que só ela satisfaz. A tabela saiu chapada: **as 72 precisam de 4**. Nenhuma se resolve com 3, nenhuma exige 5.

**3. As 4.140 grades 6×6 são 321 a menos de simetria.** As 16 simetrias são as 8 do quadrado, cada uma com e sem trocar 0 por 1. No 4×4 as 72 grades são **10** classes. O lema de Burnside confere as duas contagens.

**4. Dá para contar o 8×8 sem montar grade.** Uma transferência por colunas — o estado é, para cada coluna, quantos uns já tem e os dois últimos valores — conta as 12.413.918 grades das regras 1 e 2 sem construir nenhuma, com no máximo 259.252 estados no mapa. Ela não sabe nada da regra 3, que é global e não cabe no estado; e é justamente por isso que ela confere a contagem *sem* a regra 3.

---

## As tabelas

Todos os números saem de `node ferramentas/medidor.js` e estão presos em `testes/`.

| grade | linhas válidas | regras 1 e 2 | as três regras | a regra 3 corta |
| --- | --- | --- | --- | --- |
| 2×2 | 2 | 2 | 2 | 0,00% |
| 4×4 | 6 | 90 | 72 | 20,00% |
| 6×6 | 14 | 11.222 | 4.140 | 63,11% |
| 8×8 | 34 | 12.413.918 | 4.111.116 | 66,88% |

| grade | binairos | classes (16 simetrias) | Burnside |
| --- | --- | --- | --- |
| 4×4 | 72 | 10 | 10 |
| 6×6 | 4.140 | 321 | 321 |

| dicas mínimas no 4×4 | grades |
| --- | --- |
| 4 | **72** (todas) |

---

## Os juízes

**A transferência por colunas** conta sem montar grade, e concorda com a montagem sem a regra 3 em todos os tamanhos até 8×8. Há um teste dizendo o contrário também: no 6×6 ela tem de dar **mais** que a montagem completa — se concordasse com a contagem *com* a regra 3, estaria medindo outra coisa.

**A força bruta** testa as 65.536 grades 4×4 pela definição e acha as mesmas 72.

**Burnside** confere as classes: a soma, sobre as grades, de quantas das 16 simetrias deixam cada uma parada, dividida por 16, tem de dar o número de classes — e dá, no 4×4 e no 6×6.

---

## O que as medidas me corrigiram

**A grade de exemplo deste README eu escrevi à mão, e ela estava errada.** Montei uma 6×6 de cabeça para ilustrar a abertura, e antes de publicar passei pela definição: `ehBinairo` devolveu `false`. A grade que está lá em cima agora é a primeira que o programa monta, e o README diz de onde ela vem. Figura escrita de memória num arquivo que existe para não ter número chutado é exatamente o erro que o resto do projeto evita.

O resto concordou de primeira: montagem, transferência, força bruta e Burnside.

A tabela das dicas mínimas eu esperava que tivesse dispersão — algumas grades difíceis, outras fáceis. Saiu uma coluna só, 4 para todas. Não escrevi previsão antes, então registro como surpresa.

---

## Como usar

Node 20 ou mais novo. Sem dependência.

```bash
npm test
npm run medir                       # ate 6x6
node ferramentas/medidor.js oito    # o 8x8 (~2,5 min)
node exemplos/uso.js 6
```

```js
import { monta, transferencia } from 'binairo'

monta(6).total           // 4140
transferencia(8).total   // 12413918
```

## Os arquivos

- `src/binairo.js` — as regras, a montagem linha a linha e as 16 simetrias.
- `src/juiz.js` — a transferência por colunas e a força bruta.
- `src/medidas.js` — as tabelas do README, cada uma calculada uma vez só.
- `src/index.js` — a porta de entrada do pacote.
- `exemplos/uso.js` — o pacote em uso.
- `ferramentas/medidor.js` — imprime as tabelas.
- `testes/` — 20 testes, com os números do README presos.

## Licença

MIT.
