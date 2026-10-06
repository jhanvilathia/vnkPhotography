// Makes small web copies of the full-size photos for the site to display.
// Full-size originals live in originals/ (not deployed — they're uploaded to
// a GitHub Release for the Download button). Web copies go to public/photos/.
//
// Run: npm run resize
import { readdir, mkdir } from "node:fs/promises";
import sharp from "sharp";

const SRC = "originals";
const OUT = "public/photos";

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => /\.jpe?g$/i.test(f));

for (const f of files) {
  await sharp(`${SRC}/${f}`)
    .rotate() // apply EXIF orientation so portrait shots aren't sideways
    .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(`${OUT}/${f}`);
  console.log(`resized ${f}`);
}
