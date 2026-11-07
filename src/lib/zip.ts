import JSZip from 'jszip'

export interface PackFile { name: string; data: Uint8Array | string }

export async function buildZip(files: PackFile[]): Promise<Blob> {
  const zip = new JSZip()
  for (const f of files) zip.file(f.name, f.data)
  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
}

export function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
