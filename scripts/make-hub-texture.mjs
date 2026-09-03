import sharp from 'sharp'

const SRC = 'public/images/titantron-1.png'
const OUT = 'public/images/titantron-hub.png'

// Downscale to a true low-res bitmap, then let CSS upscale it with
// image-rendering: pixelated (PRD §8). Palette PNG quantizes toward the 8-bit look.
await sharp(SRC)
  .resize(320, 180, { fit: 'cover' })
  .png({ palette: true, colors: 64, compressionLevel: 9 })
  .toFile(OUT)

const meta = await sharp(OUT).metadata()
console.log(`wrote ${OUT} (${meta.width}x${meta.height})`)
