import { LINKS } from './links'
import { TOKENS } from './tokens'

export type Level = 'easy' | 'medium' | 'hard' | 'extreme'
export type Lang = 'pl' | 'en'

export interface Ctx {
  L: Record<string, string> // external links filled in links.ts
  site: string // app URL up to and including "#"
  path: (p: string) => string // full URL of a hidden page
}

export interface Puzzle {
  id: string
  level: Level
  name: string
  teaser: Record<Lang, string>
  layers: number
  external: string[]
  answer: string // the fixed key; the file is locked with it
  needs: string[] // keys in links.ts that must be filled before the puzzle can be generated
  start: (c: Ctx) => string // text the player starts with
  hints: [string, string, string]
}

const atbash = (s: string) => s.replace(/[a-z]/g, (c) => String.fromCharCode(219 - c.charCodeAt(0)))
const binary = (s: string) => [...s].map((c) => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ')
const b64 = (s: string) => btoa(s)

export const PUZZLES: Puzzle[] = [
  // ---------- EASY ----------
  {
    id: 'e1', level: 'easy', name: 'Mirror Whisper', layers: 1, external: [], answer: 'midnight', needs: [],
    teaser: { en: 'A line of gibberish that makes sense in a mirror.', pl: 'Dziwny tekst, który ma sens w lustrze.' },
    start: () => 'Some words only make sense in a mirror.\n\nGSV PVB RH NRWMRTSG',
    hints: ['The alphabet can be read backwards too.', 'A becomes Z, B becomes Y.', 'Search dCode for "Atbash".'],
  },
  {
    id: 'e2', level: 'easy', name: 'Radio Static', layers: 1, external: ['YouTube'], answer: 'lantern', needs: ['e2_youtube'],
    teaser: { en: 'A radio hides beeps under the noise.', pl: 'Radio ukrywa sygnały pod szumem.' },
    start: (c) => `Tune in: ${c.L.e2_youtube}\nListen past the noise.`,
    hints: ["The static isn't the message. The beeps are.", 'Short and long beeps.', 'Morse code. Slow the video to 0.5x if needed.'],
  },
  {
    id: 'e3', level: 'easy', name: 'Distress Coordinates', layers: 1, external: [], answer: 'pinecone', needs: [],
    teaser: { en: 'A distress call with strange coordinates.', pl: 'Sygnał SOS z dziwnymi współrzędnymi.' },
    start: () => 'SOS. TRAPPED IN ANOTHER DIMENSION. SEND HELP.\nCOORDINATES: 16,9,14,5,3,15,14,5',
    hints: ['These coordinates never go above 26.', 'How many letters are in the alphabet?', 'A=1, B=2…'],
  },
  {
    id: 'e4', level: 'easy', name: 'Lab Notes', layers: 1, external: [], answer: 'chocolate', needs: [],
    teaser: { en: 'Numbers on a lab shelf. Not weights.', pl: 'Liczby z laboratorium. To nie są wagi.' },
    start: () => 'LAB NOTES, shelf 7\nSamples, in order: 6 - 1 - 8 - 6 - 8 - 57 - 52\nWrite down what each sample IS, not what it weighs.',
    hints: ['These are not weights. They are positions in a famous table.', 'Chemistry.', 'Atomic number → element symbol.'],
  },
  {
    id: 'e5', level: 'easy', name: 'Two Letters Only', layers: 1, external: ['Pastebin'], answer: 'harvest', needs: ['e5_pastebin'],
    teaser: { en: 'Only A and B, in groups of five.', pl: 'Tylko A i B, w grupach po pięć.' },
    start: (c) => `Everything you need is here: ${c.L.e5_pastebin}`,
    hints: ['Only two symbols, always in groups of five.', "The paste's title is a breakfast hint.", 'Bacon cipher, the version where every letter is different.'],
  },
  // ---------- MEDIUM ----------
  {
    id: 'm1', level: 'medium', name: 'Colour Key', layers: 2, external: ['Imgur'], answer: 'foxglove', needs: ['m1_imgur'],
    teaser: { en: 'A painted key and a lock.', pl: 'Namalowany klucz i zamek.' },
    start: (c) => `The key is painted: ${c.L.m1_imgur}\nThe lock:  VVT PRJYSG XW WQLVASMG`,
    hints: ['Each letter of the key is a small block of 6 colours.', 'Search for a colour-based cipher on dCode ("Hexahue").', 'Once you have a word key, try the most famous keyed cipher.'],
  },
  {
    id: 'm2', level: 'medium', name: 'Grandmaster Lock', layers: 2, external: ['Imgur'], answer: 'wildfire', needs: ['m2_imgur'],
    teaser: { en: "A chess master's notes, locked with numbers.", pl: 'Notatki szachisty zamknięte liczbami.' },
    start: (c) => `A grandmaster left their notes: ${c.L.m2_imgur}\n"Every letter has its square. Every square has two numbers."\nLocked note:  AJJ SFE LW YNSFKQSK`,
    hints: ['Read the letters in alphabetical order and write each square as two numbers.', 'The file letter is a number too (a=1).', 'A Vigenère cipher whose key is digits has its own name.'],
  },
  {
    id: 'm3', level: 'medium', name: 'Shifted Statistics', layers: 2, external: [], answer: 'beacon', needs: [],
    teaser: { en: 'A shifted word and six lines of numbers.', pl: 'Przesunięte słowo i sześć linii liczb.' },
    start: () => 'shift into the decryption: ccch\n(the last letter is always five ahead of the others)\n\n1)  0  1  2  2  3  4\n2)  9  2  5  7  1\n3)  4  1  7  1  9  1  3\n4) 12 10 13 11 10\n5) 10 20 15  5 25\n6) 21  3 14 40  9',
    hints: ['ccch is four words, shortened to first letters, then shifted.', 'Think of a maths class about averages.', 'Mean, median, mode, range, then start over. The six results are numbers; the alphabet has a count too.'],
  },
  {
    id: 'm4', level: 'medium', name: 'The Sonnet Index', layers: 2, external: ['Pastebin'], answer: 'bloom', needs: ['m4_pastebin'],
    teaser: { en: "A poet's index in a paste.", pl: 'Indeks poety w pastebinie.' },
    start: (c) => `A poet's index: ${c.L.m4_pastebin}`,
    hints: ['Who wrote exactly 154 of something?', 'Poems with 14 lines.', "Shakespeare's sonnets: first letter of each one's first line."],
  },
  {
    id: 'm5', level: 'medium', name: 'Two Locks One Key', layers: 2, external: ['Pastebin'], answer: 'tidepool', needs: ['m5_pastebin'],
    teaser: { en: 'A locked paste and the same key twice.', pl: 'Zablokowany paste i ten sam klucz dwa razy.' },
    start: (c) => `Locked: ${c.L.m5_pastebin}\n9 2 19 3 16 19   (Z26 -1)\nSurely the keys are the same for both locks, right?`,
    hints: ['"Z26 -1" is an instruction for the numbers.', 'The paste password is lowercase.', 'Sir Francis Beaufort. Use the same key again.'],
  },
  // ---------- HARD ----------
  {
    id: 'h1', level: 'hard', name: 'Paper Trail', layers: 6, external: ['Mediafire'], answer: 'papertrail', needs: ['h1_mediafire_first_id'],
    teaser: { en: 'A chain of text files, each decoding to the next.', pl: 'Łańcuch plików tekstowych, każdy prowadzi do następnego.' },
    start: (c) => `Follow the paper: file/${c.L.h1_mediafire_first_id}`,
    hints: ["Every file's text tells you which cipher to use. Look for lines starting with HINT: or KEY:, and at odd capital letters or puns.", 'Mediafire links end with an ID; that is what every file decrypts to.', 'File 3: Pokémon number 184. File 5: count the repeated word.'],
  },
  {
    id: 'h2', level: 'hard', name: 'Heavenfall Trio', layers: 4, external: ['YouTube', 'Pastebin', 'Imgur'], answer: 'tideglassmoon',
    needs: ['h2_youtube_channel', 'h2_pastebin', 'h2_imgur'],
    teaser: { en: 'Three rooms, three words, one order.', pl: 'Trzy pokoje, trzy słowa, jedna kolejność.' },
    start: (c) => `Three rooms. Three words. Join them in this order.\nI.   ${c.L.h2_youtube_channel}\nII.  ${c.L.h2_pastebin}\nIII. ${c.L.h2_imgur}`,
    hints: ['Room I: something about the text is *wrong*, and some words are wrong too.', 'Room I: correct = 0, wrong = 1, eight words per letter. Room II: breakfast, and every letter has its own code.', 'Room III: the image is not empty. Turn the brightness up.'],
  },
  {
    id: 'h3', level: 'hard', name: 'Amber Terminal', layers: 5, external: ['Imgur'], answer: 'lighthouse', needs: ['h3_imgur'],
    teaser: { en: 'A hidden door on this site, read in a mirror.', pl: 'Ukryte drzwi na tej stronie, czytane w lustrze.' },
    start: (c) => `A door is hidden on the site:  ${c.site}/s/${atbash(TOKENS.terminal)}\n(the last part is read in a mirror)`,
    hints: ['The path is mirrored. Then ask the terminal for help.', 'The help text is shifted by ten. Look at the page itself for the first command.', 'The keyboard under your hands is the alphabet for the condensed message.'],
  },
  {
    id: 'h4', level: 'hard', name: 'Three Rows', layers: 5, external: ['Imgur', 'Pastebin', 'YouTube'], answer: 'quartz',
    needs: ['h4_imgur', 'h4_pastebin', 'h4_youtube'],
    teaser: { en: 'Fill three rows from three sources.', pl: 'Wypełnij trzy rzędy z trzech źródeł.' },
    start: (c) => `Fill the rows: ${c.path(TOKENS.rows)}\nThe board knows the password: ${c.L.h4_imgur}\nThe paste: ${c.L.h4_pastebin}`,
    hints: ['Each letter on the board is a square, and each square is two numbers.', 'The symbols +-<>[]. are a programming language with a rude name.', 'Change the caption language. For row 3: rows 1 and 2 never put black in the same column, so row 3 fills the empty columns.'],
  },
  {
    id: 'h5', level: 'hard', name: 'Tomb Raider', layers: 6, external: ['Pastebin'], answer: 'sandstorm', needs: ['h5_pastebin', 'h5_pastebin2'],
    teaser: { en: "An explorer's diary and a pyramid.", pl: 'Dziennik odkrywcy i piramida.' },
    start: (c) => `An explorer's diary: ${c.L.h5_pastebin}\n(the tomb wall lives here: ${c.path(TOKENS.pyramid)}/tombraider)`,
    hints: ["The paste's body is shifted by three.", 'The paste title is a file name, locked with the key (the classic keyed cipher).', 'The carvings are in three different encodings. Put the three decoded words after the site address, in the riddle\'s order. The last page uses runes.'],
  },
  // ---------- EXTREME ----------
  {
    id: 'x1', level: 'extreme', name: 'The Chain', layers: 11, external: [], answer: 'starlight', needs: ['x1_gif', 'x1_mp3', 'x1_sky'],
    teaser: { en: 'Ten web levels. Every answer is the next door.', pl: 'Dziesięć poziomów. Każda odpowiedź to kolejne drzwi.' },
    start: (c) => `${c.path(TOKENS.chain)}/begin\nEvery answer is a door. Type it where the last word of the address is.\nStuck? ${c.path(TOKENS.chain)}/rules`,
    hints: ['Every answer goes into the address bar. Your browser developer tools are allowed and expected.', 'Pages have more than what you see: source, styles, console, file names, metadata.', 'Read the rules page carefully; one level uses it as a book, counting letters only.'],
  },
  {
    id: 'x2', level: 'extreme', name: 'Year Wheel', layers: 12, external: [], answer: 'solstice', needs: ['x2_leaf'],
    teaser: { en: 'The year splits in three. Read it back by column.', pl: 'Rok dzieli się na trzy. Odczytaj kolumnami.' },
    start: (c) => `The year turns here: ${c.path(TOKENS.year)}\nThree seasons, three codes. The year comes round the way you read a column.`,
    hints: ['Each season has its own path. The source code and file names matter more than the pictures.', 'Autumn: comments in CSS; pixels are numbers. Spring: divisibility, then dots. Winter: the page language.', 'Final: write the three codes on top of each other, then read the columns.'],
  },
  {
    id: 'x3', level: 'extreme', name: 'The Vault', layers: 7, external: ['Imgur'], answer: 'chronos', needs: ['x3_imgur_rainbow', 'x3_imgur_mayan'],
    teaser: { en: 'Six locks and a door of time.', pl: 'Sześć zamków i drzwi czasu.' },
    start: (c) => `The vault is here: ${c.path(TOKENS.vault)}\nSix locks. Time is the seventh.`,
    hints: ['Each module is self-contained; solve them in any order.', 'Module 2 is the alphabet in groups of three. Module 3 is a famous unsolved maths problem.', 'Module 4 is a real clock in Berlin. Module 5 is an ancient American number system.'],
  },
  {
    id: 'x4', level: 'extreme', name: 'Glyphic Archive', layers: 7, external: ['Mediafire'], answer: '11294201', needs: ['x4_mediafire'],
    teaser: { en: 'A black image heavier than it should be.', pl: 'Czarny obraz cięższy, niż powinien być.' },
    start: (c) => binary(c.L.x4_mediafire),
    hints: ['The two number lines in HINT.txt belong together: one tells you how to read the other.', 'The black image is heavier than a black image should be.', 'Compare shapes, not colours. Then use a colour picker.'],
  },
  {
    id: 'x5', level: 'extreme', name: 'Scripture Machine', layers: 8, external: ['Pastebin', 'Imgur'], answer: 'covenant', needs: ['x5_pastebin_1'],
    teaser: { en: 'Kryptos, a clock, a verse and a language from hell.', pl: 'Kryptos, zegar, werset i język z piekła.' },
    start: (c) => `Exodus, Jim Sanborn:\nseg4 (64,74) -> a0z25\n(modern English; join the numbers, no spaces)\n1111\n0000\n11100000000\n0000\n${c.L.x5_pastebin_1}`,
    hints: ['Look up who Jim Sanborn is and what his fourth segment says.', 'The lamps tell the time, and the time is a chapter and verse.', 'Last paste: the eighth circle of Dante\'s Hell names a programming language.'],
  },
]

export const LEVELS: Level[] = ['easy', 'medium', 'hard', 'extreme']
export const byId = (id: string) => PUZZLES.find((p) => p.id === id)
export const missingLinks = (p: Puzzle) => p.needs.filter((k) => !LINKS[k])
export const isReady = (p: Puzzle) => missingLinks(p).length === 0
export { b64 }
