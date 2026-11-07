import { sha256Hex, utf8 } from './hash'

// check.txt: "FDG1." + base64(JSON). Holds only hashes and sizes of the ORIGINAL file, never its content.
export interface Check {
  v: 1
  name: string
  size: number
  sha256: string
  kind: 'text' | 'image' | 'other'
  textSha?: string // sha256 of normalised text (re-saved text files still count)
  pixelSha?: string // sha256 of decoded RGBA pixels (re-saved images still count)
  head: string // sha256 of first 16 bytes, used for the "header looks right" hint
  pid?: string // puzzle id the pack was made for (lets Finish record progress)
}

const TEXT_EXT = ['txt', 'md', 'csv', 'json', 'html', 'htm', 'xml', 'log', 'js', 'ts', 'py', 'css', 'ini', 'yml', 'yaml', 'tsv']
const IMAGE_EXT = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp']
export const extOf = (name: string) => (name.includes('.') ? name.split('.').pop()!.toLowerCase() : '')

export function normaliseText(bytes: Uint8Array): string | null {
  try {
    const s = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    return s.replace(/^﻿/, '').replace(/\r\n?/g, '\n').split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').replace(/\s+$/, '')
  } catch {
    return null
  }
}

async function pixelHash(bytes: Uint8Array, name: string): Promise<string | null> {
  if (typeof createImageBitmap === 'undefined' || typeof document === 'undefined') return null
  try {
    const mime = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', bmp: 'image/bmp' }[extOf(name)] ?? ''
    const bmp = await createImageBitmap(new Blob([new Uint8Array(bytes)], { type: mime }))
    const c = document.createElement('canvas')
    c.width = bmp.width
    c.height = bmp.height
    const ctx = c.getContext('2d')!
    ctx.drawImage(bmp, 0, 0)
    const px = ctx.getImageData(0, 0, c.width, c.height).data
    return `${c.width}x${c.height}:` + (await sha256Hex(new Uint8Array(px.buffer)))
  } catch {
    return null
  }
}

export async function checkFile(bytes: Uint8Array, name: string): Promise<Check> {
  const ext = extOf(name)
  const text = TEXT_EXT.includes(ext) ? normaliseText(bytes) : null
  const check: Check = {
    v: 1, name, size: bytes.length, sha256: await sha256Hex(bytes), kind: 'other',
    head: await sha256Hex(bytes.subarray(0, 16)),
  }
  if (text !== null) {
    check.kind = 'text'
    check.textSha = await sha256Hex(utf8(text))
  } else if (IMAGE_EXT.includes(ext)) {
    check.kind = 'image'
    const p = await pixelHash(bytes, name)
    if (p) check.pixelSha = p
  }
  return check
}

export const encodeCheck = (c: Check) => 'FDG1.' + btoa(String.fromCharCode(...utf8(JSON.stringify(c))))

export function decodeCheck(s: string): Check | null {
  try {
    const raw = s.trim()
    if (!raw.startsWith('FDG1.')) return null
    const bin = atob(raw.slice(5))
    const json = new TextDecoder().decode(Uint8Array.from(bin, (ch) => ch.charCodeAt(0)))
    const c = JSON.parse(json) as Check
    return c.v === 1 && c.sha256 ? c : null
  } catch {
    return null
  }
}

export type Verdict =
  | { status: 'solved'; exact: boolean; originalName: string; puzzleId?: string }
  | { status: 'no'; hint: string }

// Hints stay vague on purpose: they say what is off, not how to fix it.
export async function verifyUpload(check: Check, bytes: Uint8Array, name: string): Promise<Verdict> {
  if ((await sha256Hex(bytes)) === check.sha256) return { status: 'solved', exact: true, originalName: check.name, puzzleId: check.pid }
  if (check.kind === 'text' && check.textSha) {
    const t = normaliseText(bytes)
    if (t !== null && (await sha256Hex(utf8(t))) === check.textSha) return { status: 'solved', exact: false, originalName: check.name, puzzleId: check.pid }
  }
  if (check.kind === 'image' && check.pixelSha) {
    const p = await pixelHash(bytes, name)
    if (p && p === check.pixelSha) return { status: 'solved', exact: false, originalName: check.name, puzzleId: check.pid }
  }
  let hint = 'same size, but the content is still different'
  if (bytes.length < check.size) hint = 'the file is smaller than the original'
  else if (bytes.length > check.size) hint = 'the file is larger than the original'
  else if ((await sha256Hex(bytes.subarray(0, 16))) !== check.head) hint = 'same size, but the beginning of the file is wrong'
  if (extOf(name) !== extOf(check.name)) hint += '; the extension is not the original one'
  return { status: 'no', hint }
}
