// Os numeros do README, presos. (Ate 6x6 aqui; o 8x8 no arquivo pesado.)

import test from 'node:test'
import assert from 'node:assert/strict'

import { contagem, classes, dicasMinimas4, juizes } from '../src/medidas.js'

test('com e sem a regra 3, de 2x2 a 6x6', () => {
  const c = contagem([2, 4, 6])
  assert.deepEqual(c.map((l) => l.com), [2, 72, 4140])
  assert.deepEqual(c.map((l) => l.sem), [2, 90, 11222])
})

test('a regra 3 corta 20% no 4x4 e 63,11% no 6x6', () => {
  const c = contagem([2, 4, 6])
  assert.equal(c[0].corta, 0)
  assert.equal((c[1].corta * 100).toFixed(2), '20.00')
  assert.equal((c[2].corta * 100).toFixed(2), '63.11')
})

test('10 classes no 4x4 e 321 no 6x6, com Burnside conferindo', () => {
  assert.deepEqual(classes(4), { n: 4, grades: 72, classes: 10, burnside: 10 })
  assert.deepEqual(classes(6), { n: 6, grades: 4140, classes: 321, burnside: 321 })
})

test('toda grade 4x4 precisa de exatamente 4 dicas', () => {
  assert.deepEqual(dicasMinimas4(), [[4, 72]])
})

test('a transferencia: 2, 90, 11.222', () => {
  assert.deepEqual(juizes().transferencia.map((t) => t.total), [2, 90, 11222])
})
