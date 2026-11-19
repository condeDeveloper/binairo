// O caro: o 8x8 inteiro, pela montagem e pela transferencia.

import test from 'node:test'
import assert from 'node:assert/strict'

import { monta } from '../src/binairo.js'
import { transferencia } from '../src/juiz.js'

let cache = null
function oito () {
  if (!cache) cache = { com: monta(8).total, transf: transferencia(8).total }
  return cache
}

test('8x8: 4.111.116 binairos', { timeout: 900000 }, () => {
  assert.equal(oito().com, 4111116)
})

test('8x8 sem a regra 3, pela transferencia: 12.413.918', { timeout: 900000 }, () => {
  assert.equal(oito().transf, 12413918)
})

test('no 8x8 a regra 3 corta 66,88%', { timeout: 900000 }, () => {
  const c = oito()
  assert.equal(((1 - c.com / c.transf) * 100).toFixed(2), '66.88')
})
