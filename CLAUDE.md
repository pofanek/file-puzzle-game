# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status

The app is scaffolded (Vite + React 19 + TypeScript + Tailwind v4). Name: **File Decryption Game**. Hosting: GitHub Pages, `HashRouter`, `base: './'`.

Commands: `npm run dev`, `npm run build` (runs `tsc -b` then `vite build`), `npm test` (Vitest; `src/lib/corrupt.test.ts` covers corruption round-trips and the finish check).

## Code map
- `src/lib/`: `corrupt.ts` (reversible layers xor / reverse / base64), `generate.ts` (builds the ZIP: broken file, `instructions.txt`, `check.txt`; hints are shown on the site as spoilers, not in the ZIP; chain per difficulty in `CHAINS`), `check.ts` (check.txt format `FDG1.<base64 json>` and the Finish verdict, with re-saved text/image tolerance and vague hints), `i18n.tsx` (PL default, EN), `zip.ts`.
- `src/puzzles/registry.ts`: the 20 puzzles (answer = key). `links.ts`: external assets the owner must create; a puzzle stays disabled until its `needs` keys are filled. `tokens.ts`: random slugs of the hidden pages.
- `src/pages/`: Start (home: mode cards, level tabs, puzzle panel with source choice and spoiler hints, plus the `FinishSection`), Secret (token router). Author originals for "Let me play" go in `public/samples/` with `index.json` mapping level to file name, e.g. `{"easy":"easy.txt"}`. Difficulty colours come from `data-level` (`--c`). Light theme via `data-theme="light"` on `<html>`. `src/secret/`: hidden puzzle pages (Terminal, Rows, Pyramid, Chain, Year, Vault). Unknown tokens and paths render the same "404" page.
- Tailwind v4 gotcha: global resets must stay inside `@layer base`, or they override utility classes.

## Where the design lives

The plan is kept in an Obsidian vault **outside this repo**: `/mnt/games/Obsidian_Notes/Puzzle_game`. Read it before designing or building anything:
- `00 Home.md`: index of all notes
- `01 Project Overview.md`, `02 Site Structure.md`, `05 Tech Stack.md`: what the app is and how it is built
- `03 Difficulty Levels.md`, `04 Corruption and Repair Ideas.md`: puzzle rules and file-corruption building blocks
- `06 Open Questions.md`: decisions still open; ask instead of guessing
- `07 Puzzles/`: puzzle research (`Inspirations/`) and one folder per difficulty (`Easy/ Medium/ Hard/ Extreme/`). New puzzle designs go there as one note per puzzle.

`prompt.txt` in the repo root is the user's running log of their requests, not a spec.

## What is being built

A website where **anyone** (no accounts, no admin) can create a puzzle in one of two ways: upload their own file and pick a difficulty and an ordered chain of puzzle templates, or take a **ready-made** broken sample file. The site **corrupts** the file (extension swap, XOR, byte shift, damaged headers, shuffled chunks…), generates `instructions.txt`, `hints.txt` and `check.txt`, and downloads everything as a ZIP. A **player** repairs the file by hand with outside tools (hex editors, dCode), sometimes guided to puzzle sub-pages on the same site, then **uploads the repaired file on a Finish page**, which hashes it (SHA-256) and compares it with the original's hash in `check.txt`.

Planned stack (from the vault): React + TypeScript + Tailwind, Vite SPA, static hosting, **no backend**. All processing runs client-side on `Uint8Array` with the File API, ZIP via a browser library such as JSZip, files up to about 100 MB. Puzzle logic ships to the client, and spoilers are accepted.

## Puzzle rules

- Difficulty: **Easy** = one popular cipher with no chaining. **Medium** = at most 2 steps, niche ciphers allowed. **Hard** = multiple layers, obscure ciphers, external links (Pastebin, Imgur, YouTube, Mediafire, MEGA, Gyazo, Discord) holding the next step. **Extreme** = like Hard but with more and harder layers, including site-hosted web puzzles.
- Ciphers come mostly from dcode.fr, including its image/symbol ciphers.
- The site has **no built-in tools** (no decoders, hex viewers, cipher wheels). Players use outside tools; the site only hosts reference pages and puzzle pages.
- Puzzles are **fixed and handmade**: each one has a fixed final answer that the site uses as the key for a corruption step. Compute and round-trip-check every ciphertext with a script before writing it into a note.
- Puzzles must work on the player's own OS and browser; nothing that only works inside a game.
- **Never generate images, video or audio for puzzles.** The user makes all media; describe what is needed and ask.

## Visual design

Source of truth: `design-inspiration.html` (dark, metallic, glassy). Follow it for every page.
- Tokens live in `src/index.css` (`:root` + `@theme`): bg `#09090b`, ink `#f4f4f5`, soft `#a1a1aa`, muted `#71717a`; the `--metal` gradient, `--surface` and `--surface-shadow`; `--ease cubic-bezier(.16,1,.3,1)`. No ad-hoc hex values in components.
- Page background: slow-drifting 135° diagonal stripes under a vignette (already on `body`).
- Layout: `.wrap` max 1160px with 24px gutters, `.section` 120px vertical padding (72px on mobile), floating `.pill` nav at the top, big headings (`.h1`, `.h2`, tight tracking, accent words in `.metal-text`), `.eyebrow` labels, mono font for technical text.
- Components: `.card` (32px radius, glass surface, lifts 4px on `.card-hover`), `.btn-metal` primary and `.btn-ghost` secondary (pill, 46px; `.btn-lg` 58px), `.field` pill input, `.badge`, `.code` blocks, `.tab` inside a `.pill`, `.diamond` bullets.
- Motion: `Reveal` (fade, lift, blur) on scroll. Everything animated must respect `prefers-reduced-motion`.
- Breakpoints to check: 1180, 920, 760, 640, 520 px. Keep a 16px side gutter on phones.
- Hidden puzzle pages may break the style on purpose (the terminal is amber on black), but they still use the shared nav and footer.

## Skills

Project skills live in `.claude/skills/`: React/Tailwind design (`frontend-design`, `react-best-practices`, `composition-patterns`, `web-design-guidelines`), `webapp-testing` (Playwright), and Obsidian note authoring (`obsidian-markdown`, `obsidian-bases`, `obsidian-cli`, `json-canvas`). Use the Obsidian skills when editing the vault.
