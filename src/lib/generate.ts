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

// Exact repair steps per level. They go into instructions.txt and are also shown on the site as the "Repair" hint.
const REPAIR_STEPS: Record<Level, Record<Lang, string>> = {
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

const CYBERCHEF = 'https://gchq.github.io/CyberChef/'
const OPS: Record<Level, string> = { easy: 'XOR', medium: 'XOR', hard: 'XOR, Reverse', extreme: 'From Base64, Reverse, XOR' }

// Steps plus the tool that does them. This text goes into instructions.txt and the site's "Repair" hint.
export const REPAIR: Record<Level, Record<Lang, string>> = Object.fromEntries(
  (Object.keys(REPAIR_STEPS) as Level[]).map((lv) => [lv, {
    en: `${REPAIR_STEPS[lv].en}\nTool: CyberChef, ${CYBERCHEF} (operations: ${OPS[lv]}). Load your file as input, type the answer as the key (format UTF8) and save the output as a file.`,
    pl: `${REPAIR_STEPS[lv].pl}\nNarzędzie: CyberChef, ${CYBERCHEF} (operacje: ${OPS[lv]}). Wczytaj plik jako wejście, wpisz odpowiedź jako klucz (format UTF8) i zapisz wynik jako plik.`,
  }]),
) as Record<Level, Record<Lang, string>>

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
    REPAIR[p.level][lang],
    keepExtInfo ? (pl ? `Oryginalne rozszerzenie: .${ext}` : `Original extension: .${ext}`) : '',
    keepExtInfo
      ? ''
      : pl
        ? 'Nie znasz oryginalnego rozszerzenia? Otwórz naprawiony plik w edytorze hex i sprawdź pierwsze bajty (sygnatura pliku), np. 89 50 4E 47 = PNG, FF D8 FF = JPG, 25 50 44 46 = PDF, 50 4B 03 04 = ZIP/DOCX/XLSX, 47 49 46 38 = GIF. Pliki tekstowe nie mają sygnatury: otwórz je jako tekst (.txt).'
        : 'Do not know the original extension? Open the repaired file in a hex viewer and look at the first bytes (the file signature), e.g. 89 50 4E 47 = PNG, FF D8 FF = JPG, 25 50 44 46 = PDF, 50 4B 03 04 = ZIP/DOCX/XLSX, 47 49 46 38 = GIF. Plain text has no signature: open it as text (.txt).',
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
