import type { PortfolioPhoto } from "../types/photo";

export interface PhotoTile {
  photo: PortfolioPhoto;
  index: number;
  column: number;
  x: number;
  y: number;
  width: number;
  height: number;
  imageHeight: number;
}

export interface PhotoLayout {
  columns: PhotoTile[][];
  tiles: PhotoTile[];
  height: number;
}

// Place each photo in the shortest column. Explicit sizes let us find visible
// cards without mounting every image or waiting for images to load.
export function layoutPhotos(photos: PortfolioPhoto[], columnCount: number, containerWidth: number, gap: number): PhotoLayout {
  const columns = Array.from({ length: columnCount }, () => [] as PhotoTile[]);
  const tiles: PhotoTile[] = [];
  const columnWidth = (containerWidth - gap * (columnCount - 1)) / columnCount;
  const columnHeights = Array.from({ length: columnCount }, () => 0);

  for (const [index, photo] of photos.entries()) {
    let column = 0;
    for (let candidate = 1; candidate < columnCount; candidate++) {
      if (columnHeights[candidate]! < columnHeights[column]!) column = candidate;
    }
    const imageHeight = (columnWidth - 6) * photo.height / photo.width;
    const height = imageHeight + 41; // 3px borders and a 35px caption
    const tile: PhotoTile = {
      photo,
      index,
      column,
      x: column * (columnWidth + gap),
      y: columnHeights[column]!,
      width: columnWidth,
      height,
      imageHeight,
    };
    columns[column]!.push(tile);
    tiles.push(tile);
    columnHeights[column] = columnHeights[column]! + height + gap;
  }

  return { columns, tiles, height: Math.max(0, ...columnHeights.map(height => height - gap)) };
}

export function visiblePhotoTiles(layout: PhotoLayout, top: number, bottom: number) {
  const visible: PhotoTile[] = [];
  for (const column of layout.columns) {
    let low = 0;
    let high = column.length;
    while (low < high) {
      const middle = (low + high) >>> 1;
      if (column[middle]!.y + column[middle]!.height < top) low = middle + 1;
      else high = middle;
    }
    for (let index = low; index < column.length && column[index]!.y <= bottom; index++) {
      visible.push(column[index]!);
    }
  }
  return visible.sort((a, b) => a.index - b.index);
}
