// O juiz. Caminhos que nao passam pela montagem linha a linha.
//
// 1. `transferencia` — conta as grades que passam nas regras 1 e 2 sem montar
//    grade nenhuma. O estado e, para cada coluna, quantos uns ja tem e quais os
//    dois ultimos valores; a linha nova e qualquer linha valida compativel. Um
//    mapa de estado -> quantas maneiras. Nao sabe nada da regra 3 (ela e global
//    e nao cabe no estado), entao confere a contagem SEM a regra 3.
//
// 2. `forcaBruta` — as 2^(n*n) grades, cada uma pela definicao (`ehBinairo`).
//    Sao 65.536 no 4x4; no 6x6 seriam 68 bilhoes, entao ela para no 4.

import { linhasValidas, ehBinairo } from './binairo.js'

export function transferencia (n) {
  const metade = n / 2
  const validas = linhasValidas(n)
  // Estado por coluna: uns (0..metade), penultimo e ultimo valor (-1 = ainda nao ha).
  let atual = new Map([[JSON.stringify(new Array(n).fill([0, -1, -1])), 1]])
  let maiorMapa = 1
  for (let i = 0; i < n; i++) {
    const prox = new Map()
    for (const [k, q] of atual) {
      const est = JSON.parse(k)
      for (const r of validas) {
        const novo = []
        let ok = true
        for (let j = 0; j < n; j++) {
          const b = (r >> j) & 1
          const [u, pen, ult] = est[j]
          const nu = u + b
          if (nu > metade || (i + 1 - nu) > metade) { ok = false; break }
          if (pen === b && ult === b) { ok = false; break }
          novo.push([nu, ult, b])
        }
        if (!ok) continue
        const nk = JSON.stringify(novo)
        prox.set(nk, (prox.get(nk) || 0) + q)
      }
    }
    atual = prox
    if (atual.size > maiorMapa) maiorMapa = atual.size
  }
  let total = 0
  for (const q of atual.values()) total += q
  return { n, total, maiorMapa }
}

/** Todas as 2^(n^2) grades pela definicao. */
export function forcaBruta (n) {
  const casas = n * n
  const total = Math.pow(2, casas)
  if (total > 50_000_000) return { n, completa: false, precisaria: total }
  let achadas = 0
  const mascara = (1 << n) - 1
  for (let codigo = 0; codigo < total; codigo++) {
    const grade = []
    for (let i = 0; i < n; i++) grade.push((codigo >>> (i * n)) & mascara)
    if (ehBinairo(grade, n)) achadas++
  }
  return { n, completa: true, testadas: total, achadas }
}
