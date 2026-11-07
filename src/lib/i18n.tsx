import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Lang } from '../puzzles/registry'

const DICT = {
  'nav.start': { pl: 'Start', en: 'Start' },
  'nav.play': { pl: 'Chcę zagrać', en: 'Let me play' },
  'nav.theme': { pl: 'Zmień motyw', en: 'Toggle theme' },
  'nav.finish': { pl: 'Zakończ', en: 'Finish' },
  'hero.eyebrow': { pl: 'Gra w naprawianie plików', en: 'A file-repair puzzle game' },
  'hero.title1': { pl: 'Zepsuty plik.', en: 'A broken file.' },
  'hero.title2': { pl: 'odszyfruj go.', en: 'Decrypt it.' },
  'hero.lede': {
    pl: 'Wgraj dowolny plik, wybierz zagadkę, a strona go zepsuje. Rozwiąż zagadkę, napraw plik własnymi narzędziami i wgraj go z powrotem, żeby wygrać.',
    en: 'Upload any file, pick a puzzle and the site breaks it. Solve the puzzle, repair the file with your own tools and upload it back to win.',
  },
  'drop.title': { pl: 'Upuść plik tutaj', en: 'Drop your file here' },
  'drop.or': { pl: 'albo kliknij, aby wybrać (do ~100 MB, nic nie jest wysyłane)', en: 'or click to choose (up to ~100 MB, nothing is uploaded)' },
  'drop.chosen': { pl: 'Wybrany plik', en: 'Chosen file' },
  'drop.change': { pl: 'Zmień', en: 'Change' },
  'mode.play': { pl: 'Chcę zagrać w grę', en: 'Let me play the game' },
  'mode.playDesc': { pl: 'Wybierz poziom i zagadkę. Dostaniesz zepsuty plik przygotowany przez autora.', en: 'Pick a level and a puzzle. You get a broken file prepared by the author.' },
  'mode.own': { pl: 'Mój plik', en: 'My own file' },
  'mode.ownDesc': { pl: 'Wgraj własny plik, wybierz zagadkę poniżej i pobierz zepsutą wersję.', en: 'Upload your own file, pick a puzzle below and download the broken version.' },
  'pick.eyebrow': { pl: 'Wybierz zagadkę', en: 'Pick a puzzle' },
  'pick.title': { pl: 'Cztery poziomy.', en: 'Four levels.' },
  'pick.title2': { pl: 'Dwadzieścia zagadek.', en: 'Twenty puzzles.' },
  'level.easy': { pl: 'Łatwy', en: 'Easy' },
  'level.medium': { pl: 'Średni', en: 'Medium' },
  'level.hard': { pl: 'Trudny', en: 'Hard' },
  'level.extreme': { pl: 'Ekstremalny', en: 'Extreme' },
  'level.easyDesc': { pl: 'Jeden popularny szyfr, bez łączenia.', en: 'One popular cipher, no chaining.' },
  'level.mediumDesc': { pl: 'Maksymalnie 2 kroki, mniej znane szyfry.', en: 'Up to 2 steps, lesser-known ciphers.' },
  'level.hardDesc': { pl: 'Wiele warstw, linki zewnętrzne, oryginalne zagadki.', en: 'Many layers, external links, original puzzles.' },
  'level.extremeDesc': { pl: 'Jak trudny, ale jeszcze więcej i trudniej.', en: 'Like Hard, but even more and harder.' },
  'layers': { pl: 'warstw', en: 'layers' },
  'soon': { pl: 'Czeka na materiały', en: 'Waiting for assets' },
  'create.generate': { pl: 'Wygeneruj ZIP', en: 'Generate ZIP' },
  'create.working': { pl: 'Przetwarzanie…', en: 'Working…' },
  'create.done': { pl: 'Gotowe. ZIP został pobrany.', en: 'Done. The ZIP was downloaded.' },
  'create.needFile': { pl: 'Najpierw wybierz plik.', en: 'Choose a file first.' },
  'create.contains': { pl: 'ZIP zawiera: zepsuty plik, instructions.txt i check.txt. Podpowiedzi są na stronie.', en: 'The ZIP contains: the broken file, instructions.txt and check.txt. Hints live on this page.' },
  'create.locked': { pl: 'Ta zagadka potrzebuje jeszcze materiałów zewnętrznych:', en: 'This puzzle still needs external assets:' },
  'create.langLabel': { pl: 'Język plików tekstowych w ZIP', en: 'Language of the text files in the ZIP' },
  'create.error': { pl: 'Nie udało się przygotować paczki. Spróbuj ponownie.', en: 'Could not prepare the pack. Try again.' },
  'src.title': { pl: 'Który plik zepsuć?', en: 'Which file should be broken?' },
  'src.author': { pl: 'Plik od autora', en: "Author's file" },
  'src.own': { pl: 'Mój plik', en: 'My file' },
  'src.missing': { pl: 'Autor jeszcze nie dodał pliku dla tego poziomu. Wgraj własny plik.', en: "The author has not added a file for this level yet. Upload your own." },
  'src.noOwn': { pl: 'Wgraj własny plik u góry strony, żeby go użyć.', en: 'Upload your own file at the top of the page to use it.' },
  'hints.title': { pl: 'Podpowiedzi', en: 'Hints' },
  'hints.lede': { pl: 'Kliknij ukrytą podpowiedź, aby ją odsłonić. Od najmniej do najbardziej jasnej.', en: 'Click a hidden hint to reveal it. From vaguest to clearest.' },
  'hints.reveal': { pl: 'Kliknij, aby odsłonić', en: 'Click to reveal' },
  'hints.n': { pl: 'Podpowiedź', en: 'Hint' },
  'hints.repair': { pl: 'Naprawa', en: 'Repair' },
  'hints.ext': { pl: 'Oryginalne rozszerzenie pliku', en: 'Original file extension' },
  'done.title': { pl: 'ZIP pobrany', en: 'ZIP downloaded' },
  'done.text': { pl: 'Rozpakuj paczkę i zacznij od instructions.txt. Gdy naprawisz plik, możesz sprawdzić go w sekcji Zakończ.', en: 'Unpack it and start with instructions.txt. When the file is repaired, you can verify it in the Finish section.' },
  'done.finish': { pl: 'Przejdź do sprawdzenia', en: 'Go to Finish' },
  'done.close': { pl: 'Zamknij', en: 'Close' },
  'finish.optional': { pl: 'To opcjonalne. Wgraj check.txt tylko wtedy, gdy chcesz sprawdzić rozwiązanie na stronie.', en: 'This is optional. Upload check.txt only if you want to verify your solution on the website.' },
  'progress.saved': { pl: 'zapisano jako ukończone w tej przeglądarce', en: 'saved as completed in this browser' },
  'progress.completed': { pl: 'Ukończone', en: 'Completed' },
  'finish.title': { pl: 'Zakończ wyzwanie', en: 'Finish the challenge' },
  'finish.lede': { pl: 'Wgraj naprawiony plik i check.txt z paczki. Wszystko jest sprawdzane lokalnie, nic nie jest wysyłane.', en: 'Upload the repaired file and the check.txt from the pack. Everything is checked locally, nothing is uploaded.' },
  'finish.check': { pl: 'check.txt', en: 'check.txt' },
  'finish.file': { pl: 'Naprawiony plik', en: 'Repaired file' },
  'finish.verify': { pl: 'Sprawdź', en: 'Check' },
  'finish.solved': { pl: 'Rozwiązane!', en: 'Solved!' },
  'finish.solvedExact': { pl: 'Plik jest identyczny z oryginałem.', en: 'The file is identical to the original.' },
  'finish.solvedClose': { pl: 'Zawartość się zgadza (plik zapisany ponownie).', en: 'The content matches (the file was re-saved).' },
  'finish.original': { pl: 'Oryginalna nazwa', en: 'Original name' },
  'finish.no': { pl: 'Jeszcze nie.', en: 'Not yet.' },
  'finish.badCheck': { pl: 'Zła odpowiedź.', en: 'Wrong Answer.' },
  'footer.note': { pl: 'Bez backendu. Twoje pliki nigdy nie opuszczają przeglądarki.', en: 'No backend. Your files never leave your browser.' },
  'nothing': { pl: 'Nic tu nie ma.', en: 'Nothing here.' },
} as const

export type Key = keyof typeof DICT
interface I18n { lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string }
const Ctx = createContext<I18n>(null!)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try { return localStorage.getItem('fdg-lang') === 'en' ? 'en' : 'pl' } catch { return 'pl' }
  })
  const value = useMemo<I18n>(() => ({
    lang,
    setLang: (l) => { setLangState(l); try { localStorage.setItem('fdg-lang', l) } catch { /* ignore */ } },
    t: (k) => DICT[k][lang],
  }), [lang])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export const useI18n = () => useContext(Ctx)
