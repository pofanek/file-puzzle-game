// External assets that YOU create (Imgur, Pastebin, YouTube, Mediafire…). Fill the values in,
// and every puzzle that needs them unlocks automatically. Empty string = not made yet.
// What each asset must contain is described in the vault: 07 Puzzles/<Difficulty>/<puzzle>.md
export const LINKS: Record<string, string> = {
  e2_youtube: 'https://youtu.be/ScJLzKYYC6o',
  e5_pastebin: 'https://pastebin.com/0iHwwvku',
  m1_imgur: '',
  m2_imgur: '',
  m4_pastebin: 'https://pastebin.com/Gryf9bXQ',
  m5_pastebin: 'https://pastebin.com/xZBnAr16',
  h1_mediafire_first_id: '3ntb1m1kr0ag9lz', // needs the whole backwards-built chain, see H1 note
  h2_youtube_channel: '',
  h2_pastebin: '',
  h2_imgur: '',
  h3_imgur: '', // printed by the terminal command "vault"
  h4_imgur: '',
  h4_pastebin: '',
  h4_youtube: '',
  h5_pastebin: '',
  h5_pastebin2: '', // text: "the second carving says: dune" (its ID goes on carving 2)
  x1_gif: '', // relative or absolute URL of icon.gif (frame 58 = "glacier")
  x1_mp3: '', // tempest.mp3
  x1_sky: '', // sky photo with EXIF
  x2_fish: '', // fish picture, top-left 4 pixels per the X2 note
  x3_imgur_rainbow: '',
  x3_imgur_mayan: '',
  x4_mediafire: '', // link to glyphic.zip
  x5_pastebin_1: '',
}
