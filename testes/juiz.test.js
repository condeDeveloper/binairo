import test from 'node:test'
import assert from 'node:assert/strict'

import { monta } from '../src/binairo.js'
import { transferencia, forcaBruta } from '../src/juiz.js'

test('a transferencia conta o mesmo que a montagem sem a regra 3', () => {
  for (const n of [2, 4, 6]) assert.equal(transferencia(n).total, monta(n, { distintas: false }).total, `n=${n}`)
})

test('a transferencia NAO conhece a regra 3: ela da mais que a montagem completa', () => {
  // Um juiz que concordasse com a contagem COM a regra 3 estaria medindo outra
  // coisa: a regra 3 e global e nao cabe no estado por coluna.
  assert.ok(transferencia(6).total > monta(6).total)
})

test('a forca bruta acha 72 em 65.536 grades', () => {
  const b = forcaBruta(4)
  assert.equal(b.testadas, 65536)
  assert.equal(b.achadas, 72)
})

test('a forca bruta se cala onde nao alcanca', () => {
  assert.equal(forcaBruta(6).completa, false)
})
