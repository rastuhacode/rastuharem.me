import { fileURLToPath } from "node:url";
import sharp from "sharp";

for (const locale of ["en", "ru"]) {
  const source = fileURLToPath(new URL(`../public/images/social-card-${locale}.svg`, import.meta.url));
  const output = source.replace(/\.svg$/, ".png");
  await sharp(source).png().toFile(output);
}
