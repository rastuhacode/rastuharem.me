import fs from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { PhotoIndexManifest, PhotoSidecar, PortfolioPhoto } from "../shared/types/photo";

export const PAGE_SIZE = 60;

export async function buildPhotoIndex(root = process.cwd()) {
  const photosDirectory = resolve(root, "public/photos");
  const indexDirectory = resolve(root, "public/photo-index");
  const entries = await fs.readdir(photosDirectory);
  const sidecars = entries.filter(name => /^p-.*\.json$/i.test(name));
  const sidecarNames = new Set(sidecars);
  const photos: PortfolioPhoto[] = [];
  for (const name of sidecars) {
    const sidecar = JSON.parse(await fs.readFile(resolve(photosDirectory, name), "utf8")) as PhotoSidecar;
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(sidecar.takenAt)
      || !/^p-.*\.(?:jpe?g|png|webp)$/i.test(sidecar.fileName)
      || name !== sidecar.fileName.replace(/\.[^.]+$/, ".json")
      || sidecar.src !== `/photos/${encodeURIComponent(sidecar.fileName)}`
      || !Number.isFinite(sidecar.width) || sidecar.width <= 0
      || !Number.isFinite(sidecar.height) || sidecar.height <= 0) {
      throw new Error(`Invalid photo metadata: ${name}`);
    }
    await fs.access(resolve(photosDirectory, sidecar.fileName));
    const { sourceHash: _sourceHash, originalName: _originalName, ...photo } = sidecar;
    photos.push(photo);
  }
  for (const name of entries.filter(name => /^p-.*\.(?:jpe?g|png|webp)$/i.test(name))) {
    if (!sidecarNames.has(name.replace(/\.[^.]+$/, ".json"))) throw new Error(`Missing metadata for ${name}`);
  }

  photos.sort((a, b) => b.takenAt.localeCompare(a.takenAt) || b.fileName.localeCompare(a.fileName));
  const manifest: PhotoIndexManifest = {
    count: photos.length,
    pageSize: PAGE_SIZE,
    pages: Math.ceil(photos.length / PAGE_SIZE),
  };

  await fs.mkdir(indexDirectory, { recursive: true });
  const expected = new Set<string>(["manifest.json"]);
  for (let page = 0; page < manifest.pages; page++) {
    const name = `page-${String(page + 1).padStart(4, "0")}.json`;
    expected.add(name);
    await fs.writeFile(resolve(indexDirectory, name), JSON.stringify(photos.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)));
  }
  if (manifest.pages === 0) {
    expected.add("page-0001.json");
    await fs.writeFile(resolve(indexDirectory, "page-0001.json"), "[]");
  }
  await fs.writeFile(resolve(indexDirectory, "manifest.json"), JSON.stringify(manifest));
  for (const name of await fs.readdir(indexDirectory)) {
    if (/^page-\d+\.json$/.test(name) && !expected.has(name)) await fs.unlink(resolve(indexDirectory, name));
  }
  return manifest;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const manifest = await buildPhotoIndex();
  console.log(`Indexed ${manifest.count} photos in ${manifest.pages} page(s)`);
}
