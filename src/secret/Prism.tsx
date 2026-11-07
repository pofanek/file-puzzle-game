import { Link, useParams } from 'react-router-dom'
import { LINKS } from '../puzzles/links'
import { Comment, Nothing, Page, useTitle } from './bits'

const GREEN = [
  '#1EFB25 #274E0D #2EC004 #02F223 #0EFF11 #282533 #1F711E #25F507 #03F62D #02540F #3C2B20 #028632 #0D8238 #28C226',
  '#08280B #0F8F12 #02E329 #1A3006 #2A5C02 #287C19 #053808 #04A112 #11DB2F #263F07 #28C006 #202F30 #156F0A #06311E',
  '#247C31 #04DA31 #0F8010 #276F0F #372613 #2FF903 #189F07 #048E17 #258933 #139A3C #035535 #392E1D #35260D #24732D',
].map((r) => r.split(' '))

const COLOURS = ['red', 'crimson', 'scarlet', 'maroon', 'coral', 'salmon', 'amber', 'olive', 'teal', 'navy', 'indigo', 'violet', 'plum', 'ivory', 'khaki', 'sienna', 'umber', 'azure', 'cyan', 'lime']
function colorsTxt(): string {
  let s = 7
  const rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff)
  return Array.from({ length: 7000 }, (_, i) => {
    if (i === 0) return 'rqweiap (1)'
    if (i === 6968) return 'abcdefg: 1101101 1011111 1111110 0110011 .txt'
    return `${COLOURS[rnd() % COLOURS.length]}${rnd() % 97}`
  }).join('\n')
}

function Red({ sub }: { sub: string }) {
  if (sub === 'colors.txt') return <Page><pre className="code mt-8 !whitespace-pre h-[70vh] overflow-auto">{colorsTxt()}</pre></Page>
  if (sub === '2604.txt') return <Page><p className="mono">the code is bkpsou</p></Page>
  return (
    <Page eyebrow="Red">
      <style>{`/* fish */ .fish { opacity: 1; } /* fish */ .fin { color: #c01012; /* fi5h */ } /* fish */`}</style>
      {LINKS.x2_fish && <img src={LINKS.x2_fish} alt="" className="mt-8 rounded-2xl max-w-full" />}
    </Page>
  )
}

function Green({ sub }: { sub: string }) {
  if (['φθόνος.png', 'ζήλια.png', 'ζηλεύω.png'].includes(sub)) return <Page><p className="mono">the code is rermlr</p></Page>
  return (
    <Page eyebrow="Green">
      <Comment text="G % R == 0 or G % B == 0 -> filled" />
      <Comment text="[your result, in a language one letter away from this colour].png" />
      <div className="mt-8 grid gap-1 w-full" style={{ gridTemplateColumns: 'repeat(14, 1fr)' }}>
        {GREEN.flat().map((c, i) => <i key={i} className="aspect-square rounded-sm" style={{ background: c }} title={c} />)}
      </div>
    </Page>
  )
}

function Blue({ sub }: { sub: string }) {
  useTitle('Blue', 'id')
  if (sub === 'email') {
    return (
      <Page eyebrow="Blue">
        <pre className="code mt-8">{'Aug 5, Nov 2, Jul 10, Sep 12, Feb 3\nC. Bigelow & K. Holmes'}</pre>
      </Page>
    )
  }
  if (sub === 'beach.txt') return <Page><p className="mono">the code is onicos</p></Page>
  return (
    <Page eyebrow="Blue">
      <Comment text="outer layer of the tooth" />
      <p className="lede">Selamat datang.</p>
    </Page>
  )
}

export default function Prism() {
  const parts = (useParams()['*'] ?? '').split('/').filter(Boolean).map(decodeURIComponent)
  const [branch, sub = ''] = parts
  if (!branch) {
    return (
      <Page eyebrow="Prism" title="Light splits here">
        <div className="flex gap-3 mt-8">
          {['red', 'green', 'blue'].map((c) => <Link key={c} to={c} className="btn btn-ghost">{c}</Link>)}
        </div>
      </Page>
    )
  }
  if (branch === 'red') return <Red sub={sub} />
  if (branch === 'green') return <Green sub={sub} />
  if (branch === 'blue') return <Blue sub={sub} />
  if (branch === 'brokenprismcolours') return <Page><p className="metal-text text-4xl font-semibold">The light is whole. Your key: spectrum</p></Page>
  return <Nothing />
}
