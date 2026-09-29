**[rastuharem.me](https://rastuharem.netlify.app/)**

My personal website

## Photography

Keep your originals outside this repository. Import web copies with `pnpm photos /path/to/incoming-photos` (a file or directory), or place files with fresh names in `public/photos` and run `pnpm photos`. The import command reads capture and camera details, skips duplicate source files, auto-orients and compresses each image using the site's Sharp settings, strips EXIF, and renames it to `p-<capture-time>-000-<collision>.<format>`. Each image gets a JSON sidecar, which is the source for gallery ordering and photo details. If a photo has no EXIF capture time, add a same-basename JSON file with `takenAt` in `YYYY-MM-DDTHH:mm:ss` format before importing it.

Run `pnpm photos:index` to rebuild the paged gallery data from sidecars. `dev`, `build`, and `generate` run this step automatically. Commit the generated `public/photo-index` files with the photos so static builds can serve the index.

<br>

<samp>Code is licensed under <a href='./LICENSE'>MIT</a>,<br> Words are licensed under <a href='https://creativecommons.org/licenses/by-nc-sa/4.0/'>CC BY-NC-SA 4.0</a></samp>.
