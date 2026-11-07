// Reversible corruption layers. Every layer has a matching repair a player can do with outside tools.
export type Layer = 'xor' | 'reverse' | 'base64'

export const xorBytes = (data: Uint8Array, key: Uint8Array): Uint8Array => {
  const out = new Uint8Array(data.length)
  for (let i = 0; i < data.length; i++) out[i] = data[i] ^ key[i % key.length]
  return out
}

const reverseBytes = (data: Uint8Array) => new Uint8Array(data).reverse()

const toBase64 = (data: Uint8Array): Uint8Array => {
  const chunk = 0x8000
  let s = ''
  for (let i = 0; i < data.length; i += chunk) s += String.fromCharCode(...data.subarray(i, i + chunk))
  return new TextEncoder().encode(btoa(s))
}

const fromBase64 = (data: Uint8Array): Uint8Array => {
  const s = atob(new TextDecoder().decode(data).replace(/\s+/g, ''))
  const out = new Uint8Array(s.length)
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i)
  return out
}

export function applyLayer(layer: Layer, data: Uint8Array, key: Uint8Array): Uint8Array {
  if (layer === 'xor') return xorBytes(data, key)
  if (layer === 'reverse') return reverseBytes(data)
  return toBase64(data)
}

export function undoLayer(layer: Layer, data: Uint8Array, key: Uint8Array): Uint8Array {
  if (layer === 'xor') return xorBytes(data, key)
  if (layer === 'reverse') return reverseBytes(data)
  return fromBase64(data)
}

export const applyChain = (layers: Layer[], data: Uint8Array, key: Uint8Array) =>
  layers.reduce((d, l) => applyLayer(l, d, key), data)

export const undoChain = (layers: Layer[], data: Uint8Array, key: Uint8Array) =>
  [...layers].reverse().reduce((d, l) => undoLayer(l, d, key), data)
