import sharp from 'sharp'

const src = '/tmp/logo-src.jpg'

const { data, info } = await sharp(src)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width, height, channels } = info
const out = Buffer.alloc(width * height * 4)

// The logo is black artwork on a light-gray background.
// Build an alpha mask from luminance: dark pixels -> opaque, light -> transparent.
// Produce a WHITE logo so it reads on the dark theme.
for (let i = 0; i < width * height; i++) {
  const r = data[i * channels]
  const g = data[i * channels + 1]
  const b = data[i * channels + 2]
  const lum = 0.299 * r + 0.587 * g + 0.114 * b

  let alpha = (210 - lum) / (210 - 40)
  alpha = Math.max(0, Math.min(1, alpha))
  const a = Math.round(alpha * 255)

  out[i * 4] = 255
  out[i * 4 + 1] = 255
  out[i * 4 + 2] = 255
  out[i * 4 + 3] = a
}

await sharp(out, { raw: { width, height, channels: 4 } })
  .png()
  .trim()
  .toFile('/vercel/share/v0-project/public/images/logo-mark-white.png')

const outBlack = Buffer.alloc(width * height * 4)
for (let i = 0; i < width * height; i++) {
  outBlack[i * 4] = 0
  outBlack[i * 4 + 1] = 0
  outBlack[i * 4 + 2] = 0
  outBlack[i * 4 + 3] = out[i * 4 + 3]
}
await sharp(outBlack, { raw: { width, height, channels: 4 } })
  .png()
  .trim()
  .toFile('/vercel/share/v0-project/public/images/logo-mark-black.png')

console.log('done', width, height)
