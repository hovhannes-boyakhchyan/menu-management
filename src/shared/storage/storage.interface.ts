export interface StorageUploadParams {
  buffer: Buffer;
  filename: string;
  folder?: string;
  mimeType?: string;
}

export interface StorageUploadResult {
  url?: string;
  fileId?: string;
  provider: string;
  raw?: unknown;
}

export interface StorageService {
  uploadImage(params: StorageUploadParams): Promise<StorageUploadResult>;
  deleteImage(fileId: string): Promise<void>;
}

export const STORAGE_SERVICE = 'STORAGE_SERVICE';
