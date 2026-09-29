import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, "path");
  if (!name || !/^(?:manifest|page-\d{4,})\.json$/.test(name)) throw createError({ statusCode: 404 });
  try {
    const file = resolve(process.cwd(), "public/photo-index", name);
    setHeader(event, "content-type", "application/json; charset=utf-8");
    return JSON.parse(await readFile(file, "utf8"));
  }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") throw createError({ statusCode: 404 });
    throw error;
  }
});
