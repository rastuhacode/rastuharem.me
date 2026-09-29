type ExifValue = string | number | undefined;

/** Read the small set of standard TIFF/EXIF fields shown in the portfolio. */
export function readPhotoExif(buffer?: Buffer) {
  if (!buffer) return {};

  const tiffStart = buffer.subarray(0, 6).toString("ascii") === "Exif\0\0" ? 6 : 0;
  const data = new DataView(buffer.buffer, buffer.byteOffset + tiffStart, buffer.length - tiffStart);
  if (data.byteLength < 8) return {};

  const byteOrder = data.getUint16(0);
  if (byteOrder !== 0x4949 && byteOrder !== 0x4d4d) return {};
  const littleEndian = byteOrder === 0x4949;
  if (data.getUint16(2, littleEndian) !== 42) return {};

  const sizes: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };

  function inBounds(offset: number, length: number) {
    return Number.isSafeInteger(offset) && Number.isSafeInteger(length)
      && offset >= 0 && length >= 0 && offset + length <= data.byteLength;
  }

  function uint32(offset: number) {
    return data.getUint32(offset, littleEndian);
  }

  function readValue(entryOffset: number): ExifValue {
    const type = data.getUint16(entryOffset + 2, littleEndian);
    const count = uint32(entryOffset + 4);
    const byteLength = (sizes[type] || 0) * count;
    if (!byteLength || !inBounds(entryOffset, 12)) return;

    const valueOffset = byteLength <= 4 ? entryOffset + 8 : uint32(entryOffset + 8);
    if (!inBounds(valueOffset, byteLength)) return;

    if (type === 2) {
      const bytes = new Uint8Array(data.buffer, data.byteOffset + valueOffset, byteLength);
      return new TextDecoder().decode(bytes).replace(/\0.*$/, "").trim();
    }
    if (type === 3) return data.getUint16(valueOffset, littleEndian);
    if (type === 4) return uint32(valueOffset);
    if (type === 5 || type === 10) {
      const numerator = type === 5 ? uint32(valueOffset) : data.getInt32(valueOffset, littleEndian);
      const denominator = type === 5 ? uint32(valueOffset + 4) : data.getInt32(valueOffset + 4, littleEndian);
      return denominator ? numerator / denominator : undefined;
    }
  }

  function readIfd(offset: number) {
    const tags = new Map<number, ExifValue>();
    if (!inBounds(offset, 2)) return tags;
    const count = data.getUint16(offset, littleEndian);
    for (let index = 0; index < count; index++) {
      const entryOffset = offset + 2 + index * 12;
      if (!inBounds(entryOffset, 12)) break;
      tags.set(data.getUint16(entryOffset, littleEndian), readValue(entryOffset));
    }
    return tags;
  }

  const primary = readIfd(uint32(4));
  const exifOffset = primary.get(0x8769);
  const details = typeof exifOffset === "number" ? readIfd(exifOffset) : new Map<number, ExifValue>();
  const number = (tag: number) => {
    const value = details.get(tag);
    return typeof value === "number" ? value : undefined;
  };
  const string = (tag: number) => {
    const value = details.get(tag) ?? primary.get(tag);
    return typeof value === "string" && value ? value : undefined;
  };

  const exposure = number(0x829a);
  const dateTime = string(0x9003);
  const dateMatch = dateTime?.match(/^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
  const takenAt = dateMatch
    ? `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}T${dateMatch[4]}:${dateMatch[5]}:${dateMatch[6]}`
    : undefined;

  return {
    takenAt,
    camera: string(0x0110),
    lens: string(0xa434),
    focalLength: number(0x920a) === undefined ? undefined : `${Number(number(0x920a)!.toFixed(1))} mm`,
    shutter: exposure === undefined ? undefined : exposure >= 1 ? `${Number(exposure.toFixed(1))} s` : `1/${Math.round(1 / exposure)} s`,
    aperture: number(0x829d) === undefined ? undefined : `f/${Number(number(0x829d)!.toFixed(1))}`,
    iso: number(0x8827),
  };
}
