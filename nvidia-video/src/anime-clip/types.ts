export type AssetKind = "image" | "video";

export type LyricLine = {
  start: number;
  end: number;
  original: string;
  portuguese: string;
};

export type AnimeScene = {
  id: string;
  title: string;
  start: number;
  duration: number;
  lyricNote: string;
  visual: string;
  prompt: string;
  shot: string;
  camera: string;
  emotion: string;
  transition: string;
  asset: string;
  assetKind: AssetKind;
  hasVisualAsset: boolean;
};
