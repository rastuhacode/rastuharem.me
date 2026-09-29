import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import sharp from "sharp";
import type { PhotoSidecar } from "../shared/types/photo";
import { readPhotoExif } from "../server/utils/readPhotoExif";
import { compressSharp } from "./img-compress";
import { buildPhotoIndex } from "./photos-index";

const photosDirectory = resolve("public/photos");
const supportedImage = /\.(?:jpe?g|png|webp)$/i;

function validTakenAt(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(value)) return false;
  const [date, time] = value.split("T");
  const [year, month, day] = date!.split("-").map(Number);
  const [hour, minute, second] = time!.split(":").map(Number);
  return month! >= 1 && month! <= 12 && day! >= 1 && day! <= new Date(Date.UTC(year!, month!, 0)).getUTCDate()
    && hour! < 24 && minute! < 60 && second! < 60;
}

async function inputsFromArgs(args: string[]) {
  if (!args.length) args = [photosDirectory];
  const paths: string[] = [];
  for (const arg of args) {
    const path = resolve(arg);
    if ((await fs.stat(path)).isDirectory()) {
      for (const name of await fs.readdir(path)) paths.push(resolve(path, name));
    }
    else paths.push(path);
  }
  return paths.filter(path => supportedImage.test(path) && !basename(path).startsWith("p-"));
}

async function run() {
  await fs.mkdir(photosDirectory, { recursive: true });
  const sourceHashes = new Map<string, string>();
  for (const name of await fs.readdir(photosDirectory)) {
    if (!/^p-.*\.json$/i.test(name)) continue;
    const sidecar = JSON.parse(await fs.readFile(resolve(photosDirectory, name), "utf8")) as PhotoSidecar;
    if (sidecar.sourceHash) sourceHashes.set(sidecar.sourceHash, sidecar.fileName);
  }

  const inputs = await inputsFromArgs(process.argv.slice(2));
  for (const source of inputs) {
    const original = await fs.readFile(source);
    const sourceHash = createHash("sha256").update(original).digest("hex");
    if (sourceHashes.has(sourceHash)) {
      console.log(`[DUP] ${source} = ${sourceHashes.get(sourceHash)}`);
      if (dirname(source) === photosDirectory) await fs.unlink(source);
      continue;
    }

    const metadata = await sharp(original).metadata();
    const exif = readPhotoExif(metadata.exif);
    const overridePath = source.replace(/\.[^.]+$/, ".json");
    const override = await fs.readFile(overridePath, "utf8").then(text => JSON.parse(text) as Partial<PhotoSidecar>).catch((error: NodeJS.ErrnoException) => {
      if (error.code === "ENOENT") return {};
      throw error;
    });
    const takenAt = override.takenAt ?? exif.takenAt;
    if (!validTakenAt(takenAt)) throw new Error(`Missing or invalid capture time for ${source}. Add takenAt to ${overridePath}.`);

    const ext = metadata.format === "jpeg" ? ".jpg" : `.${metadata.format}`;
    const prefix = `p-${takenAt.replace(/[-:T]/g, "-")}-000-`;
    let collision = 1;
    let fileName = `${prefix}${collision}${ext}`;
    while (await fs.access(resolve(photosDirectory, fileName)).then(() => true, () => false)
      || await fs.access(resolve(photosDirectory, fileName.replace(/\.[^.]+$/, ".json"))).then(() => true, () => false)) {
      fileName = `${prefix}${++collision}${ext}`;
    }

    const outputPath = resolve(photosDirectory, fileName);
    const sidecarPath = outputPath.replace(/\.[^.]+$/, ".json");
    const tempImage = resolve(photosDirectory, `.photo-${randomUUID()}.tmp`);
    const tempJson = resolve(photosDirectory, `.photo-${randomUUID()}.json.tmp`);
    const { outBuffer } = await compressSharp(sharp(original), original, source, outputPath);
    const outputMetadata = await sharp(outBuffer).metadata();
    if (!outputMetadata.width || !outputMetadata.height || outputMetadata.exif) {
      throw new Error(`Invalid compressed output for ${source}`);
    }
    const sidecar: PhotoSidecar = {
      src: `/photos/${encodeURIComponent(fileName)}`,
      fileName,
      width: outputMetadata.width,
      height: outputMetadata.height,
      takenAt,
      camera: override.camera ?? exif.camera,
      lens: override.lens ?? exif.lens,
      focalLength: override.focalLength ?? exif.focalLength,
      shutter: override.shutter ?? exif.shutter,
      aperture: override.aperture ?? exif.aperture,
      iso: override.iso ?? exif.iso,
      originalName: basename(source),
      sourceHash,
    };

    try {
      await fs.writeFile(tempImage, outBuffer, { flag: "wx" });
      await fs.writeFile(tempJson, JSON.stringify(sidecar, null, 2) + "\n", { flag: "wx" });
      await fs.rename(tempImage, outputPath);
      await fs.rename(tempJson, sidecarPath);
    }
    catch (error) {
      await Promise.allSettled([fs.unlink(tempImage), fs.unlink(tempJson), fs.unlink(outputPath)]);
      throw error;
    }

    sourceHashes.set(sourceHash, fileName);
    if (dirname(source) === photosDirectory) {
      await fs.unlink(source);
      if (Object.keys(override).length) await fs.unlink(overridePath);
    }
    console.log(`[PHOTO] ${basename(source)} -> ${fileName} (${Math.round(original.length / 1024)} KB -> ${Math.round(outBuffer.length / 1024)} KB)`);
  }

  const manifest = await buildPhotoIndex();
  console.log(`Indexed ${manifest.count} photos in ${manifest.pages} page(s)`);
}

await run();
