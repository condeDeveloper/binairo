#!/usr/bin/env node
// O medidor. Roda as tabelas e cospe os numeros que vao para o README.
//
//   node ferramentas/medidor.js            todas (ate 6x6)
//   node ferramentas/medidor.js contagem   com e sem a regra 3
//   node ferramentas/medidor.js classes    as classes pelas 16 simetrias
//   node ferramentas/medidor.js dicas      as dicas minimas de cada 4x4
//   node ferramentas/medidor.js juizes     a transferencia e a forca bruta
//   node ferramentas/medidor.js oito       a contagem do 8x8 (~2,5 min)

import { contagem, classes, dicasMinimas4, juizes } from '../src/medidas.js'
import { transferencia } from '../src/juiz.js'

const n = (x) => x.toLocaleString('pt-BR')
const pad = (s, w) => String(s).padStart(w)

function tContagem (ns) {
  console.log('\n== grades com e sem a regra 3 (nada repetido) ==')
  for (const l of contagem(ns)) console.log(`   ${l.n}x${l.n}  ${pad(l.linhasValidas, 2)} linhas validas   regras 1 e 2: ${pad(n(l.sem), 10)}   as tres: ${pad(n(l.com), 9)}   a regra 3 corta ${(l.corta * 100).toFixed(2)}%`)
}

function tClasses () {
  console.log('\n== classes pelas 16 simetrias (quadrado x trocar 0 por 1) ==')
  for (const k of [4, 6]) {
    const c = classes(k)
    console.log(`   ${k}x${k}  ${n(c.grades)} grades em ${c.classes} classes   Burnside: ${c.burnside}`)
  }
}

function tDicas () {
  console.log('\n== o menor numero de dicas que determina cada 4x4 ==')
  for (const [k, q] of dicasMinimas4()) console.log(`   ${k} dicas: ${q} grades`)
}

function tJuizes () {
  const j = juizes()
  console.log('\n== a transferencia por colunas (regras 1 e 2, sem montar grade) ==')
  for (const t of j.transferencia) console.log(`   ${t.n}x${t.n}  ${pad(n(t.total), 9)}   (maior mapa de estados: ${n(t.maiorMapa)})`)
  console.log(`\n== a forca bruta: ${n(j.bruta.testadas)} grades 4x4, ${j.bruta.achadas} binairos ==`)
}

const partes = {
  contagem: () => tContagem([2, 4, 6]), classes: tClasses, dicas: tDicas, juizes: tJuizes,
  oito: () => { tContagem([8]); const t = transferencia(8); console.log(`   transferencia 8x8: ${n(t.total)}`) }
}
const pedido = process.argv[2]
if (!pedido) { partes.contagem(); tClasses(); tDicas(); tJuizes() } else if (partes[pedido]) partes[pedido]()
else { console.error(`nao conheco "${pedido}". conheco: ${Object.keys(partes).join(', ')}`); process.exit(1) }
