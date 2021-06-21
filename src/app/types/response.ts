export interface ISubtitle {
  title: string;
  url: string;
}

export interface IVideo {
  videoUrl: string;
  subtitles: Array<ISubtitle>;
}