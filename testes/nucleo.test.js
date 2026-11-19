import test from 'node:test'
import assert from 'node:assert/strict'

import { linhasValidas, bits, temTrio, colunas, ehBinairo, monta, simetrias, chave } from '../src/binairo.js'

test('linhas validas de 4: as 6 equilibradas, nenhuma com trio', () => {
  assert.equal(linhasValidas(4).length, 6)
  assert.deepEqual([4, 6, 8, 10].map((n) => linhasValidas(n).length), [6, 14, 34, 84])
})

test('trio: 0111 tem, 0110 nao tem', () => {
  assert.equal(temTrio(0b1110, 4), true)
  assert.equal(temTrio(0b0110, 4), false)
})

test('uma grade 4x4 valida passa, e com duas linhas iguais nao passa', () => {
  const boa = [0b0011, 0b1100, 0b0101, 0b1010]
  assert.equal(ehBinairo(boa, 4), true)
  const repetida = [0b0011, 0b0011, 0b1100, 0b1100]
  assert.equal(ehBinairo(repetida, 4), false)
})

test('as colunas da grade sao lidas certo', () => {
  assert.deepEqual(colunas([0b0011, 0b1100, 0b0101, 0b1010], 4), [0b0101, 0b1001, 0b0110, 0b1010])
})

test('toda grade montada passa na definicao, e sao distintas', () => {
  const vistas = new Set()
  monta(4, { visita: (g) => { assert.equal(ehBinairo(g, 4), true); vistas.add(chave(g)) } })
  assert.equal(vistas.size, 72)
})

test('com a regra 3 sao 72; sem ela, 90', () => {
  assert.equal(monta(4).total, 72)
  assert.equal(monta(4, { distintas: false }).total, 90)
})

test('as 16 simetrias levam binairo em binairo', () => {
  const g = [0b0011, 0b1100, 0b0101, 0b1010]
  const sims = simetrias(4)
  assert.equal(sims.length, 16)
  for (const s of sims) assert.equal(ehBinairo(s(g), 4), true)
})

test('contar bits bate com o braco', () => {
  assert.equal(bits(0b101101), 4)
  assert.equal(bits(0), 0)
})
