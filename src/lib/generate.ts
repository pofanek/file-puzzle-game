import { applyChain, type Layer } from './corrupt'
import { checkFile, encodeCheck, extOf } from './check'
import { utf8 } from './hash'
import { buildZip, type PackFile } from './zip'
import { LINKS } from '../puzzles/links'
import type { Ctx, Lang, Level, Puzzle } from '../puzzles/registry'

export const CHAINS: Record<Level, { layers: Layer[]; outName: string }> = {
  easy: { layers: ['xor'], outName: 'challenge.locked' },
  medium: { layers: ['xor'], outName: 'challenge.dat' },
  hard: { layers: ['reverse', 'xor'], outName: 'challenge.bin' },
  extreme: { layers: ['xor', 'reverse', 'base64'], outName: 'challenge.txt' },
}

// How the answer is used. Clear on Easy, a riddle on Hard/Extreme (see vault: 04 Corruption and Repair Ideas).
const METHOD: Record<Level, Record<Lang, string>> = {
  easy: {
    en: 'The file was XORed byte by byte with the secret word (lowercase, repeated as many times as needed).',
    pl: 'Plik został zaszyfrowany operacją XOR bajt po bajcie z tajnym słowem (małe litery, powtarzane tyle razy, ile trzeba).',
  },
  medium: {
    en: 'The word is the lock. Every byte of the file was combined with it, over and over. The name is also not what it was.',
    pl: 'Słowo jest zamkiem. Każdy bajt pliku został z nim połączony, w kółko. Nazwa też nie jest oryginalna.',
  },
  hard: {
    en: 'Two coats: the file was turned around, then locked with the word. Last on, first off.',
    pl: 'Dwie warstwy: plik został odwrócony, a potem zamknięty słowem. Ostatnie na wierzchu, pierwsze zdejmij.',
  },
  extreme: {
    en: 'Three coats. Last on, first off.',
    pl: 'Trzy warstwy. Ostatnie na wierzchu, pierwsze zdejmij.',
  },
}

export const REPAIR: Record<Level, Record<Lang, string>> = {
  easy: {
    en: 'Repair: XOR the file with the answer (lowercase), then give it back its original name.',
    pl: 'Naprawa: wykonaj XOR pliku z odpowiedzią (małymi literami), potem przywróć oryginalną nazwę.',
  },
  medium: {
    en: 'Repair: XOR the file with the answer (lowercase), then rename it to the original extension.',
    pl: 'Naprawa: wykonaj XOR pliku z odpowiedzią (małymi literami), potem zmień rozszerzenie na oryginalne.',
  },
  hard: {
    en: 'Repair: XOR with the answer (lowercase) first, then reverse the order of all bytes, then use the original extension.',
    pl: 'Naprawa: najpierw XOR z odpowiedzią (małymi literami), potem odwróć kolejność wszystkich bajtów, potem rozszerzenie oryginalne.',
  },
  extreme: {
    en: 'Repair: Base64-decode the text first, then reverse the order of all bytes, then XOR with the answer (lowercase), then use the original extension.',
    pl: 'Naprawa: najpierw zdekoduj Base64, potem odwróć kolejność wszystkich bajtów, potem XOR z odpowiedzią (małymi literami), potem rozszerzenie oryginalne.',
  },
}

export const zipName = (fileName: string) => `${fileName.replace(/\.[^./\\]+$/, '') || fileName}.zip`

export const siteBase = () => location.href.split('#')[0]
export function makeCtx(): Ctx {
  const site = siteBase().replace(/\/$/, "") + "/#"
  return { L: LINKS, site: siteBase().replace(/\/$/, '') + '/#', path: (p) => `${site}/s/${p}` }
}

export async function generatePack(p: Puzzle, fileName: string, bytes: Uint8Array, lang: Lang): Promise<Blob> {
  const ctx = makeCtx()
  const { layers, outName: fixedName } = CHAINS[p.level]
  const outName = p.level === 'easy' ? `${fileName}.locked` : fixedName
  const locked = applyChain(layers, bytes, utf8(p.answer))
  const ext = extOf(fileName) || '(none)'
  const keepExtInfo = p.level === 'easy' || p.level === 'medium'

  const pl = lang === 'pl'
  const instructions = [
    `FILE DECRYPTION GAME — ${p.name} (${p.level.toUpperCase()})`,
    '',
    p.start(ctx),
    '',
    '----',
    pl ? 'Odpowiedź do zagadki jest kluczem do pliku.' : 'The answer to the puzzle is the key to the file.',
    METHOD[p.level][lang],
    keepExtInfo ? (pl ? `Oryginalne rozszerzenie: .${ext}` : `Original extension: .${ext}`) : '',
    '',
    pl ? 'Podpowiedzi są na stronie gry, przy wybranej zagadce.' : 'Hints are on the game website, under the puzzle you picked.',
    pl
      ? 'check.txt jest potrzebny tylko wtedy, gdy chcesz sprawdzić swoje rozwiązanie na stronie. Nie jest z niczym powiązany i nie trzeba go używać.'
      : 'check.txt is only needed if you want to verify your solution on the website. It is not linked to anything and you do not have to use it.',
  ].filter((l, i, a) => !(l === '' && a[i - 1] === '')).join('\n')

  const info = await checkFile(bytes, fileName)
  info.pid = p.id
  const check = encodeCheck(info)
  const files: PackFile[] = [
    { name: outName, data: locked },
    { name: 'instructions.txt', data: instructions + '\n' },
    { name: 'check.txt', data: check + '\n' },
  ]
  return buildZip(files)
}
