export interface UploadedFile {
  file: File;
  base64: string;
}

export type AspectRatio = '1:1' | '2:1' | '4:5' | '3:2';

export interface GeneratedImage {
  id: string;
  src: string;
  prompt: string;
  aspectRatio: AspectRatio;
}
