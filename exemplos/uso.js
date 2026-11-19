#!/usr/bin/env node
// Exemplo de uso da biblioteca pela porta de entrada do pacote.
//
//   node exemplos/uso.js 6
//
// Conta os binairos n x n com e sem a regra 3 e desenha o primeiro.

import { monta } from '../src/index.js'

const n = Number(process.argv[2] || 6)
let primeira = null
const com = monta(n, { visita: (g) => { if (!primeira) primeira = g } })
const sem = monta(n, { distintas: false })

console.log(`${n}x${n}: ${com.total} binairos (${sem.total} sem a regra das linhas e colunas distintas)`)
console.log('o primeiro:')
for (const linha of primeira) {
  let s = ''
  for (let j = 0; j < n; j++) s += ((linha >> j) & 1) ? '1 ' : '0 '
  console.log('  ' + s)
}
