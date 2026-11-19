// Binairo (tambem chamado Takuzu).
//
// Uma grade n x n, com n par, de 0 e 1, e um BINAIRO quando:
//
//   1. cada linha e cada coluna tem exatamente n/2 zeros e n/2 uns;
//   2. nenhuma linha nem coluna tem tres iguais seguidos;
//   3. nao ha duas linhas iguais, nem duas colunas iguais.
//
// Cada linha e guardada como mascara de n bits (bit j = coluna j).
//
// A busca monta linha por linha, escolhendo entre as LINHAS VALIDAS (as que ja
// passam nas regras 1 e 2 sozinhas). As colunas sao vigiadas no caminho: a conta
// de uns de cada coluna nao pode passar de n/2, nem a de zeros, e nenhuma coluna
// pode fazer tres iguais seguidos. A regra 3 das colunas so pode ser conferida
// com a grade pronta.

/** As linhas validas de comprimento n: equilibradas e sem tres iguais seguidos. */
export function linhasValidas (n) {
  const saida = []
  for (let m = 0; m < (1 << n); m++) {
    if (bits(m) !== n / 2) continue
    if (temTrio(m, n)) continue
    saida.push(m)
  }
  return saida
}

export function bits (m) {
  let c = 0
  while (m) { m &= m - 1; c++ }
  return c
}

/** A sequencia de n bits tem tres iguais seguidos? */
export function temTrio (m, n) {
  for (let j = 0; j + 2 < n; j++) {
    const a = (m >> j) & 1
    if (((m >> (j + 1)) & 1) === a && ((m >> (j + 2)) & 1) === a) return true
  }
  return false
}

/** As colunas de uma grade, como mascaras (bit i = linha i). */
export function colunas (grade, n) {
  const c = new Array(n).fill(0)
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if ((grade[i] >> j) & 1) c[j] |= 1 << i
  return c
}

/** A grade inteira passa nas tres regras? (a definicao, sem atalho) */
export function ehBinairo (grade, n) {
  const linhas = grade
  const cols = colunas(grade, n)
  for (const v of [...linhas, ...cols]) {
    if (bits(v) !== n / 2) return false
    if (temTrio(v, n)) return false
  }
  if (new Set(linhas).size !== n) return false
  if (new Set(cols).size !== n) return false
  return true
}

/**
 * Monta todas as grades linha por linha.
 *
 * `distintas` liga a regra 3. Sem ela, a busca conta as grades que so passam
 * nas regras 1 e 2 — e a diferenca entre as duas contagens e o quanto a regra 3
 * corta.
 *
 * `visita` recebe uma COPIA da grade pronta.
 */
export function monta (n, opcoes = {}) {
  const distintas = opcoes.distintas !== false
  const visita = opcoes.visita || null
  const metade = n / 2
  const validas = linhasValidas(n)
  const grade = []
  const uns = new Int32Array(n)
  let total = 0
  let nos = 0

  const anda = (i) => {
    nos++
    if (i === n) {
      if (distintas && new Set(colunas(grade, n)).size !== n) return
      total++
      if (visita) visita([...grade])
      return
    }
    for (const r of validas) {
      if (distintas && grade.includes(r)) continue
      let ok = true
      for (let j = 0; j < n && ok; j++) {
        const b = (r >> j) & 1
        const u = uns[j] + b
        const z = (i + 1) - u
        if (u > metade || z > metade) { ok = false; break }
        if (i >= 2) {
          const a1 = (grade[i - 1] >> j) & 1
          const a2 = (grade[i - 2] >> j) & 1
          if (a1 === b && a2 === b) ok = false
        }
      }
      if (!ok) continue
      for (let j = 0; j < n; j++) uns[j] += (r >> j) & 1
      grade.push(r)
      anda(i + 1)
      grade.pop()
      for (let j = 0; j < n; j++) uns[j] -= (r >> j) & 1
    }
  }

  anda(0)
  return { n, total, nos, linhasValidas: validas.length }
}

// ---------------------------------------------------------------------------
// As 16 simetrias: as 8 do quadrado, cada uma com ou sem trocar 0 por 1.
// ---------------------------------------------------------------------------

function bit (grade, i, j) { return (grade[i] >> j) & 1 }

function deCelulas (n, f) {
  const g = new Array(n).fill(0)
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (f(i, j)) g[i] |= 1 << j
  return g
}

export function simetrias (n) {
  const quadrado = [
    (g, i, j) => bit(g, i, j),
    (g, i, j) => bit(g, i, n - 1 - j),
    (g, i, j) => bit(g, n - 1 - i, j),
    (g, i, j) => bit(g, n - 1 - i, n - 1 - j),
    (g, i, j) => bit(g, j, i),
    (g, i, j) => bit(g, j, n - 1 - i),
    (g, i, j) => bit(g, n - 1 - j, i),
    (g, i, j) => bit(g, n - 1 - j, n - 1 - i)
  ]
  const lista = []
  for (const q of quadrado) {
    for (const troca of [false, true]) {
      lista.push((g) => deCelulas(n, (i, j) => (q(g, i, j) ^ (troca ? 1 : 0)) === 1))
    }
  }
  return lista
}

export function chave (grade) { return grade.join(',') }
