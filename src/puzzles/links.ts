// External assets that YOU create (Imgur, Pastebin, YouTube, Mediafire…). Fill the values in,
// and every puzzle that needs them unlocks automatically. Empty string = not made yet.
// What each asset must contain is described in the vault: 07 Puzzles/<Difficulty>/<puzzle>.md
export const LINKS: Record<string, string> = {
  e2_youtube: 'https://youtu.be/ScJLzKYYC6o',
  e5_pastebin: 'https://pastebin.com/0iHwwvku',
  m1_imgur: 'https://imgur.com/a/APLDYte',
  m2_imgur: 'https://imgur.com/a/4W7S3f7',
  m4_pastebin: 'https://pastebin.com/Gryf9bXQ',
  m5_pastebin: 'https://pastebin.com/xZBnAr16',
  h1_mediafire_first_id: '3ntb1m1kr0ag9lz', // needs the whole backwards-built chain, see H1 note
  h2_youtube_channel: 'https://www.youtube.com/channel/UC3j4qftkhMb_LDfls9yzQsw',
  h2_pastebin: 'https://pastebin.com/ifKkesDN',
  h2_imgur: 'https://imgur.com/a/2lhtmyv',
  h3_imgur: 'https://imgur.com/a/kFvUpjX', // printed by the terminal command "vault"
  h4_imgur: 'https://imgur.com/a/1Vo62C3',
  h4_pastebin: 'https://pastebin.com/4pTBAjSN',
  h4_youtube: 'https://youtu.be/ij5b4St3Qqc',
  h5_pastebin: 'https://pastebin.com/L50P1eXA',
  h5_pastebin2: 'https://pastebin.com/t1kSZ83Z', // text: "the second carving says: dune" (its ID goes on carving 2)
  x1_gif: '', // relative or absolute URL of icon.gif (frame 58 = "glacier")
  x1_mp3: '', // tempest.mp3
  x1_sky: '', // sky photo with EXIF
  x2_fish: '', // fish picture, top-left 4 pixels per the X2 note
  x3_imgur_rainbow: '',
  x3_imgur_mayan: '',
  x4_mediafire: '', // link to glyphic.zip
  x5_pastebin_1: '',
}
