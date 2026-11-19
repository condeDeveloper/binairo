// As tabelas do README. Calculadas aqui, e em lugar nenhum mais.

import { monta, simetrias, chave } from './binairo.js'
import { transferencia, forcaBruta } from './juiz.js'

const guardadas = new Map()
function umaVez (k, fn) {
  if (!guardadas.has(k)) guardadas.set(k, fn())
  return guardadas.get(k)
}

export function grades (n) {
  return umaVez(`grades:${n}`, () => { const g = []; monta(n, { visita: (x) => g.push(x) }); return g })
}

/** Com e sem a regra 3, e quanto ela corta. */
export function contagem (ns = [2, 4, 6]) {
  return umaVez(`cont:${ns.join(',')}`, () =>
    ns.map((n) => {
      const com = monta(n)
      const sem = monta(n, { distintas: false })
      return { n, linhasValidas: com.linhasValidas, com: com.total, sem: sem.total, corta: 1 - com.total / sem.total }
    })
  )
}

/** As classes pelas 16 simetrias, e Burnside conferindo. */
export function classes (n) {
  return umaVez(`classes:${n}`, () => {
    const sims = simetrias(n)
    const lista = grades(n)
    const vistas = new Set()
    let somaFixas = 0
    for (const g of lista) {
      const k0 = chave(g)
      let menor = null
      for (const s of sims) {
        const k = chave(s(g))
        if (menor === null || k < menor) menor = k
        if (k === k0) somaFixas++
      }
      vistas.add(menor)
    }
    return { n, grades: lista.length, classes: vistas.size, burnside: somaFixas / 16 }
  })
}

/**
 * Para cada grade 4x4, o menor numero de casas reveladas que so ela satisfaz.
 *
 * E um problema de cobertura: as casas reveladas tem de tocar o conjunto de
 * casas em que a grade difere de CADA uma das outras 71. Varro os subconjuntos
 * das 16 casas por tamanho crescente, entao o primeiro que serve e o minimo.
 */
export function dicasMinimas4 () {
  return umaVez('dicas4', () => {
    const n = 4
    const lista = grades(n)
    const celulas = (g) => { let m = 0; for (let i = 0; i < n; i++) m |= (g[i] & 15) << (i * 4); return m }
    const cs = lista.map(celulas)
    const porTamanho = []
    for (let k = 0; k <= 16; k++) porTamanho.push([])
    for (let S = 0; S < 65536; S++) { let c = S; let p = 0; while (c) { c &= c - 1; p++ } porTamanho[p].push(S) }
    const dist = new Map()
    for (let a = 0; a < cs.length; a++) {
      const dif = []
      for (let b = 0; b < cs.length; b++) if (b !== a) dif.push(cs[a] ^ cs[b])
      let minimo = null
      for (let k = 0; k <= 16 && minimo === null; k++) {
        for (const S of porTamanho[k]) if (dif.every((d) => (d & S) !== 0)) { minimo = k; break }
      }
      dist.set(minimo, (dist.get(minimo) || 0) + 1)
    }
    return [...dist].sort((x, y) => x[0] - y[0])
  })
}

/** Os juizes. */
export function juizes (ns = [2, 4, 6]) {
  return umaVez(`juizes:${ns.join(',')}`, () => ({
    transferencia: ns.map((n) => transferencia(n)),
    bruta: forcaBruta(4)
  }))
}
