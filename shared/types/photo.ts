export interface PortfolioPhoto {
  src: string;
  fileName: string;
  width: number;
  height: number;
  takenAt: string;
  camera?: string;
  lens?: string;
  focalLength?: string;
  shutter?: string;
  aperture?: string;
  iso?: number;
}

export interface PhotoSidecar extends PortfolioPhoto {
  originalName: string;
  sourceHash: string;
}

export interface PhotoIndexManifest {
  count: number;
  pageSize: number;
  pages: number;
}
