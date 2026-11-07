# File Decryption Game

https://file-puzzle.pages.dev/

A browser game where **you break a file, then fix it by solving a puzzle**. Upload any file, pick one of 20 handmade puzzles, and the site corrupts your file and packs it into a ZIP together with the start of the puzzle. Solve the puzzle with outside tools (dCode, hex editors, CyberChef...), use the answer to repair the file, and upload it back to prove you won.

Everything runs in your browser. There is no backend, no account and no upload to a server.

> Spoiler warning: the puzzles ship with the client, so the answers can be found in this repository. Play first, read the source after.

## How it works

1. **Pick a file and a puzzle** on the home page (Easy, Medium, Hard or Extreme).
2. The site corrupts the file with layers (XOR with the puzzle's answer, byte reversal, Base64) and downloads a ZIP with:
   - `challenge.*`: the broken file,
   - `instructions.txt`: where the puzzle starts and the exact repair steps once you know the answer,
   - `check.txt`: used only for the final verification.
3. **Solve the puzzle.** Puzzles link out to Pastebin, Imgur, YouTube and Mediafire, or to hidden pages on this site. There are no built-in decoders: use any tool you like. Hints are on the site as spoilers.
4. **Repair the file** with the answer, following `instructions.txt`.
5. **Finish:** upload the repaired file and `check.txt` in the Finish section. The site hashes the file (SHA-256) and compares it with the original, entirely locally.

### Difficulty

| Level | What to expect |
|---|---|
| Easy | One popular cipher, no chaining |
| Medium | Up to two steps, niche ciphers allowed |
| Hard | Several layers, obscure ciphers, external links holding the next step |
| Extreme | More and harder layers, including web puzzles hosted on this site |

There is also a "Let me play" mode that uses a ready-made sample file instead of yours.

## Tech stack

- React 19, TypeScript, Vite 8
- Tailwind CSS v4
- React Router (`HashRouter`, so it works on any static host)
- JSZip for building the download
- Vitest for tests

Everything is client-side: files are processed as `Uint8Array` with the File API.

## Getting started

Requirements: Node.js 20.19+ (or 22+) and npm.

```bash
npm install
npm run dev        # dev server, usually http://localhost:5173
```

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc -b`) and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the Vitest suite (corruption round-trips and the finish check) |

## Project structure

```
src/
  lib/          corruption layers, ZIP generation, finish check, i18n (EN default, PL)
  puzzles/      puzzle registry, external asset links, hidden-page tokens
  pages/        home page (puzzle picker, hints, Finish) and the hidden-page router
  secret/       hidden puzzle pages (Terminal, Rows, Pyramid, Chain, Year, Vault)
  components/   shared UI
public/
  samples/      ready-made files for "Let me play"
  x1/ x2/ x3/   media used by the Extreme puzzles
```

### Adding or changing puzzle assets

External assets (Pastebin, Imgur, YouTube, Mediafire links, and files hosted in `public/`) are listed in `src/puzzles/links.ts`. A puzzle stays disabled on the site until all the links it needs are filled in.

Hidden pages live at random URLs generated in `src/puzzles/tokens.ts`; unknown addresses show the same plain 404 page.

## Deployment

The build is a static site (`base: './'`, `HashRouter`), so it works on GitHub Pages, Cloudflare Pages, Netlify or any static host with no redirect rules.

**Cloudflare Pages:** connect the repository and set
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variable: `NODE_VERSION` = `22`

You can also deploy the built folder directly: `npm run build && npx wrangler pages deploy dist`.

## Design

Dark, metallic, glassy interface with slow-drifting diagonal stripes, a floating pill navigation, and animations that respect `prefers-reduced-motion`. Light theme is available through `data-theme="light"` on `<html>`.

## License

MIT. See [LICENSE](LICENSE).
