import { describe, expect, it } from 'vitest'
import { applyChain, undoChain, type Layer } from './corrupt'
import { checkFile, verifyUpload, encodeCheck, decodeCheck } from './check'
import { utf8 } from './hash'

const chains: Layer[][] = [['xor'], ['reverse', 'xor'], ['xor', 'reverse', 'base64']]

describe('corruption', () => {
  it('round-trips every chain on binary data', () => {
    const data = new Uint8Array(5000).map((_, i) => (i * 31 + 7) & 255)
    for (const c of chains) {
      const bad = applyChain(c, data, utf8('midnight'))
      expect(bad).not.toEqual(data)
      expect(undoChain(c, bad, utf8('midnight'))).toEqual(data)
    }
  })
})

describe('finish check', () => {
  it('accepts exact, accepts re-saved text, hints on wrong files', async () => {
    const orig = utf8('hello\nworld\n')
    const check = decodeCheck(encodeCheck(await checkFile(orig, 'a.txt')))!
    expect((await verifyUpload(check, orig, 'a.txt')).status).toBe('solved')
    expect((await verifyUpload(check, utf8('hello\r\nworld'), 'a.txt')).status).toBe('solved')
    const bad = await verifyUpload(check, utf8('xxxxx'), 'a.txt')
    expect(bad.status).toBe('no')
    expect(bad.status === 'no' && bad.hint).toBeTruthy()
  })
})
